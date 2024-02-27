import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import Nav from 'react-bootstrap/esm/Nav'
import Tab from 'react-bootstrap/esm/Tab'
import { CardStock, Finish, Packaging, PrintType, Site, Unit } from '../types/mpc'
import { ParsedProject, ProjectCard } from '../types/project'
import { Settings } from 'mpc_api'


interface UploadProject {
  name: string
  unit: Unit
  cards: ProjectCard[]
  cardStock?: CardStock
  printType?: PrintType
  finish?: Finish
  packaging?: Packaging
}

const getSettings = ({ cards, unit, name, cardStock, printType, finish, packaging }: UploadProject): UploadProjectSettings | undefined => {
  if (cardStock === undefined || printType === undefined || finish === undefined || packaging === undefined) return
  return {
    cards,
    settings: {
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
    }
  }
}

const getCardStock = (site: Site, value: string) => site.cardStockList.find(it => it.code == value)

const getPrintType = (site: Site, unit: Unit, cardStock: CardStock | undefined, value: string) => {
  return cardStock
    ? site.printTypeListByCardStock(unit, cardStock).find(e => e.code == value)
    : undefined
}

const getDefaultPrintType = (site: Site, unit: Unit, cardStock: CardStock | undefined, printType?: PrintType) => {
  const printTypeList = unit && cardStock && site.printTypeListByCardStock(unit, cardStock)
  return printTypeList?.find(it => it.code == printType?.code) ?? printTypeList?.at(0)
}

const getFinish = (site: Site, unit: Unit, cardStock: CardStock | undefined, value: string) => {
  return cardStock
    ? site.finishListByCardStock(unit, cardStock).find(e => e.code == value)
    : undefined
}

const getDefaultFinish = (site: Site, unit: Unit, cardStock: CardStock | undefined, finish?: Finish) => {
  const finishList = unit && cardStock && site.finishListByCardStock(unit, cardStock)
  return finishList?.find(it => it.code == finish?.code) ?? finishList?.at(0)
}

const getDefaultPackaging = (site: Site, unit: Unit, cardStock: CardStock | undefined, packaging?: Packaging) => {
  const packagingList = unit && cardStock && site.packagingListByCardStock(unit, cardStock)
  return packagingList?.find(it => it.code == packaging?.code) ?? packagingList?.at(0)
}

const getPackaging = (site: Site, unit: Unit, cardStock: CardStock | undefined, value: string) => {
  return cardStock
    ? site.packagingListByCardStock(unit, cardStock).find(e => e.code == value)
    : undefined
}

interface ProjectSettingsPanelProps {
  site: Site
  project: UploadProject
  onUpdate: (project: UploadProject) => void
}

const ProjectSettingsPanel = ({ site, project, onUpdate }: ProjectSettingsPanelProps) => {
  const { unit, cards } = project
  const [name, setName] = useState<string>(() => project.name)
  const [cardStock, setCardStock] = useState<CardStock | undefined>(() => project.cardStock)
  const [printType, setPrintType] = useState<PrintType | undefined>(() => project.printType)
  const [finish, setFinish] = useState<Finish | undefined>(() => project.finish)
  const [packaging, setPackaging] = useState<Packaging | undefined>(() => project.packaging)

  const onNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.currentTarget.value.substring(0, 32)
    setName(value)
  }

  const onCardStockChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setCardStock(getCardStock(site, event.currentTarget.value))
  }

  const onPrintTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setPrintType((getPrintType(site, unit, cardStock, event.currentTarget.value)))
  }

  const onFinishChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setFinish(getFinish(site, unit, cardStock, event.currentTarget.value))
  }

  const onPackagingChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setPackaging(getPackaging(site, unit, cardStock, event.currentTarget.value))
  }

  useEffect(() => {
    setPrintType(getDefaultPrintType(site, unit, cardStock, printType))
    setFinish((getDefaultFinish(site, unit, cardStock, finish)))
    setPackaging(getDefaultPackaging(site, unit, cardStock, packaging))
  }, [cardStock])

  useEffect(() => {
    onUpdate({
      ...project,
      cardStock,
      printType,
      finish,
      packaging,
    })
  }, [name, cardStock, printType, finish, packaging])

  const count = cards.reduce((value, it) => value + it.count, 0)
  const tooManyCards = count > unit.maxCards

  return (
    <div className='d-flex flex-column row-gap-2'>
      <div className='d-flex flex-row gap-1'>
        <FloatingLabel controlId='product' label='Product' style={{ flex: 1 }}>
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
        <FloatingLabel controlId='cards' label='Cards'>
          <Form.Control aria-label='Cards' disabled value={count} />
        </FloatingLabel>
      </div>
      {tooManyCards && (
        <Form.Text muted>
          As your project has more than {unit.maxCards} cards, it will automatically be split into multiple projects.
        </Form.Text>
      )}
      <FloatingLabel controlId='name' label='Project Name'>
        <Form.Control aria-label='Project Name' value={name ?? ''} onChange={onNameChange} />
      </FloatingLabel>
      <FloatingLabel controlId='cardStock' label='Card Stock'>
        <Form.Select aria-label='Card Stock' value={cardStock?.code} onChange={onCardStockChange}>
          {unit && site.cardStockListByUnit(unit)
            .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
          }
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel controlId='printType' label='Print Type'>
        <Form.Select aria-label='Print Type' value={printType?.code} onChange={onPrintTypeChange}>
          {unit && cardStock && site.printTypeListByCardStock(unit, cardStock)
            .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
          }
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel controlId='finish' label='Finish'>
        <Form.Select aria-label='Finish' value={finish?.code} onChange={onFinishChange}>
          {unit && cardStock && site.finishListByCardStock(unit, cardStock)
            .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
          }
        </Form.Select>
      </FloatingLabel>
      <FloatingLabel controlId='packaging' label='Packaging'>
        <Form.Select aria-label='Packaging' value={packaging?.code} onChange={onPackagingChange}>
          {unit && cardStock && site.packagingListByCardStock(unit, cardStock)
            .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
          }
        </Form.Select>
      </FloatingLabel>
    </div>
  )
}

export interface UploadProjectSettings {
  settings: Settings
  cards: ProjectCard[]
}

interface ProjectSettingsModalProps {
  site: Site
  projects: ParsedProject[]
  onUpload: (upload: UploadProjectSettings[]) => void
  onClose: () => void
}

const ProjectSettingsModal = ({ site, projects, onUpload, onClose }: ProjectSettingsModalProps) => {
  const [projectData, setProjectData] = useState<UploadProject[]>(() => Object.entries(projects.groupBy((value) => value.code))
    .map(([unitCode, projects]): UploadProject => {
      const project = projects[0]
      const unit = site.unitList.find(e => e.code == unitCode)!
      const cardStock = site.cardStockListByUnit(unit)?.at(0)
      const printType = getDefaultPrintType(site, unit, cardStock)
      const finish = getDefaultFinish(site, unit, cardStock)
      const packaging = getDefaultPackaging(site, unit, cardStock)
      return {
        name: project.name,
        unit: site.unitList.find(e => e.code == unitCode)!,
        cards: projects.flatMap(project => project.cards),
        cardStock,
        printType,
        finish,
        packaging,
      }
    }))
  const [projectSettings, setProjectSettings] = useState<(UploadProjectSettings | undefined)[]>([])

  useEffect(() => {
    setProjectSettings(projectData.map(project => getSettings(project)))
  }, projectData)

  const onUpdateProjectSettings = (project: UploadProject) => {
    setProjectData(prevState => ([
      ...prevState.map(e => e.unit == project.unit ? project : e)
    ]))
  }

  return (
    <Modal show fullscreen centered className='mpc-project-helper-dialog'>
      <Modal.Header>Upload Project</Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey={projectData[0].unit.code}>
          <div className='d-flex flex-row gap-2'>
            <div className='d-flex flex-column' style={{ flex: 1 }}>
              <Nav variant="pills" className="flex-column">
                {projectData.map(e => (
                  <Nav.Item key={e.unit.code}>
                    <Nav.Link eventKey={e.unit.code} style={{ textWrap: 'nowrap' }}>{e.unit.name}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </div>
            <div className='d-flex flex-column' style={{ flex: 2 }}>
              <Tab.Content>
                {projectData.map(e => (
                  <Tab.Pane key={e.unit.code} eventKey={e.unit.code}>
                    <ProjectSettingsPanel site={site} project={e} onUpdate={onUpdateProjectSettings} />
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
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
          disabled={projectSettings.some(e => e == undefined)}
          onClick={() => onUpload(projectSettings as UploadProjectSettings[])}
        >
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ProjectSettingsModal
