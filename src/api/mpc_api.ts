import fetchRetry from 'fetch-retry';

import mpcColors from './data/colors.json';
import mpcFonts from './data/fonts.json';

const fetch = fetchRetry(window.fetch);

const url = (url: string, params: { [key: string]: string; }) => {
  if (!params) return url;
  return `${url}?${new URLSearchParams(params)}`;
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
  Width: number;
  Height: number;
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

export const initProject = async (settings: Settings, cards: UploadedImage[]) => {
  const r = await fetch(url(`${settings.url}/products/pro_item_process_flow.aspx`, {
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

  const root = parseHtml(await r.text());
  return xpath(root, '/html/body/form[@id="form1"]/@action')!
    .textContent!
    .replace('./dn_playingcards_front_dynamic.aspx?ssid=', '');
}

export const saveFrontSettings = (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const count = cards.length;

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
    UnitNo: settings.unit,
    PackingNo: settings.packaging,
    PackingGroup: 'SHRINKWRAP',
    AttachNo: settings.cardStock,
    ProductEffectNo: settings.printType,
    Pieces: count,
  }));

  return fetch(url(`${settings.url}/products/playingcard/design/dn_playingcards_mode_nf.aspx`, {
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveBackSettings = (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const count = cards.length

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

  return fetch(url(`${settings.url}/products/playingcard/design/dn_playingcards_mode_nb.aspx`, {
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveFrontImageStep = (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const body = new FormData();
  // required to view Customize Front step
  body.append('__EVENTTARGET', 'btn_next_step');
  body.append('__EVENTARGUMENT', '');
  body.append('__VIEWSTATE', '/wEPDwUJLTIwNTgyNjY3DxYCHhNWYWxpZGF0ZVJlcXVlc3RNb2RlAgEWAgIDD2QWAgItD2QWAgIDD2QWBgIBDxYCHglpbm5lcmh0bWwF8AU8ZGl2IGNsYXNzPSJkZXNpZ25UcmFja2VyQmFyIj48dWw+PGxpIGNsYXNzPSJjdXJyZW50YmFyIHN0ZXBpY29sZWZ0Ij48ZGl2IGNsYXNzPSJjdXJydG9wIj48c3Bhbj4xPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImN1cnJib3R0b20iID48c3Bhbj5DdXN0b21pemUgRnJvbnQ8L3NwYW4+PC9kaXY+PC9saT48bGkgY2xhc3M9InJlYWR5YmFyX2NlbnRlciI+PGRpdiBjbGFzcz0icmVhZHl0b3AiPjxzcGFuPjI8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0icmVhZHlib3R0b20iID48c3Bhbj5BZGQgVGV4dCBUbyBGcm9udDwvc3Bhbj48L2Rpdj48L2xpPjxsaSBjbGFzcz0icmVhZHliYXJfY2VudGVyIj48ZGl2IGNsYXNzPSJyZWFkeXRvcCI+PHNwYW4+Mzwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSJyZWFkeWJvdHRvbSIgPjxzcGFuPkN1c3RvbWl6ZSBCYWNrPC9zcGFuPjwvZGl2PjwvbGk+PGxpIGNsYXNzPSJyZWFkeWJhcl9jZW50ZXIiPjxkaXYgY2xhc3M9InJlYWR5dG9wIj48c3Bhbj40PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9InJlYWR5Ym90dG9tIiA+PHNwYW4+QWRkIFRleHQgVG8gQmFjazwvc3Bhbj48L2Rpdj48L2xpPjxsaSBjbGFzcz0icmVhZHliYXJfcmlnaHQiPjxkaXYgY2xhc3M9InJlYWR5dG9wIj48c3Bhbj41PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9InJlYWR5Ym90dG9tIiBzdHlsZT0id2lkdGg6IDEzMHB4Ij48c3Bhbj5QcmV2aWV3ICYgQWRkIHRvIENhcnQ8L3NwYW4+PC9kaXY+PC9saT48L3VsPjwvZGl2PmQCAw8WAh8BBboGPGRpdiBjbGFzcz0ibnNib3giPjxkaXYgY2xhc3M9InRlbXBvcmFyeXNhdmVmcmFtZSI+PGRpdiBpZD0iZGl2X3RlbXBvcmFyeXNhdmVib3giIGNsYXNzPSJ0ZW1wb3JhcnlzYXZlYm94Ij48ZGl2IGNsYXNzPSJ0c25hbWVib3giPjxpbnB1dCBpZD0idHh0X3RlbXBvcmFyeW5hbWUiIHR5cGU9InRleHQiIHZhbHVlPSJQcm9qZWN0LW5TUzFYQWtaT2IiIG1heExlbmd0aD0iMzIiPjwvZGl2PjxkaXYgaWQ9ImRpdl90ZW1wb3JhcnlyZW1hcmsiIGNsYXNzPSJ0c3JlbWFyayI+KE5vdCB5ZXQgc2F2ZWQpPC9kaXY+PGRpdiBjbGFzcz0iYm5fdGVtcG9yYXJ5c2F2ZWJveCI+PGRpdiBjbGFzcz0iYm5fdGVtcG9yYXJ5c2F2ZSI+PGEgb25jbGljaz0ib0Rlc2lnbi5zZXRUZW1wb3JhcnlTYXZlKCk7Ij48L2E+PC9kaXY+PC9kaXY+PGRpdiBpZD0iZGl2X3RlbXBvcmFyeXNhdmVzdGF0dXMiIGNsYXNzPSJ0c3N0YXR1c2JveCIgc3R5bGU9ImRpc3BsYXk6IG5vbmU7Ij48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGlkPSJkaXZOZXh0QnV0dG9uQm94IiBjbGFzcz0iYm5uZXh0c3RlcGJveCI+PGRpdiBjbGFzcz0iYm5fbmV4dHN0ZXAiPjxhIG9uY2xpY2s9Im9EZXNpZ24uc2V0TmV4dFN0ZXAoKTsiPjwvYT48L2Rpdj48L2Rpdj48ZGl2IGlkPSJkaXZQcmV2aW91c0J1dHRvbkJveCIgaXNUb3BNb3N0PSJZIiBjbGFzcz0iYm5wcmV2aW91c2JveCI+PGRpdiBjbGFzcz0iYm5fcHJldmlvdXNfZG4iPjxhIG9uY2xpY2s9Im9UcmFja2VyQmFyLnNldEZsb3coJy4uLy4uLy4uL2Rlc2lnbi9jdXN0b20tYmxhbmstY2FyZC5odG1sJywnWScpOyI+PC9hPjwvZGl2PjwvZGl2PjwvZGl2PmQCBQ8WAh8BBdEBPGRpdiBjbGFzcz0icnRib3giPjxhIGhlcmY9IiMiIG9uY2xpY2s9IndpbmRvdy5zY3JvbGxUbygwLCAwKTsiPkJBQ0sgVE8gVE9QPC9hPjwvZGl2PjxkaXYgY2xhc3M9InJ0Ym94Ij48YSBoZXJmPSIjIiBvbmNsaWNrPSJvVHJhY2tlckJhci5zZXRGbG93KCcuLi8uLi8uLi9kZXNpZ24vY3VzdG9tLWJsYW5rLWNhcmQuaHRtbCcsJ1knKTsiPkNBTkNFTDwvYT48L2Rpdj5kZMSQWZLt3/Ey8CGUEZFMIYBdD05X');
  body.append('__VIEWSTATEGENERATOR', '2B4DAC5B');

  body.append('hidd_itemId', settings.product);
  body.append('hidd_designMode', 'ImageText');
  body.append('hidd_coverCode', settings.frontDesign);
  body.append('hidd_categoryPath', `../../../AttachFiles/ImagesLibrary/PlayingCard/front/${settings.frontDesign}/Category`);
  body.append('hidd_uploadPath', '../../..//PreviewFiles/Normal/temp/thumb');
  body.append('hidd_totalcount', `${cards.length}`);
  body.append('hidd_designcount', `${cards.length}`);
  body.append('hidd_productgroup', '');
  body.append('hidd_unpick_info', '[{"SortNo":1,"X":0,"Y":0,"Width":272,"Height":370,"Rotate":0.0,"Alpha":1.0,"TipX":0,"TipY":0,"TipWidth":0,"Resolution":300,"AllowEdit":"Y","AllowMove":"Y","AutoDirection":"Y","ApplyMask":"N","RealX":0,"RealY":0,"RealWidth":816,"RealHeight":1110}]');
  body.append('hidd_images_info', JSON.stringify(cards.map((sides) => sides.front ? uncompressImageData(settings, sides.front) : null)));
  body.append('hidd_pixel_info', '{"ProductWidth":272,"ProductHeight":370,"ProductPadding":12,"PaddingLeft":0,"PaddingTop":0,"PaddingRight":0,"PaddingBottom":0,"SafeLeft":12,"SafeTop":12,"SafeRight":12,"SafeBottom":12,"Radius":0,"IsUnpick":"N","IsLapped":"N","IsPartImage":"N","LappedType":"A","LappedRow":0,"LappedCol":0,"Resolution":300,"AllowDesign":"Y","PreviewWidth":272,"PreviewHeight":370,"Filter":"","AllowEditFilter":"Y","ImageMode":"B","IsTextZoom":"Y"}');
  body.append('hidd_direction', 'V');
  body.append('hidd_backgroundColor', '');
  body.append('hidd_image_format', 'png');
  body.append('hidd_crop_info', JSON.stringify(cards.map((sides) => sides.front ? uncompressCropData(settings, sides.front) : null)));
  body.append('hidd_photo_cookie', 'Y');
  body.append('hidd_userName', '');
  body.append('hidd_imageWidth', '272');
  body.append('hidd_authorize_modify', 'Y');
  body.append('hidd_webSiteCode', 'PC');
  body.append('hidd_safe_area_link_url', `${settings.url}/pops/faq-photo.html`);

  return fetch(url(`${settings.url}/products/playingcard/design/dn_playingcards_front_dynamic.aspx`, {
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveFrontTextStep = (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const count = cards.length;

  const body = new FormData();
  body.append('__EVENTTARGET', 'btn_next_step');
  body.append('__EVENTARGUMENT', '');
  body.append('__VIEWSTATE', '/wEPDwUKLTE3NzAzMzE5OA8WAh4TVmFsaWRhdGVSZXF1ZXN0TW9kZQIBFgICAw9kFgICOw9kFgICAw9kFgYCAQ8WAh4JaW5uZXJodG1sBbUJPGRpdiBjbGFzcz0iZGVzaWduVHJhY2tlckJhciI+PHVsPjxsaSBjbGFzcz0iY29tcGxldGViYXJfbGVmdCI+PGRpdiBjbGFzcz0iY29tcHRvcCI+PGltZyBzcmM9Imh0dHBzOi8vd3d3Lm1ha2VwbGF5aW5nY2FyZHMuY29tL2ltYWdlcy9zeXN0ZW0vcHJvY2Vzc2Jhcl90aWNrLmdpZiI+PC9kaXY+PGRpdiBjbGFzcz0iY29tcGJvdHRvbSIgPjxhIG9uY2xpY2s9Im9UcmFja2VyQmFyLnNldEZsb3coJ2h0dHBzOi8vd3d3Lm1ha2VwbGF5aW5nY2FyZHMuY29tL3Byb2R1Y3RzL3BsYXlpbmdjYXJkL2Rlc2lnbi9kbl9wbGF5aW5nY2FyZHNfZnJvbnRfZHluYW1pYy5hc3B4P3NzaWQ9RTE3MUMzMTdCMjk1NENGOTk0QjQ1RTIxRTcxOEQ1NzInKTsiPkN1c3RvbWl6ZSBGcm9udDwvYT48L2Rpdj48L2xpPjxsaSBjbGFzcz0iY3VycmVudGJhciBzdGVwaWNvY2VudGVyIj48ZGl2IGNsYXNzPSJjdXJydG9wIj48c3Bhbj4yPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImN1cnJib3R0b20iID48c3Bhbj5BZGQgVGV4dCBUbyBGcm9udDwvc3Bhbj48L2Rpdj48L2xpPjxsaSBjbGFzcz0iY29tcGxldGViYXJfY2VudGVyIj48ZGl2IGNsYXNzPSJjb21wdG9wIj48aW1nIHNyYz0iaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vaW1hZ2VzL3N5c3RlbS9wcm9jZXNzYmFyX3RpY2suZ2lmIj48L2Rpdj48ZGl2IGNsYXNzPSJjb21wYm90dG9tIiA+PGEgb25jbGljaz0ib1RyYWNrZXJCYXIuc2V0RmxvdygnaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vcHJvZHVjdHMvcGxheWluZ2NhcmQvZGVzaWduL2RuX3BsYXlpbmdjYXJkc19iYWNrX2R5bmFtaWMuYXNweD9zc2lkPUUxNzFDMzE3QjI5NTRDRjk5NEI0NUUyMUU3MThENTcyJyk7Ij5DdXN0b21pemUgQmFjazwvYT48L2Rpdj48L2xpPjxsaSBjbGFzcz0icmVhZHliYXJfY2VudGVyIj48ZGl2IGNsYXNzPSJyZWFkeXRvcCI+PHNwYW4+NDwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSJyZWFkeWJvdHRvbSIgPjxzcGFuPkFkZCBUZXh0IFRvIEJhY2s8L3NwYW4+PC9kaXY+PC9saT48bGkgY2xhc3M9InJlYWR5YmFyX3JpZ2h0Ij48ZGl2IGNsYXNzPSJyZWFkeXRvcCI+PHNwYW4+NTwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSJyZWFkeWJvdHRvbSIgc3R5bGU9IndpZHRoOiAxMzBweCI+PHNwYW4+UHJldmlldyAmIEFkZCB0byBDYXJ0PC9zcGFuPjwvZGl2PjwvbGk+PC91bD48L2Rpdj5kAgMPFgIfAQWZBzxkaXYgY2xhc3M9Im5zYm94Ij48ZGl2IGNsYXNzPSJ0ZW1wb3JhcnlzYXZlZnJhbWUiPjxkaXYgaWQ9ImRpdl90ZW1wb3JhcnlzYXZlYm94IiBjbGFzcz0idGVtcG9yYXJ5c2F2ZWJveCI+PGRpdiBjbGFzcz0idHNuYW1lYm94Ij48aW5wdXQgaWQ9InR4dF90ZW1wb3JhcnluYW1lIiB0eXBlPSJ0ZXh0IiB2YWx1ZT0iUHJvamVjdC1BWFI1UE9GYXh3IiBtYXhMZW5ndGg9IjMyIj48L2Rpdj48ZGl2IGlkPSJkaXZfdGVtcG9yYXJ5cmVtYXJrIiBjbGFzcz0idHNyZW1hcmsiPihOb3QgeWV0IHNhdmVkKTwvZGl2PjxkaXYgY2xhc3M9ImJuX3RlbXBvcmFyeXNhdmVib3giPjxkaXYgY2xhc3M9ImJuX3RlbXBvcmFyeXNhdmUiPjxhIG9uY2xpY2s9Im9EZXNpZ24uc2V0VGVtcG9yYXJ5U2F2ZSgpOyI+PC9hPjwvZGl2PjwvZGl2PjxkaXYgaWQ9ImRpdl90ZW1wb3JhcnlzYXZlc3RhdHVzIiBjbGFzcz0idHNzdGF0dXNib3giIHN0eWxlPSJkaXNwbGF5OiBub25lOyI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBpZD0iZGl2TmV4dEJ1dHRvbkJveCIgY2xhc3M9ImJubmV4dHN0ZXBib3giPjxkaXYgY2xhc3M9ImJuX25leHRzdGVwIj48YSBvbmNsaWNrPSJvRGVzaWduLnNldE5leHRTdGVwKCk7Ij48L2E+PC9kaXY+PC9kaXY+PGRpdiBpZD0iZGl2UHJldmlvdXNCdXR0b25Cb3giIGlzVG9wTW9zdD0iTiIgY2xhc3M9ImJucHJldmlvdXNib3giPjxkaXYgY2xhc3M9ImJuX3ByZXZpb3VzX2RuIj48YSBvbmNsaWNrPSJvVHJhY2tlckJhci5zZXRGbG93KCdodHRwczovL3d3dy5tYWtlcGxheWluZ2NhcmRzLmNvbS9wcm9kdWN0cy9wbGF5aW5nY2FyZC9kZXNpZ24vZG5fcGxheWluZ2NhcmRzX2Zyb250X2R5bmFtaWMuYXNweD9zc2lkPUUxNzFDMzE3QjI5NTRDRjk5NEI0NUUyMUU3MThENTcyJywnTicpOyI+PC9hPjwvZGl2PjwvZGl2PjwvZGl2PmQCBw8WAh8BBcsBPGRpdiBjbGFzcz0icnRib3giPjxhIGhlcmY9IiMiIG9uY2xpY2s9IndpbmRvdy5zY3JvbGxUbygwLCAwKTsiPkJBQ0sgVE8gVE9QPC9hPjwvZGl2PjxkaXYgY2xhc3M9InJ0Ym94Ij48YSBoZXJmPSIjIiBvbmNsaWNrPSJvVHJhY2tlckJhci5zZXRGbG93KCcuLi9kZXNpZ24vY3VzdG9tLWJsYW5rLWNhcmQuaHRtbCcsJ1knKTsiPkNBTkNFTDwvYT48L2Rpdj5kZJN66tOO44C1ea1NMzpga2DNoMrN');
  body.append('__VIEWSTATEGENERATOR', '38544382');

  body.append('hidd_pixel_info', '[{"FixedWidth":272,"FixedHeight":370,"Width":272,"Height":370,"Radius":0,"IsPartImage":"N","IsTextZoom":"Y","PreviewWidth":272,"PreviewHeight":370,"Zoom":1.0}]');
  body.append('hidd_pixel_info_part', '');
  body.append('hidd_designinfo', [...new Array(count)].map(() => '').join('◇'));
  body.append('hidd_unpickinfo', [...new Array(count)].map((_, index) => `C55A5CD20E238A35B0075E7D808CF18E_TVF${index + 1}`).join(';'));
  body.append('hidd_unpickinfo_suit', '');
  body.append('hidd_tips', 'tp_text');
  body.append('hidd_messages', '');
  body.append('hidd_image_path', '..//PreviewFiles/Normal/temp/thumb');
  body.append('hidd_unpickinfo_boundary', '');
  body.append('hidd_single_color_text', 'N');
  body.append('hidd_isSuitCountMode', 'N');
  body.append('hidd_fonts', JSON.stringify(mpcFonts));
  body.append('hidd_color_info', JSON.stringify(mpcColors));
  body.append('hidd_side_info', '');
  body.append('hidd_allow_addtext', 'Y');
  body.append('hidd_designMode', '');
  body.append('hidd_upload', '');
  body.append('hidd_expand_info', '');
  body.append('hidd_expand_apply', '');
  body.append('hidd_productgroup', '');
  body.append('hidd_background_caption_bg', '');
  body.append('hidd_background_message_bg', '');
  body.append('hidd_expand_applyBgColor', '');
  body.append('hidd_text_effect_color_info', '');
  body.append('hidd_preview_imge_exp', 'jpg');
  body.append('hidd_min_fontsize', '0');
  body.append('hidd_using_new_version', 'Y');
  body.append('hidd_card_number_title', 'Card');

  return fetch(url(`${settings.url}/design/dn_texteditor_front.aspx`, {
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveBackImageStep = (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const count = cards.length;

  const body = new FormData();
  body.append('__EVENTTARGET', 'btn_next_step');
  body.append('__EVENTARGUMENT', '');
  body.append('__VIEWSTATE', '/wEPDwUKMTAwNjY5ODE3Mw8WAh4TVmFsaWRhdGVSZXF1ZXN0TW9kZQIBFgICAw9kFgICKQ9kFgICAw9kFgYCAQ8WAh4JaW5uZXJodG1sBZcJPGRpdiBjbGFzcz0iZGVzaWduVHJhY2tlckJhciI+PHVsPjxsaSBjbGFzcz0iY29tcGxldGViYXJfbGVmdCI+PGRpdiBjbGFzcz0iY29tcHRvcCI+PGltZyBzcmM9Imh0dHBzOi8vd3d3Lm1ha2VwbGF5aW5nY2FyZHMuY29tL2ltYWdlcy9zeXN0ZW0vcHJvY2Vzc2Jhcl90aWNrLmdpZiI+PC9kaXY+PGRpdiBjbGFzcz0iY29tcGJvdHRvbSIgPjxhIG9uY2xpY2s9Im9UcmFja2VyQmFyLnNldEZsb3coJ2h0dHBzOi8vd3d3Lm1ha2VwbGF5aW5nY2FyZHMuY29tL3Byb2R1Y3RzL3BsYXlpbmdjYXJkL2Rlc2lnbi9kbl9wbGF5aW5nY2FyZHNfZnJvbnRfZHluYW1pYy5hc3B4P3NzaWQ9RjQ0NDhCQTBDNzk5NDM4QzhBNTcwMTdFQ0RCMDNGNzcnKTsiPkN1c3RvbWl6ZSBGcm9udDwvYT48L2Rpdj48L2xpPjxsaSBjbGFzcz0iY29tcGxldGViYXJfY2VudGVyIj48ZGl2IGNsYXNzPSJjb21wdG9wIj48aW1nIHNyYz0iaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vaW1hZ2VzL3N5c3RlbS9wcm9jZXNzYmFyX3RpY2suZ2lmIj48L2Rpdj48ZGl2IGNsYXNzPSJjb21wYm90dG9tIiA+PGEgb25jbGljaz0ib1RyYWNrZXJCYXIuc2V0RmxvdygnaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vZGVzaWduL2RuX3RleHRlZGl0b3JfZnJvbnQuYXNweD9zc2lkPUY0NDQ4QkEwQzc5OTQzOEM4QTU3MDE3RUNEQjAzRjc3Jyk7Ij5BZGQgVGV4dCBUbyBGcm9udDwvYT48L2Rpdj48L2xpPjxsaSBjbGFzcz0iY3VycmVudGJhciBzdGVwaWNvY2VudGVyIj48ZGl2IGNsYXNzPSJjdXJydG9wIj48c3Bhbj4zPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImN1cnJib3R0b20iID48c3Bhbj5DdXN0b21pemUgQmFjazwvc3Bhbj48L2Rpdj48L2xpPjxsaSBjbGFzcz0icmVhZHliYXJfY2VudGVyIj48ZGl2IGNsYXNzPSJyZWFkeXRvcCI+PHNwYW4+NDwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSJyZWFkeWJvdHRvbSIgPjxzcGFuPkFkZCBUZXh0IFRvIEJhY2s8L3NwYW4+PC9kaXY+PC9saT48bGkgY2xhc3M9InJlYWR5YmFyX3JpZ2h0Ij48ZGl2IGNsYXNzPSJyZWFkeXRvcCI+PHNwYW4+NTwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSJyZWFkeWJvdHRvbSIgc3R5bGU9IndpZHRoOiAxMzBweCI+PHNwYW4+UHJldmlldyAmIEFkZCB0byBDYXJ0PC9zcGFuPjwvZGl2PjwvbGk+PC91bD48L2Rpdj5kAgMPFgIfAQX6BjxkaXYgY2xhc3M9Im5zYm94Ij48ZGl2IGNsYXNzPSJ0ZW1wb3JhcnlzYXZlZnJhbWUiPjxkaXYgaWQ9ImRpdl90ZW1wb3JhcnlzYXZlYm94IiBjbGFzcz0idGVtcG9yYXJ5c2F2ZWJveCI+PGRpdiBjbGFzcz0idHNuYW1lYm94Ij48aW5wdXQgaWQ9InR4dF90ZW1wb3JhcnluYW1lIiB0eXBlPSJ0ZXh0IiB2YWx1ZT0iUHJvamVjdC1IRFVYTGgwSXNvIiBtYXhMZW5ndGg9IjMyIj48L2Rpdj48ZGl2IGlkPSJkaXZfdGVtcG9yYXJ5cmVtYXJrIiBjbGFzcz0idHNyZW1hcmsiPihOb3QgeWV0IHNhdmVkKTwvZGl2PjxkaXYgY2xhc3M9ImJuX3RlbXBvcmFyeXNhdmVib3giPjxkaXYgY2xhc3M9ImJuX3RlbXBvcmFyeXNhdmUiPjxhIG9uY2xpY2s9Im9EZXNpZ24uc2V0VGVtcG9yYXJ5U2F2ZSgpOyI+PC9hPjwvZGl2PjwvZGl2PjxkaXYgaWQ9ImRpdl90ZW1wb3JhcnlzYXZlc3RhdHVzIiBjbGFzcz0idHNzdGF0dXNib3giIHN0eWxlPSJkaXNwbGF5OiBub25lOyI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBpZD0iZGl2TmV4dEJ1dHRvbkJveCIgY2xhc3M9ImJubmV4dHN0ZXBib3giPjxkaXYgY2xhc3M9ImJuX25leHRzdGVwIj48YSBvbmNsaWNrPSJvRGVzaWduLnNldE5leHRTdGVwKCk7Ij48L2E+PC9kaXY+PC9kaXY+PGRpdiBpZD0iZGl2UHJldmlvdXNCdXR0b25Cb3giIGlzVG9wTW9zdD0iTiIgY2xhc3M9ImJucHJldmlvdXNib3giPjxkaXYgY2xhc3M9ImJuX3ByZXZpb3VzX2RuIj48YSBvbmNsaWNrPSJvVHJhY2tlckJhci5zZXRGbG93KCdodHRwczovL3d3dy5tYWtlcGxheWluZ2NhcmRzLmNvbS9kZXNpZ24vZG5fdGV4dGVkaXRvcl9mcm9udC5hc3B4P3NzaWQ9RjQ0NDhCQTBDNzk5NDM4QzhBNTcwMTdFQ0RCMDNGNzcnLCdOJyk7Ij48L2E+PC9kaXY+PC9kaXY+PC9kaXY+ZAIFDxYCHwEF0QE8ZGl2IGNsYXNzPSJydGJveCI+PGEgaGVyZj0iIyIgb25jbGljaz0id2luZG93LnNjcm9sbFRvKDAsIDApOyI+QkFDSyBUTyBUT1A8L2E+PC9kaXY+PGRpdiBjbGFzcz0icnRib3giPjxhIGhlcmY9IiMiIG9uY2xpY2s9Im9UcmFja2VyQmFyLnNldEZsb3coJy4uLy4uLy4uL2Rlc2lnbi9jdXN0b20tYmxhbmstY2FyZC5odG1sJywnWScpOyI+Q0FOQ0VMPC9hPjwvZGl2PmRkRmGg1WK++kk1I5xWo6/Vb5DLMy8=');
  body.append('__VIEWSTATEGENERATOR', '60411B4E');

  body.append('hidd_itemId', settings.product);
  body.append('hidd_designMode', 'ImageText');
  body.append('hidd_bottomCode', settings.backDesign);
  body.append('hidd_categoryPath', `../../../AttachFiles/ImagesLibrary/PlayingCard/back/${settings.backDesign}/Category`);
  body.append('hidd_uploadPath', '../../..//PreviewFiles/Normal/temp/thumb');
  body.append('hidd_totalcount', `${count}`);
  body.append('hidd_designcount', `${count}`);
  body.append('hidd_unpick_info', '[{"SortNo":1,"X":0,"Y":0,"Width":272,"Height":370,"Rotate":0.0,"Alpha":1.0,"TipX":0,"TipY":0,"TipWidth":0,"Resolution":300,"AllowEdit":"Y","AllowMove":"Y","AutoDirection":"Y","ApplyMask":"N","RealX":0,"RealY":0,"RealWidth":816,"RealHeight":1110}]');
  body.append('hidd_images_info', JSON.stringify(cards.map((sides) => sides.back ? uncompressImageData(settings, sides.back) : null)));
  body.append('hidd_pixel_info', '{"ProductWidth":248,"ProductHeight":346,"ProductPadding":12,"PaddingLeft":12,"PaddingTop":12,"PaddingRight":12,"PaddingBottom":12,"SafeLeft":12,"SafeTop":12,"SafeRight":12,"SafeBottom":12,"Radius":0,"IsUnpick":"N","IsLapped":"N","IsPartImage":"N","LappedType":"A","LappedRow":0,"LappedCol":0,"Resolution":300,"AllowDesign":"Y","PreviewWidth":272,"PreviewHeight":370,"Filter":"","AllowEditFilter":"Y","ImageMode":"B","IsTextZoom":"Y"}');
  body.append('hidd_direction', 'V');
  body.append('hidd_backgroundColor', '');
  body.append('hidd_image_format', 'png');
  body.append('hidd_crop_info', JSON.stringify(cards.map((sides) => sides.back ? uncompressCropData(settings, sides.back) : null)));
  body.append('hidd_photo_cookie', 'Y');
  body.append('hidd_userName', '');
  body.append('hidd_imageWidth', '272');
  body.append('hidd_webSiteCode', 'PC');
  body.append('hidd_safe_area_link_url', `${settings.url}/pops/faq-photo.html`);

  return fetch(url(`${settings.url}/products/playingcard/design/dn_playingcards_back_dynamic.aspx`, {
    ssid: projectId,
  }), {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
}

export const saveBackTextStep = (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const count = cards.length;

  const body = new FormData();
  body.append('__EVENTTARGET', 'btn_next_step');
  body.append('__EVENTARGUMENT', '');
  body.append('__VIEWSTATE', '/wEPDwUKLTIwNjcwMjI0NA8WAh4TVmFsaWRhdGVSZXF1ZXN0TW9kZQIBFgICAw9kFgICOQ9kFgICAw9kFgYCAQ8WAh4JaW5uZXJodG1sBfkKPGRpdiBjbGFzcz0iZGVzaWduVHJhY2tlckJhciI+PHVsPjxsaSBjbGFzcz0iY29tcGxldGViYXJfbGVmdCI+PGRpdiBjbGFzcz0iY29tcHRvcCI+PGltZyBzcmM9Imh0dHBzOi8vd3d3Lm1ha2VwbGF5aW5nY2FyZHMuY29tL2ltYWdlcy9zeXN0ZW0vcHJvY2Vzc2Jhcl90aWNrLmdpZiI+PC9kaXY+PGRpdiBjbGFzcz0iY29tcGJvdHRvbSIgPjxhIG9uY2xpY2s9Im9UcmFja2VyQmFyLnNldEZsb3coJ2h0dHBzOi8vd3d3Lm1ha2VwbGF5aW5nY2FyZHMuY29tL3Byb2R1Y3RzL3BsYXlpbmdjYXJkL2Rlc2lnbi9kbl9wbGF5aW5nY2FyZHNfZnJvbnRfZHluYW1pYy5hc3B4P3NzaWQ9RkRGQkNFMUYyMjg1NDc4NUI4RjVGRTAyNjJFOTEzMTYnKTsiPkN1c3RvbWl6ZSBGcm9udDwvYT48L2Rpdj48L2xpPjxsaSBjbGFzcz0iY29tcGxldGViYXJfY2VudGVyIj48ZGl2IGNsYXNzPSJjb21wdG9wIj48aW1nIHNyYz0iaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vaW1hZ2VzL3N5c3RlbS9wcm9jZXNzYmFyX3RpY2suZ2lmIj48L2Rpdj48ZGl2IGNsYXNzPSJjb21wYm90dG9tIiA+PGEgb25jbGljaz0ib1RyYWNrZXJCYXIuc2V0RmxvdygnaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vZGVzaWduL2RuX3RleHRlZGl0b3JfZnJvbnQuYXNweD9zc2lkPUZERkJDRTFGMjI4NTQ3ODVCOEY1RkUwMjYyRTkxMzE2Jyk7Ij5BZGQgVGV4dCBUbyBGcm9udDwvYT48L2Rpdj48L2xpPjxsaSBjbGFzcz0iY29tcGxldGViYXJfY2VudGVyIj48ZGl2IGNsYXNzPSJjb21wdG9wIj48aW1nIHNyYz0iaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vaW1hZ2VzL3N5c3RlbS9wcm9jZXNzYmFyX3RpY2suZ2lmIj48L2Rpdj48ZGl2IGNsYXNzPSJjb21wYm90dG9tIiA+PGEgb25jbGljaz0ib1RyYWNrZXJCYXIuc2V0RmxvdygnaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vcHJvZHVjdHMvcGxheWluZ2NhcmQvZGVzaWduL2RuX3BsYXlpbmdjYXJkc19iYWNrX2R5bmFtaWMuYXNweD9zc2lkPUZERkJDRTFGMjI4NTQ3ODVCOEY1RkUwMjYyRTkxMzE2Jyk7Ij5DdXN0b21pemUgQmFjazwvYT48L2Rpdj48L2xpPjxsaSBjbGFzcz0iY3VycmVudGJhciBzdGVwaWNvY2VudGVyIj48ZGl2IGNsYXNzPSJjdXJydG9wIj48c3Bhbj40PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImN1cnJib3R0b20iID48c3Bhbj5BZGQgVGV4dCBUbyBCYWNrPC9zcGFuPjwvZGl2PjwvbGk+PGxpIGNsYXNzPSJyZWFkeWJhcl9yaWdodCI+PGRpdiBjbGFzcz0icmVhZHl0b3AiPjxzcGFuPjU8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0icmVhZHlib3R0b20iIHN0eWxlPSJ3aWR0aDogMTMwcHgiPjxzcGFuPlByZXZpZXcgJiBBZGQgdG8gQ2FydDwvc3Bhbj48L2Rpdj48L2xpPjwvdWw+PC9kaXY+ZAIDDxYCHwEFmAc8ZGl2IGNsYXNzPSJuc2JveCI+PGRpdiBjbGFzcz0idGVtcG9yYXJ5c2F2ZWZyYW1lIj48ZGl2IGlkPSJkaXZfdGVtcG9yYXJ5c2F2ZWJveCIgY2xhc3M9InRlbXBvcmFyeXNhdmVib3giPjxkaXYgY2xhc3M9InRzbmFtZWJveCI+PGlucHV0IGlkPSJ0eHRfdGVtcG9yYXJ5bmFtZSIgdHlwZT0idGV4dCIgdmFsdWU9IlByb2plY3QtNHRGQ01LR0pkTSIgbWF4TGVuZ3RoPSIzMiI+PC9kaXY+PGRpdiBpZD0iZGl2X3RlbXBvcmFyeXJlbWFyayIgY2xhc3M9InRzcmVtYXJrIj4oTm90IHlldCBzYXZlZCk8L2Rpdj48ZGl2IGNsYXNzPSJibl90ZW1wb3JhcnlzYXZlYm94Ij48ZGl2IGNsYXNzPSJibl90ZW1wb3JhcnlzYXZlIj48YSBvbmNsaWNrPSJvRGVzaWduLnNldFRlbXBvcmFyeVNhdmUoKTsiPjwvYT48L2Rpdj48L2Rpdj48ZGl2IGlkPSJkaXZfdGVtcG9yYXJ5c2F2ZXN0YXR1cyIgY2xhc3M9InRzc3RhdHVzYm94IiBzdHlsZT0iZGlzcGxheTogbm9uZTsiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgaWQ9ImRpdk5leHRCdXR0b25Cb3giIGNsYXNzPSJibm5leHRzdGVwYm94Ij48ZGl2IGNsYXNzPSJibl9uZXh0c3RlcCI+PGEgb25jbGljaz0ib0Rlc2lnbi5zZXROZXh0U3RlcCgpOyI+PC9hPjwvZGl2PjwvZGl2PjxkaXYgaWQ9ImRpdlByZXZpb3VzQnV0dG9uQm94IiBpc1RvcE1vc3Q9Ik4iIGNsYXNzPSJibnByZXZpb3VzYm94Ij48ZGl2IGNsYXNzPSJibl9wcmV2aW91c19kbiI+PGEgb25jbGljaz0ib1RyYWNrZXJCYXIuc2V0RmxvdygnaHR0cHM6Ly93d3cubWFrZXBsYXlpbmdjYXJkcy5jb20vcHJvZHVjdHMvcGxheWluZ2NhcmQvZGVzaWduL2RuX3BsYXlpbmdjYXJkc19iYWNrX2R5bmFtaWMuYXNweD9zc2lkPUZERkJDRTFGMjI4NTQ3ODVCOEY1RkUwMjYyRTkxMzE2JywnTicpOyI+PC9hPjwvZGl2PjwvZGl2PjwvZGl2PmQCBQ8WAh8BBcsBPGRpdiBjbGFzcz0icnRib3giPjxhIGhlcmY9IiMiIG9uY2xpY2s9IndpbmRvdy5zY3JvbGxUbygwLCAwKTsiPkJBQ0sgVE8gVE9QPC9hPjwvZGl2PjxkaXYgY2xhc3M9InJ0Ym94Ij48YSBoZXJmPSIjIiBvbmNsaWNrPSJvVHJhY2tlckJhci5zZXRGbG93KCcuLi9kZXNpZ24vY3VzdG9tLWJsYW5rLWNhcmQuaHRtbCcsJ1knKTsiPkNBTkNFTDwvYT48L2Rpdj5kZGo71wD1w5lGhD2XJv/W8GnmCSPs');
  body.append('__VIEWSTATEGENERATOR', '1CEABFF3');
  body.append('hidd_pixel_info', '[{"FixedWidth":272,"FixedHeight":370,"Width":272,"Height":370,"Radius":0,"IsPartImage":"N","IsTextZoom":"Y","PreviewWidth":272,"PreviewHeight":370,"Zoom":1.0}]');
  body.append('hidd_pixel_info_part', '');
  body.append('hidd_designinfo', [...new Array(count)].map(() => '').join('◇'));
  body.append('hidd_unpickinfo', [...new Array(count)].map((_, index) => `9F0172C5897A2415B0EB388C1447803C_TVB${index + 1}`).join(';'));
  body.append('hidd_unpickinfo_suit', '');
  body.append('hidd_tips', 'tp_text');
  body.append('hidd_messages', '');
  body.append('hidd_image_path', '..//PreviewFiles/Normal/temp/thumb');
  body.append('hidd_unpickinfo_boundary', '');
  body.append('hidd_single_color_text', 'N');
  body.append('hidd_isSuitCountMode', 'N');
  body.append('hidd_fonts', JSON.stringify(mpcFonts));
  body.append('hidd_color_info', JSON.stringify(mpcColors));
  body.append('hidd_side_info', '');
  body.append('hidd_allow_addtext', 'Y');
  body.append('hidd_designMode', '');
  body.append('hidd_upload', '');
  body.append('hidd_expand_info', '');
  body.append('hidd_expand_apply', '');
  body.append('hidd_productgroup', '');
  body.append('hidd_background_caption_bg', '');
  body.append('hidd_background_message_bg', '');
  body.append('hidd_expand_applyBgColor', '');
  body.append('hidd_text_effect_color_info', '');
  body.append('hidd_preview_imge_exp', 'jpg');
  body.append('hidd_min_fontsize', '0');
  body.append('hidd_using_new_version', 'Y');
  body.append('hidd_card_number_title', 'Card');

  return fetch(url(`${settings.url}/design/dn_texteditor_back.aspx`, {
    ssid: projectId,
  }), {
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

export const uncompressCropData = (settings: Settings, data: CompressedImageData) => {
  return [{
    ID: data.ID,
    SourceID: data.SourceID,
    Exp: data.Exp,
    X: 0,
    Y: 0,
    Width: Math.round(data.Width / (data.Height / settings.height)),
    Height: settings.height,
    CropX: 0,
    CropY: 0,
    CropWidth: settings.width,
    CropHeight: settings.height,
    CropRotate: 0.0,
    Rotate: 0.0,
    Zoom: 1.0,
    Scale: settings.scale,
    FlipHorizontal: 'N',
    FlipVertical: 'N',
    Sharpen: 'N',
    Filter: settings.filter,
    Brightness: 0,
    ThumbnailScale: 1.0,
    AllowEdit: 'Y',
    AllowMove: 'Y',
    Alpha: 1.0,
    Resolution: settings.dpi,
    Index: 0,
    Quality: (data.Height / settings.height * 100) >= settings.dpi ? 'Y' : 'N', // A guess
    AutoDirection: 'N',
    ApplyMask: settings.applyMask ? 'Y' : 'N',
    IsEmpty: false,
  }]
}

export const saveSession = (projectId: string, settings: Settings, cards: UploadedImage[]) => {
  const body = new FormData();
  // list of front images for the project
  body.append('frontImageList', JSON.stringify(cards.map((sides) => sides.front ? uncompressImageData(settings, sides.front) : null)));
  // list of front images assigned to cards
  body.append('frontCropInfo', JSON.stringify(cards.map((sides) => sides.front ? uncompressCropData(settings, sides.front) : null)));
  // page designer for multiple front cards
  body.append('frontDesignModePage', 'dn_playingcards_mode_nf.aspx');
  body.append('frontTextInfo', [...new Array(cards.length)].map(() => '').join('%u25C7'));
  // list of back images for the project
  body.append('backImageList', JSON.stringify(cards.map((sides) => sides.back ? uncompressImageData(settings, sides.back) : null)));
  // list of back images assigned to cards
  body.append('backCropInfo', JSON.stringify(cards.map((sides) => sides.back ? uncompressCropData(settings, sides.back) : null)));
  body.append('backTextInfo', [...new Array(cards.length)].map(() => '').join('%u25C7'));
  // page designer for multiple back cards
  body.append('backDesignModePage', 'dn_playingcards_mode_nb.aspx');
  // no idea
  body.append('expand', 'null');
  // no idea
  body.append('mapinfo', '[]');

  return fetch(url(`${settings.url}/design/dn_keep_session.aspx`, {
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
  console.log(expandedCards);

  const projectId = await initProject(settings, expandedCards);

  await saveFrontSettings(projectId, settings, expandedCards);
  await saveBackSettings(projectId, settings, expandedCards);
  await saveFrontImageStep(projectId, settings, expandedCards);
  await saveFrontTextStep(projectId, settings, expandedCards);
  await saveBackImageStep(projectId, settings, expandedCards);
  await saveBackTextStep(projectId, settings, expandedCards);
  await saveSession(projectId, settings, expandedCards);

  return `${settings.url}/design/dn_preview_layout.aspx?ssid=${projectId}`;
}

export const uploadImage = async (settings: CardSettings, side: string, image: File) => {
  const body = new FormData();
  body.append('fileData', image);
  body.append('userName', '');
  body.append('layer', side);
  body.append('st', new Date().toISOString().replace('T', ' ').slice(0, 23));
  body.append('pt', '14167');
  body.append('ip', '');

  const r = await fetch(`${settings.url}/uploader/up_product.aspx`, {
    method: 'POST',
    body: body,
    retries: 5,
    retryDelay: 500,
  });
  const root = parseHtml(await r.text());
  return JSON.parse(xpath(root, '/html/body/form/input[@id="hidd_image_info"]/@value')!.textContent!);
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