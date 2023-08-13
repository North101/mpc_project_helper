import { Settings } from 'mpc_api'
import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/esm/Alert'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { CardStock, Finish, Packaging, PrintType, Site, Unit } from '../types/mpc'
import { ParsedProject } from '../types/project'

interface ProjectSettingsModalProps {
  site: Site
  unit: Unit
  projects: ParsedProject[]
  onUpload: (settings: Settings, projects: ParsedProject[]) => void
  onClose: () => void
}

const ProjectSettingsModal = ({ site, unit, projects, onUpload, onClose }: ProjectSettingsModalProps) => {
  const [name, setName] = useState<string | undefined>(() => projects?.at(0)?.name)
  const [cardStock, setCardStock] = useState<CardStock | undefined>(() => site.cardStockListByUnit(unit)?.at(0))
  const [printType, setPrintType] = useState<PrintType | undefined>()
  const [finish, setFinish] = useState<Finish | undefined>()
  const [packaging, setPackaging] = useState<Packaging | undefined>()
  const [settings, setSettings] = useState<Settings | undefined>()

  const onNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(event.currentTarget.value.substring(0, 32))
  }

  const onCardStockChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setCardStock(site.cardStockList.find(it => it.code == event.currentTarget.value))
  }

  const onPrintTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setPrintType(cardStock
      ? site.printTypeListByCardStock(unit, cardStock).find(e => e.code == event.currentTarget.value)
      : undefined)
  }

  const onFinishChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setFinish(cardStock
      ? site.finishListByCardStock(unit, cardStock).find(e => e.code == event.currentTarget.value)
      : undefined)
  }

  const onPackagingChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setPackaging(cardStock
      ? site.packagingListByCardStock(unit, cardStock).find(e => e.code == event.currentTarget.value)
      : undefined)
  }

  useEffect(() => {
    const printTypeList = unit && cardStock && site.printTypeListByCardStock(unit, cardStock)
    setPrintType(printTypeList?.find(it => it.code == printType?.code) ?? printTypeList?.at(0))

    const finishList = unit && cardStock && site.finishListByCardStock(unit, cardStock)
    setFinish(finishList?.find(it => it.code == finish?.code) ?? finishList?.at(0))

    const packagingList = unit && cardStock && site.packagingListByCardStock(unit, cardStock)
    setPackaging(packagingList?.find(it => it.code == packaging?.code) ?? packagingList?.at(0))
  }, [cardStock])

  useEffect(() => {
    if (cardStock === undefined || printType === undefined || finish === undefined || packaging === undefined) return

    setSettings({
      url: window.location.origin,
      name: name,
      unit: unit.code,
      product: unit.productCode,
      frontDesign: unit.frontDesignCode,
      backDesign: unit.backDesignCode,
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
  }, [name, cardStock, printType, finish, packaging])

  const count = projects.reduce((value, it) => value + it.cards.reduce((value, it) => value + it.count, 0), 0)
  const tooManyCards = count > unit.maxCards

  return (
    <Modal show centered>
      <Modal.Header>Upload Project</Modal.Header>
      <Modal.Body>
        <div className='d-flex flex-column row-gap-2'>
          <FloatingLabel controlId='floatingSelect1' label='Product'>
            <Form.Select aria-label='Product' value={unit.code} disabled>
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
          {tooManyCards && (
            <Alert variant='warning' className='m-0'>
              As your project has more than {unit.maxCards} cards, it will automatically be split into multiple projects.
            </Alert>
          )}
          <FloatingLabel controlId='floatingText' label='Project Name'>
            <Form.Control aria-label='Project Name' value={name ?? ''} onChange={onNameChange} />
          </FloatingLabel>
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
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant='success'
          onClick={() => onUpload(settings!, projects)}
          disabled={!settings}
        >
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ProjectSettingsModal
