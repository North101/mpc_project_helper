from io import StringIO
import lxml.html
import requests
import json
import datetime

def get(url, params=None):
  return lxml.html.parse(StringIO(requests.get(url, params=params).text))

def get_json(url, params=None):
  return requests.get(url, params=params).json()


class SiteConfig:
  def __init__(self, domain, code, finish=True):
    self.domain = domain
    self.code = code
    self.finish = finish


class ScrapeData:
  def __init__(self):
    self.units = {}
    self.card_stocks = {}
    self.print_types = {}
    self.packagings = {}
    self.finishes = {}

  def scrape(self, url, site):
    html = get(url)
    nodes = html.xpath('//*[@id="main_content"]//*[@class="mc_photobox"][1]//*[@class="mcpb_item"]//a/@href')
    for index, url in enumerate(nodes):
      print(f'{index + 1} / {len(nodes)}')
      self.scrape_unit(url, site)
    
    next = html.xpath('//*[@id="main_content"]//*[@class="linkbox"][1]//a[contains(text(), "Next")]/@href')
    if next:
      self.scrape(next[0], site)
  
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

  def default_unit(self, unit_code, unit_name, max_cards, product_code, front_design_code, back_design_code, unpick_info, pixel_info, dimensions):
    return {
      'code': unit_code,
      'name': unit_name,
      'siteCodes': set(),
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
      'dimensions': dimensions,
    }
  
  def scrape_unit(self, url, site):
    print(url)
    html = get(url)

    unit_code = html.xpath('//input[@id="hidd_itemid"]/@value')[0]
    unit_name = html.xpath('//*[@id="main_content"]//div[@class="proinfowrap"]//h1//text()')[0]
    max_cards = int(html.xpath('//select[@id="dro_choosesize"]/option')[-1].attrib['value'])
    min_pieces = int(html.xpath('//input[@id="hidd_pieces"]/@value')[0])
    dimensions = html.xpath('//div[@class="productspecbox"]/ul/li/*[contains(text(), "Dimensions:")]/..')[0].text_content().replace('Dimensions: ', '')

    session = requests.Session()
    r = session.get(f'{site.domain}/products/pro_item_process_flow.aspx', params={
      'itemid': unit_code,
      #'packid': packaging['PackingNo'],
      #'attachno': card_stock_code,
      'pcs': min_pieces,
      'qty': '1',
      #'processno': finish['ProcessNo'],
    })
    front_html = lxml.html.parse(StringIO(r.text))
    product_code = front_html.xpath('//input[@id="hidd_itemId"]')[0].attrib['value']
    front_design_code = front_html.xpath('//input[@id="hidd_coverCode"]')[0].attrib['value']
    unpick_info = json.loads(front_html.xpath('//input[@id="hidd_unpick_info"]')[0].attrib['value'])[0]
    pixel_info = json.loads(front_html.xpath('//input[@id="hidd_pixel_info"]')[0].attrib['value'])

    r = session.get(r.url.replace('dn_playingcards_front_dynamic.aspx', 'dn_playingcards_back_dynamic.aspx'))
    back_html = lxml.html.parse(StringIO(r.text))
    back_design_code = back_html.xpath('//input[@id="hidd_bottomCode"]')[0].attrib['value']

    value = self.units.setdefault(unit_code, self.default_unit(
      unit_code=unit_code,
      unit_name=unit_name,
      product_code=product_code,
      front_design_code=front_design_code,
      back_design_code=back_design_code,
      unpick_info=unpick_info,
      pixel_info=pixel_info,
      max_cards=max_cards,
      dimensions=dimensions,
    ))
    value['siteCodes'].add(site.code)

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

    for card_stock in html.xpath('//select[@id="dro_paper_type"]//option'):
      self.scrape_card_stock(card_stock, site, unit_code, product_code, min_pieces, max_cards)

  def scrape_card_stock(self, card_stock, site, unit_code, product_code, min_pieces, max_cards):
      card_stock_code = card_stock.attrib['value']
      card_stock_name = card_stock.text
      value = self.card_stocks.setdefault(card_stock_code, {
        'code': card_stock_code,
        'name': card_stock_name,
        'siteCodes': set(),
        'productCodes': set(),
      })
      value['siteCodes'].add(site.code)
      value['productCodes'].add(product_code)

      for print_type in self.get_print_types(site, unit_code, card_stock_code, min_pieces, max_cards):
        self.scrape_print_type(print_type, site, product_code)

      for packaging in self.get_packagings(site, unit_code, card_stock_code, min_pieces):
        self.scrape_packaging(packaging, site, product_code)

      if site.finish:
        for finish in self.get_finishes(site, unit_code, card_stock_code, min_pieces):
          self.scrape_finish(finish, site, product_code)
  
  def get_print_types(self, site, unit_code, card_stock_code, min_pieces, max_cards):
    return get_json(f'{site.domain}/api/publish/getproducteffectinfo.ashx', params={
      'unitno': unit_code,
      'attachno': card_stock_code,
      'minPieces': min_pieces,
      'pieces': max_cards,
    })

  def scrape_print_type(self, print_type, site, product_code):
    print_type_code = print_type['EffectNo']
    value = self.print_types.setdefault(print_type_code, {
      'code': print_type_code,
      'name': print_type['PublishDesc'],
      'siteCodes': set(),
      'productCodes': set(),
    })
    value['siteCodes'].add(site.code)
    value['productCodes'].add(product_code)
  
  def get_packagings(self, site, unit_code, card_stock_code, min_pieces):
    return get_json(f'{site.domain}/api/publish/getpackinginfo.ashx', params={
      'unitno': unit_code,
      'attachno': card_stock_code,
      'pefno': '',
      'pieces': min_pieces,
      'bookletNo': '',
      'blMaterial': '',
    })
  
  def scrape_packaging(self, packaging, site, product_code):
    packaging_code = packaging['PackingNo']
    value = self.packagings.setdefault(packaging_code, {
      'code': packaging_code,
      'name': packaging['PublishDesc'],
      'siteCodes': set(),
      'productCodes': set(),
    })
    value['siteCodes'].add(site.code)
    value['productCodes'].add(product_code)
  
  def get_finishes(self, site, unit_code, card_stock_code, min_pieces):
    return [
      config
      for process in get_json(f'{site.domain}/api/publish/getproductprocessinfo.ashx', params={
        'unitno': unit_code,
        'attachno': card_stock_code,
        'pieces': min_pieces,
        'effectNo': '',
      })['PanelInfo']
      for config in process['ConfigInfo']
      if config['ProcessGroup'] == 'CARDFINISH'
    ]
  
  def scrape_finish(self, finish, site, product_code):
    finish_code = finish['ProcessNo']
    value = self.finishes.setdefault(finish_code, {
      'code': finish_code,
      'name': finish['PublishDesc'],
      'siteCodes': set(),
      'productCodes': set(),
    })
    value['siteCodes'].add(site.code)
    value['productCodes'].add(product_code)

class SetEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, set):
      return sorted(obj)
    return json.JSONEncoder.default(self, obj)


data = ScrapeData()
data.scrape(
  'https://www.makeplayingcards.com/promotional/blank-playing-cards.html',
  SiteConfig('https://www.makeplayingcards.com', 'mpc'),
)
data.scrape(
  'https://www.printerstudio.co.uk/create-own/blank-playing-cards.html',
  SiteConfig('https://www.printerstudio.co.uk', 'ps', finish=False),
)

with open('src/api/data/unit.json', 'w+') as f:
  json.dump(list(data.units.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

with open('src/api/data/card_stock.json', 'w+') as f:
  json.dump(list(data.card_stocks.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

with open('src/api/data/finish.json', 'w+') as f:
  json.dump(list(data.finishes.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

with open('src/api/data/packaging.json', 'w+') as f:
  json.dump(list(data.packagings.values()), f, indent=2, sort_keys=True, cls=SetEncoder)

with open('src/api/data/print_type.json', 'w+') as f:
  json.dump(list(data.print_types.values()), f, indent=2, sort_keys=True, cls=SetEncoder)
