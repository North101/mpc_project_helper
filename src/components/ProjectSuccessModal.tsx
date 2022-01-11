import * as React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";


export default class ProjectSuccessModal extends React.Component<{ value: string; onClose: () => void; }> {
  render() {
    return (
      <Modal show centered>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          <p>Your project was successfully uploaded.</p>
          <Alert variant="warning">
            <Alert.Heading>Warning</Alert.Heading>
            <p>MPC Project Helper is reverse engineered and makes no guaranties that it is bug free or that {location.origin} will not make changes that will break it.</p>
            <hr />
            <p>Always check the uploaded project and its images before purchasing.</p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>Close</Button>
          <Button variant="success" href={this.props.value} target="_blank">Open</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}