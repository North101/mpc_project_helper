import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import Spinner from "react-bootstrap/esm/Spinner";

export default class LoadingModal extends React.Component<{ onClose: () => void; }> {
  render() {
    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Uploading...</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
            <Spinner animation="border" role="status" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}