import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";


export default class ProjectSuccessModal extends React.Component<{ value: string; onClose: () => void; }> {
  render() {
    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          Your project was successfully uploaded
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>Close</Button>
          <Button variant="success" href={this.props.value}>Open</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}