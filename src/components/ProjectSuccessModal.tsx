import * as React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";


export default class ProjectSuccessModal extends React.Component<{ value: string; onClose: () => void; }> {
  render() {
    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          Your project was successfully uploaded.
          <Alert variant="warning">
            Warning: MPC Helper is reverse engineered and makes not guaranties that it is bug free or that {location.origin} will make changes that break things.
            Always check the uploaded project and its images before purchasing.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>Close</Button>
          <Button variant="success" href={this.props.value}>Open</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}