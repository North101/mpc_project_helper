import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { Project } from "./ProjectTab";


export default class ImageSuccessModal extends React.Component<{ value: Project; onClose: () => void; }> {
  onSave = () => {
    chrome.runtime.sendMessage({
      message: 'download',
      value: this.props.value,
    });
  }

  render() {
    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          Your images were successfully uploaded
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary"onClick={this.props.onClose}>Close</Button>
          <Button variant="success" onClick={this.onSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}