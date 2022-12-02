import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import cardStockData from "../api/data/card_stock.json";
import finishData from "../api/data/finish.json";
import packagingData from "../api/data/packaging.json";
import printTypeData from "../api/data/print_type.json";
import unitData from "../api/data/unit.json";
import { CardSettings, Settings } from "../api/mpc_api";
import { Site, Unit } from "../types/mpc";
import { Card } from "../types/card";
import Alert from "react-bootstrap/esm/Alert";


interface ImageSettingsModalProps {
  site: Site;
  unit?: Unit;
  cards: Card[];
  onCardUpload: (settings: CardSettings, cards: Card[]) => void;
  onProjectUpload: (settings: Settings, cards: Card[]) => void;
  onClose: () => void;
}

interface ImageSettingsModalState {
  unit?: Unit;
  uploadProject: boolean;
  name?: string;
  cardStockCode?: string;
  printTypeCode?: string;
  finishCode?: string;
  packagingCode?: string;
}

export default class ImageSettingsModal extends React.Component<ImageSettingsModalProps, ImageSettingsModalState> {
  constructor(props: ImageSettingsModalProps) {
    super(props);

    const { site } = props;
    const unit = props.unit ?? unitData.find((it) => it.siteCodes.includes(site.code));
    this.state = {
      unit: unit,
      uploadProject: false,
      name: undefined,
      cardStockCode: cardStockData.find((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(site.code))?.code,
      printTypeCode: printTypeData.find((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(site.code))?.code,
      finishCode: finishData.find((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(site.code))?.code,
      packagingCode: packagingData.find((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(site.code))?.code,
    };
  }

  onCardUpload = (settings: CardSettings) => {
    this.props.onCardUpload(settings, this.props.cards);
  }

  onProjectUpload = (settings: Settings) => {
    this.props.onProjectUpload(settings, this.props.cards);
  }

  onClose = () => {
    this.props.onClose();
  }

  onUnitChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const unitCode = event.currentTarget.value;
    this.setState({
      unit: unitData.find((it) => it.code === unitCode),
    });
  }

  onCardStockChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({
      cardStockCode: event.currentTarget.value,
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
    const { site } = this.props;
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
      productWidth: unit.productWidth,
      productHeight: unit.productHeight,
      productPadding: unit.productPadding,
      padding: unit.padding,
      safe: unit.safe,
      unpick: unit.unpick,
      x: unit.x,
      y: unit.y,
      lappedType: unit.lappedType,
    };
  }

  getProjectSettings = (): Settings | undefined => {
    const { unit, name, cardStockCode, printTypeCode, finishCode, packagingCode } = this.state;
    if (unit === undefined || cardStockCode === undefined || printTypeCode === undefined || finishCode === undefined || packagingCode === undefined) {
      return;
    }

    return {
      url: window.location.origin,
      unit: unit.code,
      product: unit.productCode,
      frontDesign: unit.frontDesignCode,
      backDesign: unit.backDesignCode,
      name: name,
      cardStock: cardStockCode,
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
      productWidth: unit.productWidth,
      productHeight: unit.productHeight,
      productPadding: unit.productPadding,
      padding: unit.padding,
      safe: unit.safe,
      unpick: unit.unpick,
      x: unit.x,
      y: unit.y,
      lappedType: unit.lappedType,
    };
  }

  render() {
    const { cards, site } = this.props;
    const { unit, uploadProject, name, cardStockCode, printTypeCode, finishCode, packagingCode } = this.state;
    const cardSettings = this.getCardSettings();
    const projectSettings = this.getProjectSettings();
    const count = cards.reduce((value, it) => value + it.count, 0);
    const tooManyCards = unit ? count > unit.maxCards : false;

    return (
      <Modal show centered>
        <Modal.Header>Card Settings</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FloatingLabel controlId="floatingSelect1" label="Product">
              <Form.Select aria-label="Product" value={unit?.code} onChange={this.onUnitChange}>
                {unitData.filter((it) => it.siteCodes.includes(site.code)).map((it) => (
                  <option key={it.code} value={it.code}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            {unit && tooManyCards && (
              <Alert variant={uploadProject ? "danger" : "warning"} style={{ margin: 0 }}>
                You are trying to create a project with {count} cards but the max is {unit.maxCards}.
              </Alert>
            )}
            <Form.Check
              type='checkbox'
              label='Upload project?'
              checked={uploadProject}
              onChange={this.onUploadProjectChange}
            />
            {uploadProject && (
              <>
                <FloatingLabel controlId="floatingText" label="Project Name">
                  <Form.Control aria-label="ProjectName" value={name} onChange={this.onNameChange} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect2" label="Card Stock">
                  <Form.Select aria-label="Card Stock" value={cardStockCode} onChange={this.onCardStockChange}>
                    {cardStockData.filter((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(site.code)).map((it) => (
                      <option key={it.code} value={it.code}>{it.name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect3" label="Print Type">
                  <Form.Select aria-label="Print Type" value={printTypeCode} onChange={this.onPrintTypeChange}>
                    {printTypeData.filter((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(site.code)).map((it) => (
                      <option key={it.code} value={it.code}>{it.name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect4" label="Finish">
                  <Form.Select aria-label="Finish" value={finishCode} onChange={this.onFinishChange}>
                    {finishData.filter((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(site.code)).map((it) => (
                      <option key={it.code} value={it.code}>{it.name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect5" label="Packaging">
                  <Form.Select aria-label="Packaging" value={packagingCode} onChange={this.onPackagingChange}>
                    {packagingData.filter((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(site.code)).map((it) => (
                      <option key={it.code} value={it.code}>{it.name}</option>
                    ))}
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
            <Button variant="success" onClick={() => this.onProjectUpload(projectSettings!)} disabled={!projectSettings || tooManyCards}>Upload</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}