import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { GripVertical, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { ProjectCard } from "../types/project";

const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'row',
  userSelect: "none",
  padding: 16,
  opacity: isDragging ? 0.5 : 1,
  borderTopWidth: 1,
  borderRadius: 0,
  gap: 4,

  ...draggableStyle,
});

interface ProjectCardItemProps {
  index: number;
  item: ProjectCard;
  onChange: (index: number, item: ProjectCard) => void;
  onDelete: (index: number) => void;
}

export default class ProjectCardItem extends React.Component<ProjectCardItemProps> {
  onChange = (item: ProjectCard) => {
    const { index, onChange } = this.props;
    onChange(index, item);
  }

  onCountChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { item } = this.props;
    this.onChange({
      ...item,
      count: (event.currentTarget as HTMLInputElement).valueAsNumber,
    });
  }

  onDelete = () => {
    const { index, onDelete } = this.props;
    onDelete(index);
  }

  render() {
    const { index, item } = this.props;
    return (
      <Draggable draggableId={`${item.id}`} index={index}>
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
            <FloatingLabel controlId="floatingSelect1" label="Front" style={{ flex: 1 }}>
              <Form.Control aria-label="Front" value={item.front?.Name ?? item.front?.ID} disabled />
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect2" label="Back" style={{ flex: 1 }}>
              <Form.Control aria-label="Back" value={item.back?.Name ?? item.back?.ID} disabled />
            </FloatingLabel>
            <FloatingLabel controlId="floatingCount" label="Count" style={{ width: 80 }}>
              <Form.Control
                required
                type="number"
                placeholder="Count"
                value={item.count}
                onChange={this.onCountChange}
              />
            </FloatingLabel>
            <Button variant="outline-primary" onClick={this.onDelete}>
              <Trash />
            </Button>
          </ListGroup.Item>
        )}
      </Draggable>
    );
  }
}