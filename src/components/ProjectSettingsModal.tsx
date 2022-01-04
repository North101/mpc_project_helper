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
import { Settings, UploadedImage } from "../api/mpc_api";
import { Unit } from "./ProjectTab";


interface ProjectSettingsModalProps {
  unit: Unit;
  cards: UploadedImage[],
  onUpload: (settings: Settings, cards: UploadedImage[]) => void;
  onClose: () => void;
}

interface ProjectSettingsModalState {
  cardStockCode?: string;
  printTypeCode?: string;
  finishCode?: string;
  packagingCode?: string;
}

export default class ProjectSettingsModal extends React.Component<ProjectSettingsModalProps, ProjectSettingsModalState> {
  constructor(props: ProjectSettingsModalProps) {
    super(props);

    const { unit } = props;
    this.state = {
      cardStockCode: cardStockData.filter((it) => it.product_code === unit.product_code)[0]?.code,
      printTypeCode: printTypeData.filter((it) => it.product_code === unit.product_code)[0]?.code,
      finishCode: finishData.filter((it) => it.product_code === unit.product_code)[0]?.code,
      packagingCode: packagingData.filter((it) => it.product_code === unit.product_code)[0]?.code,
    };
  }

  onUpload = () => {
    const { unit, cards } = this.props;
    const { printTypeCode, packagingCode, finishCode, cardStockCode } = this.state;
    this.props.onUpload({
      url: location.origin,
      unit: unit.code,
      product: unit.product_code,
      frontDesign: unit.front_design_code,
      backDesign: unit.back_design_code,
      cardStock: cardStockCode!,
      printType: printTypeCode!,
      finish: finishCode!,
      packaging: packagingCode!,
    }, cards);
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


  render() {
    const { unit } = this.props;
    const { cardStockCode, printTypeCode, finishCode, packagingCode } = this.state;

    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Project Settings</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
            <FloatingLabel controlId="floatingSelect1" label="Product">
              <Form.Select aria-label="Product" value={unit.code} disabled={true}>
                <option>Select Product</option>
                {unitData.filter((it) => it.site_code === unit.site_code).map((it) => (
                  <option value={it.code}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect2" label="Card Stock">
              <Form.Select aria-label="Card Stock" value={cardStockCode} onChange={this.onCardStockChange}>
                <option>Select Card Stock</option>
                {cardStockData.filter((it) => it.product_code === unit.product_code).map((it) => (
                  <option value={it.code}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect3" label="Print Type">
              <Form.Select aria-label="Print Type" value={printTypeCode} onChange={this.onPrintTypeChange}>
                <option>Select Print Type</option>
                {printTypeData.filter((it) => it.product_code === unit.product_code).map((it) => (
                  <option value={it.code}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect4" label="Finish">
              <Form.Select aria-label="Finish" value={finishCode} onChange={this.onFinishChange}>
                <option>Select Finish</option>
                {finishData.filter((it) => it.product_code === unit.product_code).map((it) => (
                  <option value={it.code}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect5" label="Packaging">
              <Form.Select aria-label="Packaging" value={packagingCode} onChange={this.onPackagingChange}>
                <option>Select Packaging</option>
                {packagingData.filter((it) => it.product_code === unit.product_code).map((it) => (
                  <option value={it.code}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onClose}>Close</Button>
          <Button
            variant="success"
            onClick={this.onUpload}
            disabled={cardStockCode === undefined || !printTypeCode === undefined || !finishCode === undefined || !packagingCode === undefined
            }>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}