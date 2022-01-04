import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import unitData from "../api/data/unit.json";
import { CardSettings } from "../api/mpc_api";
import { Unit } from "./ProjectTab";


interface ImageSettingsModalProps {
  siteCode: string;
  onUpload: (settings: CardSettings) => void;
  onClose: () => void;
}

interface ImageSettingsModalState {
  unit?: Unit;
}

export default class ImageSettingsModal extends React.Component<ImageSettingsModalProps, ImageSettingsModalState> {
  constructor(props: ImageSettingsModalProps) {
    super(props);

    this.state = {
      unit: unitData.filter((it) => it.site_code === props.siteCode)[0],
    };
  }

  onUpload = (settings: CardSettings) => {
    this.props.onUpload(settings);
  }

  onClose = () => {
    this.props.onClose();
  }

  onChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const unitCode = event.currentTarget.value;
    this.setState({
      unit: unitData.find((it) => it.code === unitCode),
    });
  }

  getSettings = () => {
    const { unit } = this.state;
    if (!unit) return;

    return {
      url: location.origin,
      unit: unit.code,
      product: unit.product_code,
      frontDesign: unit.front_design_code,
      backDesign: unit.back_design_code!,
    };
  }

  render() {
    const { siteCode } = this.props;
    const { unit } = this.state;
    const settings = this.getSettings();

    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Card Settings</Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingSelect1" label="Product">
            <Form.Select aria-label="Product" value={unit?.code} onChange={this.onChange}>
              <option>Select Product</option>
              {unitData.filter((it) => it.site_code === siteCode).map((it) => (
                <option value={it.code}>{it.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onClose}>Close</Button>
          <Button variant="success" onClick={() => this.onUpload(settings!)} disabled={!settings}>Upload</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}