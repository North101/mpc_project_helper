import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import ProgressBar from "react-bootstrap/esm/ProgressBar";

export default class ProgressModal extends React.Component<{ value: number; maxValue: number; onClose: () => void; }> {
  render() {
    return (
      <Modal show centered>
        <Modal.Header>Uploading...</Modal.Header>
        <Modal.Body>
          <ProgressBar now={this.props.value} max={this.props.maxValue} />
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            {this.props.value} / {this.props.maxValue}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}