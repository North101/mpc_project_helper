import * as React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, PencilSquare, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { Site } from "../types/mpc";
import { ParsedProject } from "../types/project";

const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  display: 'flex',
  userSelect: "none",
  padding: 16,
  opacity: isDragging ? 0.5 : 1,
  borderTopWidth: 1,
  borderRadius: 0,
  gap: 4,

  ...draggableStyle,
});

interface ProjectItemProps {
  site: Site;
  index: number;
  item: ParsedProject;
  onEdit: (index: number, item: ParsedProject) => void;
  onDelete: (index: number) => void;
}

export default class ProjectItem extends React.Component<ProjectItemProps> {
  onEdit = () => {
    const { index, item, onEdit } = this.props;
    onEdit(index, item);
  }
  onDelete = () => {
    const { index, onDelete } = this.props;
    onDelete(index);
  }

  render() {
    const { site, index, item } = this.props;
    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <ListGroup.Item
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )}
            as="li"
          >
            <GripVertical style={{ alignSelf: 'center' }} />
            <div style={{
              alignSelf: 'center',
              textAlign: 'right',
              minWidth: 30,
              padding: 4,
            }}>{index + 1}</div>
            <FloatingLabel controlId="floatingSelect1" label="Filename" style={{ flex: 1 }}>
              <Form.Control aria-label="Filename" value={item.name} disabled />
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect2" label="Product" style={{ flex: 1 }}>
              <Form.Control aria-label="Product" value={item.unit.name} disabled />
            </FloatingLabel>
            <FloatingLabel controlId="floatingCount" label="Count" style={{ width: 80 }}>
              <Form.Control
                required
                type="number"
                placeholder="Count"
                value={item.cards.reduce((value, card) => value + card.count, 0)}
                disabled
              />
            </FloatingLabel>
            <Button variant="outline-primary" onClick={this.onEdit}>
              <PencilSquare />
            </Button>
            <Button variant="outline-primary" onClick={this.onDelete}>
              <Trash />
            </Button>
          </ListGroup.Item>
        )}
      </Draggable>
    );
  }
}
