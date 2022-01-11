import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { GripVertical, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { Card, CardSide } from "../types/card";


const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 4,
  userSelect: "none",
  padding: 16,
  opacity: isDragging ? 0.5 : 1,
  borderTopWidth: 1,
  borderRadius: 0,

  ...draggableStyle,
});

interface ImageItemProps {
  index: number;
  item: Card;
  files: CardSide[];
  onChange: (index: number, item: Card) => void;
  onDelete: (index: number) => void;
}

export default class ImageItem extends React.Component<ImageItemProps> {
  onChange = (item: Card) => {
    const { index, onChange } = this.props;
    onChange(index, item);
  }

  onFrontChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { item, files } = this.props;
    this.onChange({
      ...item,
      front: files.find((file) => `${file.id}` === event.currentTarget.value),
    });
  }

  onBackChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { item, files } = this.props;
    this.onChange({
      ...item,
      back: files.find((file) => `${file.id}` === event.currentTarget.value),
    });
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
    const { index, item, files } = this.props;
    return (
      <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
        {(provided, snapshot) => (
          <ListGroup.Item
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )}
          >
            <GripVertical style={{ alignSelf: 'center' }} />
            <div style={{
              alignSelf: 'center',
              textAlign: 'right',
              minWidth: 30,
              padding: 4,
            }}>{index + 1}</div>
            <FloatingLabel controlId="floatingSelect1" label="Front" style={{ flex: 1 }}>
              <Form.Select aria-label="Front" value={item.front?.id} onChange={this.onFrontChange}>
                <option key={""} value="">Empty</option>
                {files.map((file) => <option key={file.id} value={file.id}>{file.name}</option>)}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect2" label="Back" style={{ flex: 1 }}>
              <Form.Select aria-label="Back" value={item.back?.id} onChange={this.onBackChange}>
                <option key={""} value="">Empty</option>
                {files.map((file) => <option key={file.id} value={file.id}>{file.name}</option>)}
              </Form.Select>
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