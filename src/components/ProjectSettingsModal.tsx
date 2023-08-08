import { Settings, UploadedImage } from "mpc_api";
import * as React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { CardStock, Site, Unit } from "../types/mpc";

interface ProjectSettingsModalProps {
  site: Site;
  unit: Unit;
  name?: string;
  cards: UploadedImage[];
  onUpload: (settings: Settings, cards: UploadedImage[]) => void;
  onClose: () => void;
}

interface ProjectSettingsModalState {
  name?: string;
  cardStock?: CardStock;
  printTypeCode?: string;
  finishCode?: string;
  packagingCode?: string;
}

export default class ProjectSettingsModal extends React.Component<ProjectSettingsModalProps, ProjectSettingsModalState> {
  constructor(props: ProjectSettingsModalProps) {
    super(props);

    const { site, unit, name } = props;
    const cardStock = site.cardStockListByUnit(unit)[0]
    this.state = {
      name: name?.substring(0, 32),
      cardStock: cardStock,
      printTypeCode: site.printTypeListByCardStock(unit, cardStock)[0]?.code,
      finishCode: site.finishListByCardStock(unit, cardStock)[0]?.code,
      packagingCode: site.packagingListByCardStock(unit, cardStock)[0]?.code,
    };
  }

  onUpload = (settings: Settings) => {
    const { cards } = this.props;
    this.props.onUpload(settings, cards);
  }

  onClose = () => {
    this.props.onClose();
  }

  onCardStockChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { site, unit } = this.props;
    const { printTypeCode, finishCode, packagingCode } = this.state;
    const cardStock = site.cardStockList.find(it => it.code == event.currentTarget.value);
    const printTypeList = unit && cardStock && site.printTypeListByCardStock(unit, cardStock);
    const finishList = unit && cardStock && site.finishListByCardStock(unit, cardStock);
    const packagingList = unit && cardStock && site.packagingListByCardStock(unit, cardStock);
    this.setState({
      cardStock: cardStock,
      printTypeCode: printTypeList?.find(it => it.code == printTypeCode)?.code ?? printTypeList?.at(0)?.code,
      finishCode: finishList?.find(it => it.code == finishCode)?.code ?? finishList?.at(0)?.code,
      packagingCode: packagingList?.find(it => it.code == packagingCode)?.code ?? packagingList?.at(0)?.code,
    });
  }

  onPrintTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({
      printTypeCode: event.currentTarget.value,
    });
  }

  onFinishChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({
      finishCode: event.currentTarget.value,
    });
  }

  onPackagingChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({
      packagingCode: event.currentTarget.value,
    });
  }

  onNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      name: event.currentTarget.value.substring(0, 32),
    });
  }

  getSettings = (): Settings | undefined => {
    const { name, cardStock, printTypeCode, finishCode, packagingCode } = this.state;
    if (cardStock === undefined || printTypeCode === undefined || finishCode === undefined || packagingCode === undefined) {
      return;
    }

    const { unit } = this.props;
    return {
      url: window.location.origin,
      name: name,
      unit: unit.code,
      product: unit.productCode,
      frontDesign: unit.frontDesignCode,
      backDesign: unit.backDesignCode,
      cardStock: cardStock.code,
      printType: printTypeCode,
      finish: finishCode,
      packaging: packagingCode,
      width: unit.width,
      height: unit.height,
      dpi: unit.dpi,
      filter: unit.filter,
      auto: unit.auto,
      scale: unit.scale,
      sortNo: unit.sortNo,
      applyMask: unit.applyMask,
      maxCards: unit.maxCards,
    };
  }

  render() {
    const { site, unit, cards } = this.props;
    const { name, cardStock, printTypeCode, finishCode, packagingCode } = this.state;
    const settings = this.getSettings();
    const count = cards.reduce((value, it) => value + it.count, 0)
    const tooManyCards = count > unit.maxCards;

    return (
      <Modal show centered>
        <Modal.Header>Upload Project</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FloatingLabel controlId="floatingSelect1" label="Product">
              <Form.Select aria-label="Product" value={unit.code} disabled>
                <optgroup label="Recomended">
                  {site.unitList.filter(it => it.curated !== null).map(it => (
                    <option key={it.code} value={it.code}>{it.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Other">
                  {site.unitList.filter(it => it.curated === null).map(it => (
                    <option key={it.code} value={it.code}>{it.name}</option>
                  ))}
                </optgroup>
              </Form.Select>
            </FloatingLabel>
            {tooManyCards && (
              <Alert variant="warning" style={{ margin: 0 }}>
                As your project has more than {unit.maxCards} cards, it will automatically be split into multiple projects.
              </Alert>
            )}
            <FloatingLabel controlId="floatingText" label="Project Name">
              <Form.Control aria-label="ProjectName" value={name ?? ''} onChange={this.onNameChange} />
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect2" label="Card Stock">
              <Form.Select aria-label="Card Stock" value={cardStock?.code} onChange={this.onCardStockChange}>
                {unit && site.cardStockListByUnit(unit)
                  .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
                }
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect3" label="Print Type">
              <Form.Select aria-label="Print Type" value={printTypeCode} onChange={this.onPrintTypeChange}>
                {unit && cardStock && site.printTypeListByCardStock(unit, cardStock)
                  .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
                }
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect4" label="Finish">
              <Form.Select aria-label="Finish" value={finishCode} onChange={this.onFinishChange}>
                {unit && cardStock && site.finishListByCardStock(unit, cardStock)
                  .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
                }
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect5" label="Packaging">
              <Form.Select aria-label="Packaging" value={packagingCode} onChange={this.onPackagingChange}>
                {unit && cardStock && site.packagingListByCardStock(unit, cardStock)
                  .map(it => <option key={it.code} value={it.code}>{it.name}</option>)
                }
              </Form.Select>
            </FloatingLabel>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onClose}>Close</Button>
          <Button variant="success" onClick={() => this.onUpload(settings!)} disabled={!settings}>Upload</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
