import * as React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Modal from "react-bootstrap/esm/Modal";
import { Project } from "../types/project";


interface SaveProjectModalProps {
  message?: string;
  value: Project;
  filename?: string;
  urls?: string[];
  onClose: () => void;
}

export default class SaveProjectModal extends React.Component<SaveProjectModalProps> {
  constructor(props: SaveProjectModalProps) {
    super(props)
  }

  onSave = async () => {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'project.json',
      types: [
        {
          description: "Project file",
          accept: {
            "application/json": [".json"],
          },
        },
      ],
    });
    const writable = await handle.createWritable();

    await writable.write(JSON.stringify(this.props.value));
    await writable.close();
  }

  render() {
    const { message, urls: urls, onClose } = this.props;

    return (
      <Modal show centered scrollable>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
            <div style={{ flex: '1 1 1px', overflowY: 'scroll', display: 'flex', flexDirection: 'column', gap: 4, }}>
              {message}
              <Button variant="success" onClick={this.onSave}>Save as Project</Button>
              {urls && <div>
                <br/>
                <p>Your project(s) were successfully uploaded</p>
                <Alert variant="warning">
                  <Alert.Heading>Warning</Alert.Heading>
                  <p>MPC Project Helper is reverse engineered and makes no guaranties that it is bug free or that {location.origin} will not make changes that will break it.</p>
                  <hr />
                  <p>Always check the uploaded project and its images before purchasing.</p>
                </Alert>
                <ButtonGroup className="d-flex button-group" vertical>
                  {urls.map((url, index) => <Button
                    key={index}
                    variant="link"
                    href={url}
                    target="_blank"
                    style={{ width: 'auto' }}
                  >
                    {`Project (${index + 1}/${urls.length})`}
                  </Button>)}
                </ButtonGroup>
              </div>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
