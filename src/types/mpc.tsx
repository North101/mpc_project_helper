export interface Site {
  code: string;
  name: string;
  url: string;
}

export interface Unit {
  code: string;
  name: string;
  siteCodes: string[];
  productCode: string;
  frontDesignCode: string;
  backDesignCode: string;
  width: number;
  height: number;
  dpi: number;
  filter: string;
  auto: boolean;
  scale: number;
  sortNo: number;
  applyMask: boolean;
  maxCards: number;
};
