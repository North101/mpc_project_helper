import { CardSettings, Settings } from 'mpc_api'
import React, { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/esm/Alert'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { Card } from '../types/card'
import { CardStock, Finish, Packaging, PrintType, Site, Unit } from '../types/mpc'


interface ImageSettingsModalProps {
  site: Site
  unit?: Unit
  cards: Card[]
  onCardUpload: (name: string, settings: CardSettings, cards: Card[]) => void
  onProjectUpload: (settings: Settings, cards: Card[]) => void
  onClose: () => void
}

const ImageSettingsModal = ({ site, unit: initialUnit, cards, onCardUpload, onProjectUpload, onClose }: ImageSettingsModalProps) => {
  const [unit, setUnit] = useState<Unit | undefined>(() => initialUnit ?? site.unitList[0])
  const [name, setName] = useState<string>('')

  const [uploadProject, setUploadProject] = useState(false)
  const [cardStock, setCardStock] = useState<CardStock | undefined>(() => {
    return initialUnit && site.cardStockListByUnit(initialUnit)[0]
  })
  const [printType, setPrintType] = useState<PrintType | undefined>()
  const [finish, setFinish] = useState<Finish | undefined>()
  const [packaging, setPackaging] = useState<Packaging | undefined>()
  const [cardSettings, setCardSettings] = useState<CardSettings | undefined>()
  const [projectSettings, setProjectSettings] = useState<Settings | undefined>()

  const onUnitChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const unitCode = event.currentTarget.value
    setUnit(site.unitList.find(it => it.code === unitCode))
  }

  const onUploadProjectChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUploadProject(event.currentTarget.checked)
  }

  const onNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(event.currentTarget.value.substring(0, 32))
  }

  const onCardStockChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setCardStock(site.cardStockList.find(it => it.code == event.currentTarget.value))
  }

  const onPrintTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setPrintType(unit && cardStock
      ? site.printTypeListByCardStock(unit, cardStock).find(e => e.code == event.currentTarget.value)
      : undefined)
  }

  const onFinishChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setFinish(unit && cardStock
      ? site.finishListByCardStock(unit, cardStock).find(e => e.code == event.currentTarget.value)
      : undefined)
  }

  const onPackagingChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setPackaging(unit && cardStock
      ? site.packagingListByCardStock(unit, cardStock).find(e => e.code == event.currentTarget.value)
      : undefined)
  }

  useEffect(() => {
    setCardStock(unit ? site.cardStockListByUnit(unit)?.at(0) : undefined)
  }, [unit])

  useEffect(() => {
    const printTypeList = unit && cardStock && site.printTypeListByCardStock(unit, cardStock)
    setPrintType(printTypeList?.find(it => it.code == printType?.code) ?? printTypeList?.at(0))

    const finishList = unit && cardStock && site.finishListByCardStock(unit, cardStock)
    setFinish(finishList?.find(it => it.code == finish?.code) ?? finishList?.at(0))

    const packagingList = unit && cardStock && site.packagingListByCardStock(unit, cardStock)
    setPackaging(packagingList?.find(it => it.code == packaging?.code) ?? packagingList?.at(0))
  }, [cardStock])

  useEffect(() => {
    if (!unit) return

    setCardSettings({
      url: window.location.origin,
      unit: unit.code,
      product: unit.productCode,
      frontDesign: unit.frontDesignCode,
      backDesign: unit.backDesignCode,
      width: unit.width,
      height: unit.height,
      dpi: unit.dpi,
      filter: unit.filter,
      auto: unit.auto,
      scale: unit.scale,
      sortNo: unit.sortNo,
      applyMask: unit.applyMask,
    })
  }, [unit])

  useEffect(() => {
    if (unit === undefined || cardStock === undefined || printType === undefined || finish === undefined || packaging === undefined) {
      return
    }

    setProjectSettings({
      url: window.location.origin,
      unit: unit.code,
      product: unit.productCode,
      frontDesign: unit.frontDesignCode,
      backDesign: unit.backDesignCode,
      name: name,
      cardStock: cardStock.code,
      printType: printType?.code,
      finish: finish?.code,
      packaging: packaging?.code,
      width: unit.width,
      height: unit.height,
      dpi: unit.dpi,
      filter: unit.filter,
      auto: unit.auto,
      scale: unit.scale,
      sortNo: unit.sortNo,
      applyMask: unit.applyMask,
      maxCards: unit.maxCards,
    })
  }, [
    unit,
    cardStock,
    printType,
    finish,
    packaging,
  ])

  const count = cards.reduce((value, it) => value + it.count, 0)
  const tooManyCards = unit ? count > unit.maxCards : false

  return (
    <Modal show centered>
      <Modal.Header>Image Upload</Modal.Header>
      <Modal.Body>
        <div className='d-flex flex-column gap-2'>
          <FloatingLabel controlId='floatingSelect1' label='Product'>
            <Form.Select aria-label='Product' value={unit?.code} onChange={onUnitChange}>
              <optgroup label='Recomended'>
                {site.unitList.filter(it => it.curated !== null).map(it => (
                  <option key={it.code} value={it.code}>{it.name}</option>
                ))}
              </optgroup>
              <optgroup label='Other'>
                {site.unitList.filter(it => it.curated === null).map(it => (
                  <option key={it.code} value={it.code}>{it.name}</option>
                ))}
              </optgroup>
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel controlId='floatingText' label='Project Name'>
            <Form.Control aria-label='ProjectName' value={name} onChange={onNameChange} />
          </FloatingLabel>

          <Form.Check
            type='checkbox'
            name='upload'
            label='Also upload project?'
            checked={uploadProject}
            onChange={onUploadProjectChange}
          />
          {uploadProject && (
            <>
              {unit && tooManyCards && (
                <Alert variant='warning' className='m-0'>
                  As your project has more than {unit.maxCards} cards, it will automatically be split into multiple projects.
                </Alert>
              )}
              <FloatingLabel controlId='floatingSelect2' label='Card Stock'>
                <Form.Select aria-label='Card Stock' value={cardStock?.code} onChange={onCardStockChange}>
                  {unit && site.cardStockListByUnit(unit)
                    .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
                  }
                </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId='floatingSelect3' label='Print Type'>
                <Form.Select aria-label='Print Type' value={printType?.code} onChange={onPrintTypeChange}>
                  {unit && cardStock && site.printTypeListByCardStock(unit, cardStock)
                    .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
                  }
                </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId='floatingSelect4' label='Finish'>
                <Form.Select aria-label='Finish' value={finish?.code} onChange={onFinishChange}>
                  {unit && cardStock && site.finishListByCardStock(unit, cardStock)
                    .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
                  }
                </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId='floatingSelect5' label='Packaging'>
                <Form.Select aria-label='Packaging' value={packaging?.code} onChange={onPackagingChange}>
                  {unit && cardStock && site.packagingListByCardStock(unit, cardStock)
                    .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
                  }
                </Form.Select>
              </FloatingLabel>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>Close</Button>
        {!uploadProject && (
          <Button
            variant='success'
            onClick={() => onCardUpload(name, cardSettings!, cards)}
            disabled={!cardSettings}
          >
            Upload
          </Button>
        )}
        {uploadProject && (
          <Button
            variant='success'
            onClick={() => onProjectUpload(projectSettings!, cards)}
            disabled={!projectSettings}
          >
            Upload
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ImageSettingsModal
