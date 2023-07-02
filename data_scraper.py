import asyncio
import json
from io import StringIO
from typing import Coroutine

import aiohttp
import lxml.html

CURATED_UNITS = {
  "FI_7999": {
    "mpc": "Blank Game Cards (63 x 88mm)"
  },
  "FI_9896": {
    "ps": "Blank Game Cards (63 x 88mm)"
  },
  "FI_569": {
    "mpc": "Blank Poker Cards (63.5 x 88.9mm)",
    "ps": "Blank Poker Cards (63.5 x 88.9mm)"
  },
  "FI_4332": {
    "mpc": "Blank Bridge Cards (57mm x 89mm)",
    "ps": "Blank Bridge Cards (57mm x 89mm)"
  },
  "FI_8854": {
    "mpc": "Blank Mini American Cards (41mm x 63mm)"
  },
  "FI_8866": {
    "mpc": "Blank Mini European Cards (44mm x 67mm)"
  },
  "FI_21757": {
    "ps": "Blank Mini European Cards (44mm x 67mm)"
  },
  "FI_5073": {
    "mpc": "Blank Tarot Cards (70mm x 121mm)"
  },
  "FI_7852": {
    "ps": "Blank Tarot Cards (70mm x 121mm)"
  },
  "FI_8459": {
    "mpc": "Blank Square Cards (70mm x 70mm)"
  },
  "FI_21756": {
    "ps": "Blank Square Cards (70mm x 70mm)"
  },
  "FI_8005": {
    "mpc": "Blank Square Cards (89mm x 89mm)"
  },
  "FI_8892": {
    "mpc": "Blank Jumbo Cards (89mm x 127mm)"
  }
}

class SiteConfig:
  def __init__(self, domain, code, finish=True):
    self.domain = domain
    self.code = code
    self.finish = finish


class ScrapeData:
  def __init__(self, session: aiohttp.ClientSession):
    self.session = session
    self.units = {}
    self.card_stocks = {}
    self.print_types = {}
    self.packagings = {}
    self.finishes = {}

  async def get_html(self, url, params=None):
    async with self.session.get(url, params=params) as r:
      return lxml.html.parse(StringIO(await r.text()))

  async def get_json(self, url, params=None):
    async with self.session.get(url, params=params) as r:
      return json.loads(await r.text())

  async def scrape(self, site: SiteConfig, url):
    html = await self.get_html(url)
    nodes = html.xpath('//*[@id="main_content"]//*[@class="mc_photobox"][1]//*[@class="mcpb_item"]//a/@href')
    units = [
      self.scrape_unit(site, url)
      for url in nodes
    ]

    next = html.xpath('//*[@id="main_content"]//*[@class="linkbox"][1]//a[contains(text(), "Next")]/@href')
    if next:
      units += await self.scrape(site, next[0])

    return units

  def expected_unpick_info(self, value):
    return {
      "SortNo": value['sortNo'],
      "X": value['x'],
      "Y": value['y'],
      "Width": value['width'],
      "Height": value['height'],
      "Rotate": 0.0,
      "Alpha": 1.0,
      "TipX": 0,
      "TipY": 0,
      "TipWidth": 0,
      "Resolution": value['dpi'],
      "AllowEdit": "Y",
      "AllowMove": "Y",
      "AutoDirection": 'Y' if value['auto'] else 'N',
      "ApplyMask": 'Y' if value['applyMask'] else 'N',
      "RealX": int(value['x'] * value['dpi'] / 100),
      "RealY": int(value['y'] * value['dpi'] / 100),
      "RealWidth": int(value['width'] * value['dpi'] / 100),
      "RealHeight": int(value['height'] * value['dpi'] / 100),
    }

  def expected_pixel_info(self, value):
    padding = value['padding']
    safe = value['safe']
    return {
      # Should be x * 2 but it
      "ProductWidth": value['productWidth'],
      "ProductHeight": value['productHeight'],
      "ProductPadding": value['productPadding'],
      "PaddingLeft": padding,
      "PaddingTop": padding,
      "PaddingRight": padding,
      "PaddingBottom": padding,
      "SafeLeft": safe,
      "SafeTop": safe,
      "SafeRight": safe,
      "SafeBottom": safe,
      "Radius": 0,
      "IsUnpick": 'Y' if value['unpick'] else 'N',
      "IsLapped": "N",
      "IsPartImage": "N",
      "LappedType": value['lappedType'],
      "LappedRow": 0,
      "LappedCol": 0,
      "Resolution": value['dpi'],
      "AllowDesign": "Y",
      "PreviewWidth": value['productWidth'] + (padding * 2),
      "PreviewHeight": value['productHeight'] + (padding * 2),
      "Filter": value['filter'],
      "AllowEditFilter": "Y",
      "ImageMode": "B",
      "IsTextZoom": "Y"
    }

  def default_unit(self, unit_code, unit_name, max_cards, product_code, front_design_code, back_design_code, unpick_info, pixel_info):
    return {
      'code': unit_code,
      'name': {},
      'productCode': product_code,
      'frontDesignCode': front_design_code,
      'backDesignCode': back_design_code,
      'width': unpick_info['Width'],
      'height': unpick_info['Height'],
      'productWidth': pixel_info['ProductWidth'],
      'productHeight': pixel_info['ProductHeight'],
      'productPadding': pixel_info['ProductPadding'],
      'dpi': unpick_info['Resolution'],
      'filter': pixel_info['Filter'],
      'auto': unpick_info['AutoDirection'] == 'Y',
      'scale': 1,
      'sortNo': unpick_info['SortNo'],
      'applyMask': unpick_info['ApplyMask'] == 'Y',
      'maxCards': max_cards,
      'padding': pixel_info['PaddingTop'],
      'safe': pixel_info['SafeTop'],
      'unpick': pixel_info['IsUnpick'] == 'Y',
      'x': unpick_info['X'],
      'y': unpick_info['Y'],
      'lappedType': pixel_info['LappedType'],
    }

  async def scrape_unit(self, site: SiteConfig, url):
    print(url)
    html = await self.get_html(url)

    unit_code = html.xpath('//input[@id="hidd_itemid"]/@value')[0]
    unit_name = html.xpath('//*[@id="main_content"]//div[@class="proinfowrap"]//h1//text()')[0]
    print(unit_code, unit_name)
    min_cards = int(html.xpath('//select[@id="dro_choosesize"]/option')[0].attrib['value'])
    max_cards = int(html.xpath('//select[@id="dro_choosesize"]/option')[-1].attrib['value'])

    async with aiohttp.ClientSession() as session:
      async with session.get(f'{site.domain}/products/pro_item_process_flow.aspx', params={
        'itemid': unit_code,
        #'packid': packaging['PackingNo'],
        #'attachno': card_stock_code,
        'pcs': min_cards,
        'qty': '1',
        #'processno': finish['ProcessNo'],
      }) as r:
        front_html = lxml.html.parse(StringIO(await r.text()))
        hd_parameter =  json.loads(front_html.xpath('//input[@id="hdParameter"]')[0].attrib['value'])
        product_code = hd_parameter['Base']['ProductCode']
        front_design_code = hd_parameter['Base']['ProductDesign']
        unpick_info = json.loads(hd_parameter['Base']['UnpickInfo'])[0]
        pixel_info = json.loads(hd_parameter['Base']['PixelInfo'])

        async with session.get(str(r.url).replace('dn_playingcards_front_dynamic.aspx', 'dn_playingcards_back_dynamic.aspx')) as r:
          back_html = lxml.html.parse(StringIO(await r.text()))
          hd_parameter =  json.loads(back_html.xpath('//input[@id="hdParameter"]')[0].attrib['value'])
          back_design_code = hd_parameter['Base']['ProductDesign']

          value = self.units.setdefault(unit_code, self.default_unit(
            unit_code=unit_code,
            unit_name=unit_name,
            product_code=product_code,
            front_design_code=front_design_code,
            back_design_code=back_design_code,
            unpick_info=unpick_info,
            pixel_info=pixel_info,
            max_cards=max_cards,
          ))
          value['name'][site.code] = unit_name

          expected_unpick_info = self.expected_unpick_info(value)
          if unpick_info != expected_unpick_info:
            print('expected_unpick_info')
            for k, v in unpick_info.items():
              expected_value = expected_unpick_info[k]
              if v != expected_value:
                print(f'{k} = {v} != {expected_value}')

          expected_pixel_info = self.expected_pixel_info(value)
          if pixel_info != expected_pixel_info:
            print('expected_pixel_info')
            for k, v in pixel_info.items():
              expected_value = expected_pixel_info[k]
              if v != expected_value:
                print(f'{k} = {v} != {expected_value}')

          await asyncio.wait([
            asyncio.create_task(self.scrape_card_stock(site, card_stock, unit_code, product_code, min_cards))
            for card_stock in html.xpath('//select[@id="dro_paper_type"]//option')
          ])

  async def scrape_card_stock(self, site: SiteConfig, card_stock, unit_code, product_code, min_cards):
      card_stock_code = card_stock.attrib['value']
      card_stock_name = card_stock.text
      value = self.card_stocks.setdefault(card_stock_code, {
        'code': card_stock_code,
        'name': {},
        'productCodes': set(),
      })
      value['name'][site.code] = card_stock_name
      value['productCodes'].add(product_code)

      self.default_print_type(site, product_code)
      for print_type in await self.get_print_types(site, unit_code, card_stock_code, min_cards):
        self.scrape_print_type(site, print_type, product_code)

      for packaging in await self.get_packagings(site, unit_code, card_stock_code, min_cards):
        self.scrape_packaging(site, packaging, product_code)

      if site.finish:
        for finish in await self.get_finishes(site, unit_code, card_stock_code, min_cards):
          self.scrape_finish(site, finish, product_code)
      else:
        value = self.finishes.setdefault("", {
          'code': "",
          'name': {},
          'productCodes': set(),
        })
        value['name'][site.code] = "None"
        value['productCodes'].add(product_code)

  def default_print_type(self, site: SiteConfig, product_code):
    print_type_code = ""
    value = self.print_types.setdefault(print_type_code, {
      "code": print_type_code,
      "name": {},
      "productCodes": set(),
    })
    value["name"][site.code] = "Full color print"
    value["productCodes"].add(product_code)

  async def get_print_types(self, site: SiteConfig, unit_code, card_stock_code, min_cards):
    return await self.get_json(f'{site.domain}/api/publish/getproducteffectinfo.ashx', params={
      'unitno': unit_code,
      'attachno': card_stock_code,
      'minPieces': min_cards,
      'pieces': min_cards,
    })

  def scrape_print_type(self, site: SiteConfig, print_type, product_code):
    print_type_code = print_type['EffectNo']
    value = self.print_types.setdefault(print_type_code, {
      'code': print_type_code,
      'name': {},
      'productCodes': set(),
    })
    value['name'][site.code] = print_type['PublishDesc']
    value['productCodes'].add(product_code)

  async def get_packagings(self, site: SiteConfig, unit_code, card_stock_code, min_cards):
    return await self.get_json(f'{site.domain}/api/publish/getpackinginfo.ashx', params={
      'unitno': unit_code,
      'attachno': card_stock_code,
      'pefno': '',
      'pieces': min_cards,
      'bookletNo': '',
      'blMaterial': '',
    })

  def scrape_packaging(self, site: SiteConfig, packaging, product_code):
    packaging_code = packaging['PackingNo']
    value = self.packagings.setdefault(packaging_code, {
      'code': packaging_code,
      'name': {},
      'productCodes': set(),
    })
    value['name'][site.code] = packaging['PublishDesc']
    value['productCodes'].add(product_code)

  async def get_finishes(self, site: SiteConfig, unit_code, card_stock_code, min_cards):
    return [
      config
      for process in (await self.get_json(f'{site.domain}/api/publish/getproductprocessinfo.ashx', params={
        'unitno': unit_code,
        'attachno': card_stock_code,
        'pieces': min_cards,
        'effectNo': '',
      }))['PanelInfo']
      if process['PublishNo'] == 'PPN_0001'
      for config in process['ConfigInfo']
    ]

  def scrape_finish(self, site: SiteConfig, finish, product_code):
    finish_code = finish['ProcessNo']
    value = self.finishes.setdefault(finish_code, {
      'code': finish_code,
      'name': {},
      'productCodes': set(),
    })
    value['name'][site.code] = finish['PublishDesc']
    value['productCodes'].add(product_code)


class SetEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, set):
      return sorted(obj)
    return json.JSONEncoder.default(self, obj)


async def main():
  async with aiohttp.ClientSession() as session:
    data = ScrapeData(session)
    await asyncio.wait([
      *await data.scrape(
        SiteConfig('https://www.makeplayingcards.com', 'mpc'),
        'https://www.makeplayingcards.com/promotional/blank-playing-cards.html',
      ),
      *await data.scrape(
        SiteConfig('https://www.printerstudio.co.uk', 'ps', finish=False),
        'https://www.printerstudio.co.uk/create-own/blank-playing-cards.html',
      ),
    ])

  with open('src/api/data/unit.json', 'w+') as f:
    json.dump(list(data.units.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

  with open('src/api/data/unit.curated.json', 'w+') as f:
    json.dump([
      {
        **unit,
        "name": name,
      }
      for product_code, name in CURATED_UNITS.items()
      for unit in data.units.values()
      if unit["productCode"] == product_code
    ], f, indent=2, sort_keys=True, cls=SetEncoder)

  with open('src/api/data/card_stock.json', 'w+') as f:
    json.dump(list(data.card_stocks.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

  with open('src/api/data/finish.json', 'w+') as f:
    json.dump(list(data.finishes.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

  with open('src/api/data/packaging.json', 'w+') as f:
    json.dump(list(data.packagings.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

  with open('src/api/data/print_type.json', 'w+') as f:
    json.dump(list(data.print_types.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

asyncio.run(main())
