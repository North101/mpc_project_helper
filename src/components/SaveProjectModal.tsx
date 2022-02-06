import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { Project } from "../types/project";


interface SaveProjectModalProps {
  message?: string;
  value: Project;
  filename?: string;
  url?: string;
  onClose: () => void;
}

interface SaveProjectModalState {
  filename: string;
}

export default class SaveProjectModal extends React.Component<SaveProjectModalProps, SaveProjectModalState> {
  constructor(props: SaveProjectModalProps) {
    super(props)

    this.state = {
      filename: props.filename ?? 'project.txt',
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
  }

  render() {
    const { message, url, onClose } = this.props;
    const { filename } = this.state;
  
    return (
      <Modal show centered>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            {message}
            <Form.Control
              required
              type="text"
              placeholder="Filename"
              value={filename}
              onChange={this.onFilenameChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onClose}>Close</Button>
          <Button variant="success" onClick={this.onSave}>Save</Button>
          {url && (
            <Button variant="success" href={url} target="_blank">Open</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}