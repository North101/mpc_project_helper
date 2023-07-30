import fetchRetry from 'fetch-retry';

const fetch = fetchRetry(window.fetch);

const createUrl = (url: string, params: { [key: string]: string; }) => {
  if (!params) return url;
  return `${url}?${new URLSearchParams(params)}`;
}

interface UnpickInfo {
  SortNo: number,
  X: number,
  Y: number,
  Width: number,
  Height: number,
  Rotate: number,
  Alpha: number,
  TipX: number,
  TipY: number,
  TipWidth: number,
  Resolution: number,
  AllowEdit: string,
  AllowMove: string,
  AutoDirection: string,
  ApplyMask: string,
  RealX: number,
  RealY: number,
  RealWidth: number,
  RealHeight: number,
}

interface PixelInfo {
  ProductWidth: number,
  ProductHeight: number,
  ProductPadding: number,
  PaddingLeft: number,
  PaddingTop: number,
  PaddingRight: number,
  PaddingBottom: number,
  SafeLeft: number,
  SafeTop: number,
  SafeRight: number,
  SafeBottom: number,
  Radius: number,
  IsUnpick: string,
  IsLapped: string,
  IsPartImage: string,
  LappedType: string,
  LappedRow: number,
  LappedCol: number,
  Resolution: number,
  AllowDesign: string,
  PreviewWidth: number,
  PreviewHeight: number,
  Filter: string,
  AllowEditFilter: string,
  ImageMode: string,
  IsTextZoom: string,
}

export interface CardSettings {
  url: string;
  unit: string;
  product: string;
  frontDesign: string;
  backDesign: string;
  width: number;
  height: number;
  dpi: number;
  filter: string;
  auto: boolean;
  scale: number;
  sortNo: number;
  applyMask: boolean;
}

export interface Settings extends CardSettings {
  name?: string;
  cardStock: string;
  printType: string;
  finish: string;
  packaging: string;
  maxCards: number;
}

export interface UploadedImage {
  count: number;
  front?: CompressedImageData;
  back?: CompressedImageData;
}

export interface CompressedImageData {
  Name?: string;
  ID: string;
  SourceID: string;
  Exp: string;
  Width: number;
  Height: number;
}

const parseXml = (text: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(text, 'text/xml');
}

const parseHtml = (text: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(text, 'text/html');
}

const select1 = (root: Document, xpath: string) => {
  return document.evaluate(
    xpath,
    root,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue
}

function *select(root: Document, xpath: string) {
  const nodes = document.evaluate(
    xpath,
    root,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );
  for (var i = 0; i < nodes.snapshotLength; i++) {
    const node = nodes.snapshotItem(i);
    if (node) yield node;
  }
}

interface StepFormData {
  [key: string]: string;
}

const extractFormData = (html: Document) => {
  const formData: StepFormData = {};
  for (const field of select(html, '//form[@id="form1"]/div[@class="aspNetHidden"]/input[@type="hidden"]')) {
    const e = field as HTMLInputElement;
    formData[e.name] = e.value;
  }
  for (const field of select(html, '//form[@id="form1"]/input[@type="hidden"]')) {
    const e = field as HTMLInputElement;
    formData[e.name] = e.value;
  }
  return formData;
}

export const initProject = async (settings: Settings, cards: UploadedImage[]): Promise<string> => {
  const r = await fetch(createUrl(`${settings.url}/products/pro_item_process_flow.aspx`, {
    // Card type
    itemid: settings.unit,
    // Card Stock
    attachno: settings.cardStock,
    // number of cards
    pcs: `${cards.length}`,
    // Print type
    producteffectno: settings.printType,
    // Finish
    processno: settings.finish,
    // Packaging
    packid: settings.packaging,
    qty: '1',
  }), {
    retries: 5,
    retryDelay: 500,
  });
  const html = parseHtml(await r.text());
  const ssid = select1(html, '/html/body/form[@id="form1"]/@action')!
    .textContent!
    .replace('./dn_playingcards_front_dynamic.aspx?ssid=', '');
  return ssid;
}

export const saveFrontSettings = async (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const count = cards.length;

  const url = createUrl(`${settings.url}/products/playingcard/design/dn_playingcards_mode_nf.aspx`, {
    ssid: projectId,
  });

  const r = await fetch(url);
  const formData = {
    ...extractFormData(parseHtml(await r.text())),
    '__EVENTTARGET': 'btn_next_step',
    'hidd_mode': 'ImageText',
    'txt_card_number': `${count}`,
    'dro_total_count': `${count}`,
    'hidd_material_no': settings.cardStock,
    'hidd_packing_no': settings.packaging,
    'hidd_design_count': `${count}`,
  }

  const body = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    body.append(key, value);
  }

  return fetch(url, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveBackSettings = async (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const count = cards.length

  const url = createUrl(`${settings.url}/products/playingcard/design/dn_playingcards_mode_nb.aspx`, {
    ssid: projectId,
  });

  const r = await fetch(url);
  const formData = {
    ...extractFormData(parseHtml(await r.text())),
    '__EVENTTARGET': 'btn_next_step',
    'hidd_mode': 'ImageText',
    'hidd_design_count': `${count}`,
  };

  const body = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    body.append(key, value);
  }

  return fetch(url, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveFrontImageStep = async (projectId: string, settings: Settings) => {
  const url = createUrl(`${settings.url}/products/playingcard/design/dn_playingcards_front_dynamic.aspx`, {
    ssid: projectId,
  });

  const r = await fetch(url);
  const formData: StepFormData = {
    ...extractFormData(parseHtml(await r.text())),
    '__EVENTTARGET': 'btn_next_step',
  };

  const body = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    body.append(key, value);
  }

  await fetch(url, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });

  const hdParameter = JSON.parse(formData['hdParameter']);
  return {
    pixelInfo: JSON.parse(hdParameter.Base.PixelInfo) as PixelInfo,
    unpickInfo: JSON.parse(hdParameter.Base.UnpickInfo)[0] as UnpickInfo,
  };
}

export const saveFrontTextStep = async (projectId: string, settings: Settings) => {
  const url = createUrl(`${settings.url}/design/dn_texteditor_front.aspx`, {
    ssid: projectId,
  });

  const r = await fetch(url);
  const formData = {
    ...extractFormData(parseHtml(await r.text())),
    '__EVENTTARGET': 'btn_next_step',
  };

  const body = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    body.append(key, value);
  }

  await fetch(url, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveBackImageStep = async (projectId: string, settings: Settings) => {
  const url = createUrl(`${settings.url}/products/playingcard/design/dn_playingcards_back_dynamic.aspx`, {
    ssid: projectId,
  });

  const r = await fetch(url);
  const formData = {
    ...extractFormData(parseHtml(await r.text())),
    '__EVENTTARGET': 'btn_next_step',
  };

  const body = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    body.append(key, value);
  }

  await fetch(url, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveBackTextStep = async (projectId: string, settings: Settings) => {
  const url = createUrl(`${settings.url}/design/dn_texteditor_back.aspx`, {
    ssid: projectId,
  });

  const r = await fetch(url);
  const formData = {
    ...extractFormData(parseHtml(await r.text())),
    '__EVENTTARGET': 'btn_next_step',
  };

  const body = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    body.append(key, value);
  }

  await fetch(url, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const uncompressImageData = (settings: Settings, data: CompressedImageData) => {
  return {
    ID: data.SourceID,
    Exp: data.Exp,
    Owner: '',
    Path: `${settings.url}/PreviewFiles/Normal/temp`,
    Width: data.Width,
    Height: data.Height,
    imageName: `${data.SourceID}.${data.Exp}`,
  }
}

export const uncompressCropData = (data: CompressedImageData, pixelInfo: PixelInfo, unpickInfo: UnpickInfo) => {
  return [{
    ID: data.ID,
    SourceID: data.SourceID,
    Exp: data.Exp,
    X: unpickInfo.X,
    Y: unpickInfo.Y,
    Width: unpickInfo.Width,
    Height: unpickInfo.Height,
    CropX: 0,
    CropY: 0,
    CropWidth: unpickInfo.Width,
    CropHeight: unpickInfo.Height,
    CropRotate: 0.0,
    Rotate: unpickInfo.Rotate,
    Zoom: 0,
    Scale: 1.0,
    FlipHorizontal: 'N',
    FlipVertical: 'N',
    Sharpen: 'N',
    Filter: pixelInfo.Filter,
    Brightness: 0,
    ThumbnailScale: 1.0,
    AllowEdit: unpickInfo.AllowEdit,
    AllowMove: unpickInfo.AllowMove,
    Alpha: unpickInfo.Alpha,
    Resolution: unpickInfo.Resolution,
    Index: 0,
    Quality: (data.Height / unpickInfo.Height * 100) >= unpickInfo.Resolution ? 'Y' : 'N', // A guess
    AutoDirection: unpickInfo.AutoDirection,
    ApplyMask: unpickInfo.ApplyMask,
    IsEmpty: false,
  }]
}

export const saveSession = async (projectId: string, settings: Settings, cards: UploadedImage[], pixelInfo: PixelInfo, unpickInfo: UnpickInfo) => {
  const body = new FormData();
  // list of front images for the project
  body.append('frontImageList', JSON.stringify(cards.map(sides => sides.front ? uncompressImageData(settings, sides.front) : null)));
  // list of front images assigned to cards
  body.append('frontCropInfo', JSON.stringify(cards.map(sides => sides.front ? uncompressCropData(sides.front, pixelInfo, unpickInfo) : null)));
  // page designer for multiple front cards
  body.append('frontDesignModePage', 'dn_playingcards_mode_nf.aspx');
  body.append('frontTextInfo', [...new Array(cards.length)].map(() => '').join('%u25C7'));
  // list of back images for the project
  body.append('backImageList', JSON.stringify(cards.map(sides => sides.back ? uncompressImageData(settings, sides.back) : null)));
  // list of back images assigned to cards
  body.append('backCropInfo', JSON.stringify(cards.map(sides => sides.back ? uncompressCropData(sides.back, pixelInfo, unpickInfo) : null)));
  body.append('backTextInfo', [...new Array(cards.length)].map(() => '').join('%u25C7'));
  // page designer for multiple back cards
  body.append('backDesignModePage', 'dn_playingcards_mode_nb.aspx');
  // no idea
  body.append('expand', 'null');
  // no idea
  body.append('mapinfo', '[]');

  return fetch(createUrl(`${settings.url}/design/dn_keep_session.aspx`, {
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveProject = async (projectId: string, settings: Settings) => {
  if (!settings.name) return;

  const body = new FormData();
  body.append('name', settings.name)

  return fetch(createUrl(`${settings.url}/design/dn_project_save.aspx`, {
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const createProject = async (settings: Settings, cards: UploadedImage[]) => {
  const expandedCards = cards.reduce<UploadedImage[]>((e, card) => {
    for (let i = 0; i < card.count; i++) {
      e.push(card);
    }
    return e;
  }, []);

  const projectId = await initProject(settings, expandedCards);

  await saveFrontSettings(projectId, settings, expandedCards);
  await saveBackSettings(projectId, settings, expandedCards);
  const { pixelInfo, unpickInfo } = await saveFrontImageStep(projectId, settings);
  await saveFrontTextStep(projectId, settings);
  await saveBackImageStep(projectId, settings);
  await saveBackTextStep(projectId, settings);
  await saveSession(projectId, settings, expandedCards, pixelInfo, unpickInfo);
  await saveProject(projectId, settings);

  return `${settings.url}/design/dn_preview_layout.aspx?ssid=${projectId}`;
}

export const createAutoSplitProject = async (settings: Settings, cards: UploadedImage[]) => {
  const projects: string[] = []
  const maxCardCount = settings.maxCards
  const projectCount = Math.ceil(cards.reduce((value, card) => value + card.count, 0) / maxCardCount)

  let cardIndex = 0
  let cardCountOffset = 0
  while (cardIndex < cards.length) {
    const projectCards: UploadedImage[] = []
    let projectCardCount = 0
    while (projectCardCount < maxCardCount && cardIndex < cards.length) {
      const card = cards[cardIndex]
      const count = Math.min(card.count - cardCountOffset, maxCardCount - projectCardCount)
      projectCards.push(count == card.count ? card : {
        ...card,
        count: count,
      })
      cardCountOffset += count
      if (cardCountOffset >= card.count) {
        cardIndex += 1
        cardCountOffset = 0
      }
      projectCardCount += count
    }
    const name: string|undefined = projectCount > 1
      ? `${settings.name} (${projects.length + 1}/${projectCount})`
      : settings.name
    projects.push(await createProject({
      ...settings,
      name: name,
    }, projectCards))
  }
  return projects
}

const getDateTime = async (url: string) => {
  const r = await fetch(`${url}/api/common/getdatetime.ashx`);
  return await r.text().then(e => e.replace(/\-/g, '/'));
}

export const uploadImage = async (settings: CardSettings, side: string, image: File) => {
  const st = await getDateTime(settings.url);

  const body = new FormData();
  body.append('fileData', image);
  body.append('userName', '');
  body.append('layer', side);
  body.append('st', st);
  body.append('pt', '0');
  body.append('ip', '');

  const r = await fetch(`${settings.url}/uploader/up_product.aspx`, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
  const root = parseHtml(await r.text());
  return JSON.parse(select1(root, '/html/body/form/input[@id="hidd_image_info"]/@value')!.textContent!);
}

export const analysisImage = async (settings: CardSettings, side: string, index: number, value: any) => {
  const body = new FormData();
  body.append('photoindex', `${index}`);
  body.append('source', JSON.stringify(value));
  body.append('face', side);
  body.append('width', `${settings.width}`);
  body.append('height', `${settings.height}`);
  body.append('dpi', `${settings.dpi}`);
  body.append('auto', settings.auto ? 'Y' : 'N');
  body.append('scale', `${settings.scale}`);
  body.append('filter', '');
  body.append('productCode', settings.product);
  body.append('designCode', side === 'front' ? settings.frontDesign : settings.backDesign);
  body.append('sortNo', `${settings.sortNo}`);
  body.append('applyMask', settings.applyMask ? 'Y' : 'N');

  const r = await fetch(`${settings.url}/design/dn_product_analysis_photo.aspx`, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
  const root = parseXml(await r.text());
  return JSON.parse(select1(root, '/Values/Value/text()')!.textContent!).CropInfo;
}

export const compressImageData = (analysedImage: any, uploadedImage: any): CompressedImageData => {
  return {
    ID: analysedImage.ID,
    SourceID: analysedImage.SourceID,
    Exp: uploadedImage.Exp,
    Width: uploadedImage.Width,
    Height: uploadedImage.Height,
  }
}
