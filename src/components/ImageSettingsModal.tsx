import { CardSettings, Settings } from "mpc_api";
import * as React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { Card } from "../types/card";
import { CardStock, Site, Unit } from "../types/mpc";


interface ImageSettingsModalProps {
  site: Site;
  unit?: Unit;
  cards: Card[];
  onCardUpload: (settings: CardSettings, cards: Card[]) => void;
  onProjectUpload: (name: string, settings: Settings, cards: Card[]) => void;
  onClose: () => void;
}

interface ImageSettingsModalState {
  unit?: Unit;
  uploadProject: boolean;
  name?: string;
  cardStock?: CardStock;
  printTypeCode?: string;
  finishCode?: string;
  packagingCode?: string;
}

export default class ImageSettingsModal extends React.Component<ImageSettingsModalProps, ImageSettingsModalState> {
  constructor(props: ImageSettingsModalProps) {
    super(props);

    const { site } = props;
    const unit = props.unit ?? site.unitList.filter(it => it.curated)[0] ?? site.unitList[0];
    const cardStock = site.cardStockListByUnit(unit)[0]
    this.state = {
      unit: unit,
      uploadProject: false,
      name: undefined,
      cardStock: cardStock,
      printTypeCode: site.printTypeListByCardStock(unit, cardStock)[0]?.code,
      finishCode: site.finishListByCardStock(unit, cardStock)[0]?.code,
      packagingCode: site.packagingListByCardStock(unit, cardStock)[0]?.code,
    };
  }

  onCardUpload = (settings: CardSettings) => {
    this.props.onCardUpload(settings, this.props.cards);
  }

  onProjectUpload = (name: string, settings: Settings) => {
    this.props.onProjectUpload(name, settings, this.props.cards);
  }

  onClose = () => {
    this.props.onClose();
  }

  onUnitChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { site } = this.props;
    const unitCode = event.currentTarget.value;
    this.setState({
      unit: site.unitList.find(it => it.code === unitCode),
    });
  }

  onCardStockChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { site } = this.props;
    const { unit, printTypeCode, finishCode, packagingCode } = this.state;
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

  onUploadProjectChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      uploadProject: event.currentTarget.checked,
    });
  }

  onNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      name: event.currentTarget.value.substring(0, 32),
    });
  }

  getCardSettings = (): CardSettings | undefined => {
    const { unit } = this.state;
    if (!unit) return;

    return {
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
    };
  }

  getProjectSettings = (): Settings | undefined => {
    const { unit, name, cardStock, printTypeCode, finishCode, packagingCode } = this.state;
    if (unit === undefined || cardStock === undefined || printTypeCode === undefined || finishCode === undefined || packagingCode === undefined) {
      return;
    }

    return {
      url: window.location.origin,
      unit: unit.code,
      product: unit.productCode,
      frontDesign: unit.frontDesignCode,
      backDesign: unit.backDesignCode,
      name: name,
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
    const { cards, site } = this.props;
    const { unit, uploadProject, name, cardStock, printTypeCode, finishCode, packagingCode } = this.state;
    const cardSettings = this.getCardSettings();
    const projectSettings = this.getProjectSettings();
    const count = cards.reduce((value, it) => value + it.count, 0);
    const tooManyCards = unit ? count > unit.maxCards : false;

    return (
      <Modal show centered>
        <Modal.Header>Image Upload</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FloatingLabel controlId="floatingSelect1" label="Product">
              <Form.Select aria-label="Product" value={unit?.code} onChange={this.onUnitChange}>
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
            <Form.Check
              type='checkbox'
              name="upload"
              label='Also upload project?'
              checked={uploadProject}
              onChange={this.onUploadProjectChange}
            />
            {uploadProject && (
              <>
                {unit && tooManyCards && (
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
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onClose}>Close</Button>
          {!uploadProject && (
            <Button variant="success" onClick={() => this.onCardUpload(cardSettings!)} disabled={!cardSettings}>Upload</Button>
          )}
          {uploadProject && (
            <Button variant="success" onClick={() => this.onProjectUpload(name ?? '', projectSettings!)} disabled={!projectSettings}>Upload</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}
