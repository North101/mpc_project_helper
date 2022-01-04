import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import { Card, CardSide } from "./ImageTab";


const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  userSelect: "none",
  padding: 8,
  opacity: isDragging ? 0.5 : 1,

  ...draggableStyle
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
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )}
          >
            <div style={{ display: 'flex', }}>
              <div style={{
                alignSelf: 'center',
                textAlign: 'right',
                width: 30,
                padding: 4,
              }}>{index + 1}</div>
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: 4,
                rowGap: 4,
              }}>
                <FloatingLabel controlId="floatingSelect1" label="Front">
                  <Form.Select aria-label="Front" value={item.front?.id} onChange={this.onFrontChange}>
                    <option>Empty</option>
                    {files.map((file) => <option value={file.id}>{file.name}</option>)}
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="floatingSelect2" label="Back">
                  <Form.Select aria-label="Back" value={item.back?.id} onChange={this.onBackChange}>
                    <option>Empty</option>
                    {files.map((file) => <option value={file.id}>{file.name}</option>)}
                  </Form.Select>
                </FloatingLabel>
              </div>
              <div style={{
                alignSelf: 'stretch',
                width: 80,
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                rowGap: 4,
              }}>
                <FloatingLabel controlId="floatingCount" label="Count" style={{ flex: 1 }}>
                  <Form.Control
                    required
                    type="number"
                    placeholder="Count"
                    defaultValue={item.count}
                    onChange={this.onCountChange}
                  />
                </FloatingLabel>
                <Button variant="outline-primary" style={{ flex: 1 }} onClick={this.onDelete}>
                  <Trash />
                </Button>
              </div>
            </div>
            <hr className="solid" />
          </div>
        )}
      </Draggable>
    );
  }
}