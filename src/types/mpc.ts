import mpcData from 'mpc_api/data'

declare global {
  interface Array<T> {
    toSorted(compareFn?: ((a: T, b: T) => number) | undefined): Array<T>
    toObject(callbackFn: (value: T) => string): { [key: string]: T }
    groupBy(callbackFn: (value: T) => string): { [key: string]: T[] }
  }
}

Array.prototype.toSorted = function <T>(this: T[], compareFn?: ((a: T, b: T) => number) | undefined): Array<T> {
  const copy = [...this]
  copy.sort(compareFn)
  return copy
}

Array.prototype.toObject = function <T>(this: T[], callbackFn: (value: T) => string): { [key: string]: T }  {
  return this.reduce<{ [key: string]: T }>((group, value) => {
    const key = callbackFn(value)
    group[key] = value
    return group
  }, {})
}

Array.prototype.groupBy = function <T>(this: T[], callbackFn: (value: T) => string): { [key: string]: T[] }  {
  return this.reduce<{ [key: string]: T[] }>((group, value) => {
    const key = callbackFn(value)
    group[key] ??= []
    group[key].push(value)
    return group
  }, {})
}

export class Site {
  code: string
  name: string
  urls: string[]

  constructor({ code, name, urls }: { code: string, name: string, urls: string[] }) {
    this.code = code
    this.name = name
    this.urls = urls
  }

  get unitList() {
    const siteCode = this.code
    return mpcData.units[siteCode] ?? []
  }

  get cardStockList() {
    const siteCode = this.code
    return mpcData.cardStocks[siteCode] ?? []
  }

  cardStockListByUnit(unit: Unit) {
    return this.cardStockList
      .filter(cardStock => unit.options.find(it => it.cardStockCode == cardStock.code))
      .toSorted((a, b) => unit.options.findIndex(it => it.cardStockCode == a.code) - unit.options.findIndex(it => it.cardStockCode == b.code))
  }

  get printTypeList() {
    const siteCode = this.code
    return mpcData.printTypes[siteCode] ?? []
  }

  printTypeListByCardStock(unit: Unit, cardStock: CardStock) {
    const c = unit.options.find(it => it.cardStockCode == cardStock.code)
    return this.printTypeList
      .filter(it => c?.printTypeCodes.includes(it.code))
      .toSorted((a, b) => c!.printTypeCodes.indexOf(a.code) - c!.printTypeCodes.indexOf(b.code))
  }

  get finishList() {
    const siteCode = this.code
    return mpcData.finishes[siteCode] ?? []
  }

  finishListByCardStock(unit: Unit, cardStock: CardStock) {
    const c = unit.options.find(it => it.cardStockCode == cardStock.code)
    return this.finishList
      .filter(it => c?.finishCodes.includes(it.code))
      .toSorted((a, b) => c!.finishCodes.indexOf(a.code) - c!.finishCodes.indexOf(b.code))
  }

  get packagingList() {
    const siteCode = this.code
    return mpcData.packagings[siteCode] ?? []
  }

  packagingListByCardStock(unit: Unit, cardStock: CardStock) {
    const c = unit.options.find(it => it.cardStockCode == cardStock.code)
    return this.packagingList
      .filter(it => c?.packagingCodes.includes(it.code))
      .toSorted((a, b) => c!.packagingCodes.indexOf(a.code) - c!.packagingCodes.indexOf(b.code))
  }
}

export type UnitData = {
  [key: string]: Unit[]
}

export type Unit = {
  applyMask: boolean
  auto: boolean
  backDesignCode: string
  code: string
  curated: any
  dpi: number
  filter: string
  frontDesignCode: string
  height: number
  lappedType: string
  maxCards: number
  name: string
  options: UnitOption[]
  padding: number
  productCode: string
  productHeight: number
  productPadding: number
  productWidth: number
  safe: number
  scale: number
  sortNo: number
  unpick: boolean
  width: number
  x: number
  y: number
}

export type UnitOption = {
  cardStockCode: string
  finishCodes: string[]
  packagingCodes: string[]
  printTypeCodes: string[]
}

export type CardStockData = {
  [key: string]: CardStock[]
}

export type CardStock = {
  code: string
  name: string
}

export type FinishData = {
  [key: string]: Finish[]
}

export type Finish = {
  code: string
  name: string
}

export type PackagingData = {
  [key: string]: Packaging[]
}

export type Packaging = {
  code: string
  name: string
}

export type PrintTypeData = {
  [key: string]: PrintType[]
}

export type PrintType = {
  code: string
  name: string
}
