export interface Settings {
  cardStock: string;
  printType: string;
  finish: string;
  packaging: string;
}

export interface UploadedImage {
  count: number;
  front?: CompressedImageData;
  back?: CompressedImageData;
}

export interface CompressedImageData {
  ID: string;
  SourceID: string;
  Exp: string;
  Width: string;
  Height: string;
}

export const cardStockData = {
  '(S27) Smooth': 'PA_016',
  '(S30) Standard Smooth': 'PA_014',
  '(S33) Superior Smooth': 'PA_059',
  '(M31) Linen': 'PA_015',
  '(M30) Linen Air Light [min.1000]': 'PA_164',
  '(M32) Linen Air [min.1000]': 'PA_028',
  '(A35) Thick Standard': 'PA_203',
  '(P10) Plastic': 'PA_017',
}

export const printTypeData = {
  'Full color print': '',
  'Holographic (front)': 'EF_055',
  'Holographic (front & back)': 'EF_120',
  'High gloss + full color print': 'EF_020',
  'Gold gilt edge + full color print': 'EF_041',
  'Silver gilt edge + full color print': 'EF_042',
  'Holographic (front) + gold gilt edge': 'EF_095',
  'Holographic (front) + silver gilt edge': 'EF_105',
}

export const finishData = {
  'MPC game card finish': 'PPR_0009',
  'BETA playing card finish': 'PPR_0149',
  'Gloss finish': 'PPR_0056',
}

export const packagingData = {
  'Shrink-wrapped': 'PB_043',
  'Plain black velvet bag': 'PB_12387',
  'Plain double magnetic book box': 'PB_13100',
  'Plain double tin box': 'PB_12337',
  'Plain drawer box': 'PB_10490',
  'Plain easy-flip box': 'PB_10488',
  'Plain easy-flip side open box': 'PB_12345',
  'Plain hinged tin box': 'PB_8356',
  'Plain lux box': 'PB_12017',
  'Plain magnetic book box': 'PB_13090',
  'Plain white tuck box': 'PB_8166',
  'Plain window tuck box': 'PB_048',
  'Plain plastic box': 'PB_045',
  'Plain rigid box': 'PB_4292',
  'Plain plastic hinged case': 'PB_229',
  'Plain tin box': 'PB_050',
  'Custom black velvet bag': 'PB_12388',
  'Custom double magnetic book box': 'PB_13099',
  'Custom double sticker tin box': 'PB_12335',
  'Custom double tin box': 'PB_12336',
  'Custom drawer box': 'PB_9981',
  'Custom easy-flip box': 'PB_9983',
  'Custom easy-flip side open box': 'PB_12344',
  'Custom hinged tin box': 'PB_8366',
  'Custom labeled tin box': 'PB_8362',
  'Custom lux box': 'PB_12014',
  'Custom magnetic book box': 'PB_13091',
  'Custom rigid box': 'PB_4283',
  'Custom tuck box': 'PB_861',
  'Custom tuck box (sealed base)': 'PB_3281',
  'Custom plastic box': 'PB_234',
  'Custom plastic hinged case': 'PB_237',
  'Custom tin box': 'PB_231',
  'Uncut sheet': 'PB_049',
}

export const parseXml = (text: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/xml");
}

export const parseHtml = (text: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/html");
}

export const xpath = (root: Document, xpath: string) => {
  return document.evaluate(
    xpath,
    root,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue
}

export const initProject = async (settings: Settings, count: number) => {
  const r = await fetch('https://www.makeplayingcards.com/products/pro_item_process_flow.aspx?' + new URLSearchParams({
    // Card type
    itemid: 'C380050185D1C1AF',
    // Card Stock
    attachno: settings.cardStock,
    // number of cards
    pcs: `${count}`,
    // Print type
    producteffectno: settings.printType,
    // Finish
    processno: settings.finish,
    // Packaging
    packid: settings.packaging,
    qty: '1',
  }));

  const root = parseHtml(await r.text());
  return xpath(root, '/html/body/form[@id="form1"]/@action')!
    .textContent!
    .replace('./dn_playingcards_front_dynamic.aspx?ssid=', '');
}

export const saveFrontSettings = async (projectId: string, settings: Settings, count: number) => {
  const body = new FormData();
  // required to view Customize Front step
  body.append('__EVENTTARGET', 'btn_next_step');
  body.append('__EVENTARGUMENT', '');
  body.append('__VIEWSTATE', '/wEPDwUKLTU2NTk2MjE5Ng8WAh4TVmFsaWRhdGVSZXF1ZXN0TW9kZQIBFgICAw9kFgICFw9kFgICAQ8QZBAVEA5VcCB0byAxOCBjYXJkcw5VcCB0byAzNiBjYXJkcw5VcCB0byA1NSBjYXJkcw5VcCB0byA3MiBjYXJkcw5VcCB0byA5MCBjYXJkcw9VcCB0byAxMDggY2FyZHMPVXAgdG8gMTI2IGNhcmRzD1VwIHRvIDE0NCBjYXJkcw9VcCB0byAxNjIgY2FyZHMPVXAgdG8gMTgwIGNhcmRzD1VwIHRvIDE5OCBjYXJkcw9VcCB0byAyMTYgY2FyZHMPVXAgdG8gMjM0IGNhcmRzD1VwIHRvIDM5NiBjYXJkcw9VcCB0byA1MDQgY2FyZHMPVXAgdG8gNjEyIGNhcmRzFRACMTgCMzYCNTUCNzICOTADMTA4AzEyNgMxNDQDMTYyAzE4MAMxOTgDMjE2AzIzNAMzOTYDNTA0AzYxMhQrAxBnZ2dnZ2dnZ2dnZ2dnZ2dnZGRkloU9yHV5HiIPR1i4PDioIIuLNaM=');
  body.append('__VIEWSTATEGENERATOR', '602A9A3C');

  body.append('hidd_status', '');
  body.append('hidd_original_count', `${count}`);
  body.append('hidd_totalcount', `${count}`);
  body.append('hidd_design_count', `${count}`);
  body.append('hidd_mode', 'ImageText');

  body.append('hidd_display_material', 'false');
  body.append('hidd_material_no', settings.cardStock);
  body.append('hidd_packing_no', settings.packaging);
  body.append('txt_card_number', `${count}`);
  body.append('dro_total_count', `${count}`);

  // not sure if this is needed
  body.append('hidd_packing_condition_info', JSON.stringify({
    UnitNo: 'C380050185D1C1AF',
    PackingNo: settings.packaging,
    PackingGroup: 'SHRINKWRAP',
    AttachNo: settings.cardStock,
    ProductEffectNo: settings.printType,
    Pieces: count,
  }));

  return fetch('https://www.makeplayingcards.com/products/playingcard/design/dn_playingcards_mode_nf.aspx?' + new URLSearchParams({
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
  });
}

export const saveBackSettings = async (projectId: string, _settings: Settings, count: number) => {
  const body = new FormData();
  // required to view Customize Back step
  body.append('__EVENTTARGET', 'btn_next_step');
  body.append('__EVENTARGUMENT', '');
  body.append('__VIEWSTATE', '/wEPDwUKMTIzMDgxNjEwOA8WAh4TVmFsaWRhdGVSZXF1ZXN0TW9kZQIBFgICAw9kFgICDQ8WAh4FdmFsdWUFATZkZKIjwzXAMwyNuSHo5nMXtfW9CiZJ');
  body.append('__VIEWSTATEGENERATOR', 'F2B5E67A');

  body.append('hidd_status', '');
  body.append('hidd_original_count', `${count}`);
  body.append('hidd_totalcount', `${count}`);
  body.append('hidd_design_count', `${count}`);
  body.append('hidd_mode', 'ImageText');

  return fetch('https://www.makeplayingcards.com/products/playingcard/design/dn_playingcards_mode_nb.aspx?' + new URLSearchParams({
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
  });
}

export const uncompressImageData = (data: CompressedImageData) => {
  return {
    ID: data.SourceID,
    Exp: data.Exp,
    Owner: '',
    Path: 'https://www.makeplayingcards.com/PreviewFiles/Normal/temp',
    Width: data.Width,
    Height: data.Height,
    imageName: `${data.SourceID}.${data.Exp}`,
  }
}

export const uncompressCropData = (data: CompressedImageData) => {
  return [{
    ID: data.ID,
    SourceID: data.SourceID,
    Exp: data.Exp,
    X: 0,
    Y: 0,
    Width: 272,
    Height: 371,
    CropX: 0,
    CropY: 0,
    CropWidth: 272,
    CropHeight: 370,
    CropRotate: 0.0,
    Rotate: 0.0,
    Zoom: 1.0,
    Scale: 1.0,
    FlipHorizontal: 'N',
    FlipVertical: 'N',
    Sharpen: 'N',
    Filter: '',
    Brightness: 0,
    ThumbnailScale: 2.0221,
    AllowEdit: 'Y',
    AllowMove: 'Y',
    Alpha: 1.0,
    Resolution: 300,
    Index: 0,
    Quality: 'Y',
    AutoDirection: 'N',
    ApplyMask: 'N',
    IsEmpty: false,
  }]
}

export const saveSession = async (projectId: string, cards: UploadedImage[]) => {
  const expandedCards = cards.reduce<UploadedImage[]>((e, card) => {
    for (let i = 0; i < card.count; i++) {
      e.push(card);
    }
    return e;
  }, []);

  const body = new FormData();
  // list of front images for the project
  body.append('frontImageList', JSON.stringify(expandedCards.map((sides) => sides.front ? uncompressImageData(sides.front) : null)));
  // list of front images assigned to cards
  body.append('frontCropInfo', JSON.stringify(expandedCards.map((sides) => sides.front ? uncompressCropData(sides.front) : null)));
  // page designer for multiple front cards
  body.append('frontDesignModePage', 'dn_playingcards_mode_nf.aspx');
  // list of back images for the project
  body.append('backImageList', JSON.stringify(expandedCards.map((sides) => sides.back ? uncompressImageData(sides.back) : null)));
  // list of back images assigned to cards
  body.append('backCropInfo', JSON.stringify(expandedCards.map((sides) => sides.back ? uncompressCropData(sides.back) : null)));
  // page designer for multiple back cards
  body.append('backDesignModePage', 'dn_playingcards_mode_nb.aspx');
  // no idea
  body.append('expand', 'null');
  // no idea
  body.append('mapinfo', '[]');

  return fetch('https://www.makeplayingcards.com/design/dn_keep_session.aspx?' + new URLSearchParams({
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
  });
}

export const createProject = async (settings: Settings, cards: UploadedImage[]) => {
  const cardCount = cards.reduce<number>((e, v) => {
    return e + Math.max(v.count, 0);
  }, 0);
  const projectId = await initProject(settings, cardCount);

  await saveFrontSettings(projectId, settings, cardCount);
  await saveBackSettings(projectId, settings, cardCount);
  await saveSession(projectId, cards);

  return `https://www.makeplayingcards.com/design/dn_preview_layout.aspx?ssid=${projectId}`;
}

export const uploadImage = async (side: string, image: File) => {
  const body = new FormData();
  body.append('fileData', image);
  body.append('userName', '');
  body.append('layer', side);
  body.append('st', new Date().toISOString().replace('T', ' ').slice(0, 23));
  body.append('pt', '14167');
  body.append('ip', '');

  const r = await fetch('https://www.makeplayingcards.com/uploader/up_product.aspx', {
    method: 'POST',
    body: body,
  });
  const root = parseHtml(await r.text());
  return JSON.parse(xpath(root, '/html/body/form/input[@id="hidd_image_info"]/@value')!.textContent!);
}


export const analysisImage = async (side: string, index: number, value: any) => {
  const body = new FormData();
  body.append('photoindex', `${index}`);
  body.append('source', JSON.stringify(value));
  body.append('face', side);
  body.append('width', '272');
  body.append('height', '370');
  body.append('dpi', '300');
  body.append('auto', 'Y');
  body.append('scale', '1');
  body.append('filter', '');
  body.append('productCode', 'FI_7999');
  body.append('designCode', 'FP_031273');
  body.append('sortNo', '0');
  body.append('applyMask', 'N');

  const r = await fetch('https://www.makeplayingcards.com/design/dn_product_analysis_photo.aspx', {
    method: 'POST',
    body: body,
  });
  const root = parseXml(await r.text());
  return JSON.parse(xpath(root, '/Values/Value/text()')!.textContent!).CropInfo;
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