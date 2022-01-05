import * as React from "react";
import { CodeSlash } from "react-bootstrap-icons";
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
import { Card } from "./ImageTab";
import { Unit } from "./ProjectTab";


interface ImageSettingsModalProps {
  siteCode: string;
  cards: Card[];
  onCardUpload: (settings: CardSettings, cards: Card[]) => void;
  onProjectUpload: (settings: Settings, cards: Card[]) => void;
  onClose: () => void;
}

interface ImageSettingsModalState {
  unit?: Unit;
  uploadProject: boolean;
  cardStockCode?: string;
  printTypeCode?: string;
  finishCode?: string;
  packagingCode?: string;
}

export default class ImageSettingsModal extends React.Component<ImageSettingsModalProps, ImageSettingsModalState> {
  constructor(props: ImageSettingsModalProps) {
    super(props);

    const { siteCode } = props;
    const unit = unitData.find((it) => it.siteCodes.includes(siteCode));
    this.state = {
      unit: unit,
      uploadProject: false,
      cardStockCode: cardStockData.find((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(siteCode))?.code,
      printTypeCode: printTypeData.find((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(siteCode))?.code,
      finishCode: finishData.find((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(siteCode))?.code,
      packagingCode: packagingData.find((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(siteCode))?.code,
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

  getCardSettings = (): CardSettings | undefined => {
    const { unit } = this.state;
    if (!unit) return;

    return {
      url: location.origin,
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
    const { unit, cardStockCode, printTypeCode, finishCode, packagingCode } = this.state;
    if (unit === undefined || cardStockCode === undefined || printTypeCode === undefined || finishCode === undefined || packagingCode === undefined) {
      return;
    }

    return {
      url: location.origin,
      unit: unit.code,
      product: unit.productCode,
      frontDesign: unit.frontDesignCode,
      backDesign: unit.backDesignCode,
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
    };
  }

  render() {
    const { siteCode } = this.props;
    const { unit, uploadProject, cardStockCode, printTypeCode, finishCode, packagingCode } = this.state;
    const cardSettings = this.getCardSettings();
    const projectSettings = this.getProjectSettings();

    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Card Settings</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
            <FloatingLabel controlId="floatingSelect1" label="Product">
              <Form.Select aria-label="Product" value={unit?.code} onChange={this.onUnitChange}>
                {unitData.filter((it) => it.siteCodes.includes(siteCode)).map((it) => (
                  <option key={it.code} value={it.code}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <Form.Check
              type='checkbox'
              label='Upload project?'
              checked={uploadProject}
              onChange={this.onUploadProjectChange}
            />
            {uploadProject && (
              <>
                <FloatingLabel controlId="floatingSelect2" label="Card Stock">
                  <Form.Select aria-label="Card Stock" value={cardStockCode} onChange={this.onCardStockChange}>
                    {cardStockData.filter((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(siteCode)).map((it) => (
                      <option key={it.code} value={it.code}>{it.name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect3" label="Print Type">
                  <Form.Select aria-label="Print Type" value={printTypeCode} onChange={this.onPrintTypeChange}>
                    {printTypeData.filter((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(siteCode)).map((it) => (
                      <option key={it.code} value={it.code}>{it.name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect4" label="Finish">
                  <Form.Select aria-label="Finish" value={finishCode} onChange={this.onFinishChange}>
                    {finishData.filter((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(siteCode)).map((it) => (
                      <option key={it.code} value={it.code}>{it.name}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect5" label="Packaging">
                  <Form.Select aria-label="Packaging" value={packagingCode} onChange={this.onPackagingChange}>
                    {packagingData.filter((it) => unit && it.productCodes.includes(unit.productCode) && it.siteCodes.includes(siteCode)).map((it) => (
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
            <Button variant="success" onClick={() => this.onProjectUpload(projectSettings!)} disabled={!projectSettings}>Upload</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}