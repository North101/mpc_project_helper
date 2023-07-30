import * as React from "react";
import { PencilSquare, Save } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { ParsedProject } from "../types/project";
import ProjectCardList from "./ProjectCardList";
import SaveProjectModal from "./SaveProjectModal";

interface ProjectEditModalProps {
  index: number;
  item: ParsedProject;
  onSave: (index: number, item: ParsedProject) => void;
  onClose: () => void;
}

interface ProjectEditModalState {
  item: ParsedProject;
  state: 'export' | null;
}

export default class ProjectEditModal extends React.Component<ProjectEditModalProps, ProjectEditModalState> {
  constructor(props: ProjectEditModalProps) {
    super(props);

    this.state = {
      item: props.item,
      state: null,
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

  onExport = () => {
    this.setState({
      state: 'export',
    });
  }

  onStateClear = () => {
    this.setState({
      state: null,
    });
  }

  onClose = () => {
    this.props.onClose();
  }

  render() {
    const { item, state } = this.state;
    return (
      <Modal show centered onHide={this.onClose} scrollable dialogClassName="my-modal">
        <Modal.Header closeButton style={{ alignItems: 'center', gap: 4 }}>
          <PencilSquare /> {item.name}
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ flex: 1 }} />
            <Button variant="outline-primary" onClick={this.onExport}>
              <Save /> Export
            </Button>
          </div>
          <ProjectCardList
            project={item}
            onChange={this.onChange}
          />
          {state === 'export' && <SaveProjectModal
            name={item.name}
            filename={item.name}
            project={item}
            onClose={this.onStateClear}
          />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.onClose}>Cancel</Button>
          <Button variant="success" onClick={this.onSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
