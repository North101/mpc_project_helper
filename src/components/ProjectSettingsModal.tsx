import * as React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import cardStockData from "../api/data/card_stock.json";
import finishData from "../api/data/finish.json";
import packagingData from "../api/data/packaging.json";
import printTypeData from "../api/data/print_type.json";
import unitData from "../api/data/unit.curated.json";
import { Settings, UploadedImage } from "../api/mpc_api";
import { Site, Unit } from "../types/mpc";

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
  cardStockCode?: string;
  printTypeCode?: string;
  finishCode?: string;
  packagingCode?: string;
}

export default class ProjectSettingsModal extends React.Component<ProjectSettingsModalProps, ProjectSettingsModalState> {
  constructor(props: ProjectSettingsModalProps) {
    super(props);

    const { site, unit, name } = props;
    this.state = {
      name: name?.substring(0, 32),
      cardStockCode: cardStockData.find((it) => it.productCodes.includes(unit.productCode) && site.code in it.name)?.code,
      printTypeCode: printTypeData.find((it) => it.productCodes.includes(unit.productCode) && site.code in it.name)?.code,
      finishCode: finishData.find((it) => it.productCodes.includes(unit.productCode) && site.code in it.name)?.code,
      packagingCode: packagingData.find((it) => it.productCodes.includes(unit.productCode) && site.code in it.name)?.code,
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

  onNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      name: event.currentTarget.value.substring(0, 32),
    });
  }

  getSettings = (): Settings | undefined => {
    const { name, cardStockCode, printTypeCode, finishCode, packagingCode } = this.state;
    if (cardStockCode === undefined || printTypeCode === undefined || finishCode === undefined || packagingCode === undefined) {
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
      maxCards: unit.maxCards,
    };
  }

  render() {
    const { site, unit, cards } = this.props;
    const { name, cardStockCode, printTypeCode, finishCode, packagingCode } = this.state;
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
                {unitData.filter((it) => site.code in it.name).map((it) => (
                  <option key={it.code} value={it.code}>{(it.name as any)[site.code]}</option>
                ))}
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
              <Form.Select aria-label="Card Stock" value={cardStockCode} onChange={this.onCardStockChange}>
                {cardStockData.filter((it) => it.productCodes.includes(unit.productCode) && site.code in it.name).map((it) => (
                  <option key={it.code} value={it.code}>{(it.name as any)[site.code]}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect3" label="Print Type">
              <Form.Select aria-label="Print Type" value={printTypeCode} onChange={this.onPrintTypeChange}>
                {printTypeData.filter((it) => it.productCodes.includes(unit.productCode) && site.code in it.name).map((it) => (
                  <option key={it.code} value={it.code}>{(it.name as any)[site.code]}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect4" label="Finish">
              <Form.Select aria-label="Finish" value={finishCode} onChange={this.onFinishChange}>
                {finishData.filter((it) => it.productCodes.includes(unit.productCode) && site.code in it.name).map((it) => (
                  <option key={it.code} value={it.code}>{(it.name as any)[site.code]}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect5" label="Packaging">
              <Form.Select aria-label="Packaging" value={packagingCode} onChange={this.onPackagingChange}>
                {packagingData.filter((it) => it.productCodes.includes(unit.productCode) && site.code in it.name).map((it) => (
                  <option key={it.code} value={it.code}>{(it.name as any)[site.code]}</option>
                ))}
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
