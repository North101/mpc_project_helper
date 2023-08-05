import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import ProjectLinkGroup from "./ProjectLinkGroup";
import { Project } from "../types/project";
import SaveProjectButton from "./SaveProjectButton";


interface ProjectSuccessModalProps {
  project: Project;
  urls: string[];
  onClose: () => void;
}


export default class ProjectSuccessModal extends React.Component<ProjectSuccessModalProps> {
  render() {
    const { project, urls } = this.props;
    return (
      <Modal show centered scrollable>
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          <div style={{ overflowY: 'scroll', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SaveProjectButton project={project} />
            <ProjectLinkGroup urls={urls} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
