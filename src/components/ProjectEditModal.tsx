import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { ParsedProject } from "../types/project";
import ProjectCardList from "./ProjectCardList";

interface ProjectEditModalProps {
  index: number;
  item: ParsedProject;
  onSave: (index: number, item: ParsedProject) => void;
  onClose: () => void;
}

interface ProjectEditModalState {
  item: ParsedProject;
}

export default class ProjectEditModal extends React.Component<ProjectEditModalProps, ProjectEditModalState> {
  constructor(props: ProjectEditModalProps) {
    super(props);

    this.state = {
      item: props.item,
    }
  }

  onChange = (item: ParsedProject) => {
    this.setState({
      item,
    });
  }

  onSave = () => {
    const { index, onSave } = this.props;
    const { item } = this.state;

    onSave(index, item);
  }

  onClose = () => {
    this.props.onClose();
  }

  render() {
    const { item } = this.state;
    return (
      <Modal show centered onHide={this.onClose} scrollable dialogClassName="my-modal">
        <Modal.Header closeButton>Edit Project</Modal.Header>
        <Modal.Body>
          <ProjectCardList
            project={item}
            onChange={this.onChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.onClose}>Close</Button>
          <Button variant="success" onClick={this.onSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}