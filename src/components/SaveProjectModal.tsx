import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { Project } from "../types/project";
import ProjectLinkGroup from "./ProjectLinkGroup";
import SaveProjectButton from "./SaveProjectButton";


interface SaveProjectModalProps {
  message?: string;
  name?: string;
  project: Project;
  filename?: string;
  urls?: string[];
  onLoadProject?: (name: string|undefined, value: Project) => void;
  onClose: () => void;
}

export default class SaveProjectModal extends React.Component<SaveProjectModalProps> {
  constructor(props: SaveProjectModalProps) {
    super(props)
  }

  render() {
    const { name, project, message, urls, onLoadProject, onClose } = this.props;

    return (
      <Modal show centered scrollable>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
            <div style={{ flex: '1 1 1px', overflowY: 'scroll', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {message}
              <SaveProjectButton project={project}/>
              {urls && <div>
                <br/>
                <ProjectLinkGroup urls={urls}/>
              </div>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {onLoadProject && <Button variant="secondary" onClick={() => {
            onLoadProject(name, project);
            onClose();
          }}>Load Project</Button>}
          <Button variant="danger" onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
