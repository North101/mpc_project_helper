import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { Project } from "./ProjectTab";


interface ImageSuccessModalProps {
  value: Project;
  onClose: () => void;
}

interface ImageSuccessModalState {
  filename: string;
}

export default class ImageSuccessModal extends React.Component<ImageSuccessModalProps, ImageSuccessModalState> {
  constructor(props: ImageSuccessModalProps) {
    super(props)

    this.state = {
      filename: 'project.txt',
    }
  }

  onFilenameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      filename: event.currentTarget.value,
    });
  }

  onSave = () => {
    const anchor = document.createElement('a');
    anchor.href = `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(this.props.value))}`;
    anchor.download = this.state.filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    this.props.onClose();
  }

  render() {
    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 4,
          }}>
            Your images were successfully uploaded
            <Form.Control
              required
              type="text"
              placeholder="Filename"
              value={this.state.filename}
              onChange={this.onFilenameChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>Close</Button>
          <Button variant="success" onClick={this.onSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}