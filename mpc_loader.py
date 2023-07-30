import argparse
import asyncio
import configparser
import pathlib
from io import StringIO

import aiohttp
import lxml.html


def print_progress_bar(iteration: int, total: int, prefix='', suffix='', decimals=1, length=100, fill='█', print_end='\r'):
  percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
  filled_length = length * iteration // total
  bar = fill * filled_length + '-' * (length - filled_length)
  print(f'\r{prefix} |{bar}| {percent}% {suffix}', end=print_end)
  # Print New Line on Complete
  if iteration == total:
    print()


def parse_html(text):
  return lxml.html.parse(StringIO(text))


def cookies(cookie):
  return {
    "PrinterStudioCookie": cookie,
  }


async def load_image(session, project_id, image):
  async with session.get(f'https://www.makeplayingcards.com/{image}') as r:
    if r.content_type != 'image/jpeg':
      print(f'[{project_id}] Could not load image {image}')


async def load_project_preview(session, project_id):
  r = await session.get(f'https://www.makeplayingcards.com/design/dn_temporary_parse.aspx?id={project_id}&edit=Y')
  if r.real_url.path == '/design/dn_preview_layout.aspx':
    return r

  url = r.real_url.with_path('/design/dn_preview_layout.aspx').with_query(ssid=r.real_url.query['ssid'])
  return await session.post(url)


async def load_project(session, project_id):
  print(f'ProjectId: {project_id}')
  r = await load_project_preview(session, project_id)

  html = parse_html(await r.text())
  front_nodes = html.xpath('//*[@id="divPreviewElements"]//*[@class="m-itemside"]//*[@class="m-front"]//a//img/@src')
  back_nodes = html.xpath('//*[@id="divPreviewElements"]//*[@class="m-itemside"]//*[@class="m-back"]//a//img/@src')

  return [
    (project_id, node[2:])
    for node in (front_nodes + back_nodes)
  ]


async def main(cookies, project_ids):
  async with aiohttp.ClientSession(cookies=cookies) as session:
    images = []
    for project_id in project_ids:
      images += await load_project(session, project_id)

    tasks = [
      asyncio.create_task(load_image(session, project_id, image))
      for (project_id, image) in images
    ]

    tasks_done = 0
    def progress_task(task):
      nonlocal tasks_done
      tasks_done += 1
      print_progress_bar(tasks_done, len(tasks))

    for task in tasks:
      task.add_done_callback(progress_task)
    print('Loading Images:')
    await asyncio.wait(tasks)


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('project_ids', nargs='*')
  args = parser.parse_args()

  config = configparser.ConfigParser()
  config.read(pathlib.Path(__file__).with_suffix('.ini'))
  project_ids = [
    project_id.lower()
    for project_id in args.project_ids
  ]

  asyncio.run(main(
    cookies=cookies(config.get('cookie', 'cookie')),
    project_ids=[
      v
      for k, v in config.items('projects')
      if not project_ids or k in project_ids
    ],
  ))
