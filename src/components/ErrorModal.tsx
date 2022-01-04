import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";

export default class ErrorModal extends React.Component<{ value: any; onClose: () => void; }> {
  render() {
    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Error</Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>
          {this.props.value}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}