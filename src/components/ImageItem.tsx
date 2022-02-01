import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { CheckLg, ExclamationTriangle, GripVertical, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import ListGroup from "react-bootstrap/esm/ListGroup";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { Card, CardSide } from "../types/card";
import { Unit } from "../types/mpc";

interface ImageDetailsProps {
  cardSide?: CardSide;
  unit?: Unit;
  size: number;
  goodColor: string;
  badColor: string;
}

const ImageDetails = ({ cardSide, unit, size, goodColor, badColor }: ImageDetailsProps) => {
  if (!cardSide || !unit) return null;

  const { info } = cardSide;
  const width = info.width >= (unit.width * unit.dpi / 100);
  const height = info.height >= (unit.height * unit.dpi / 100);
  const orientation = (unit.width > unit.height) == (info.width > info.height);

  return <OverlayTrigger
    placement='bottom'
    overlay={
      <Tooltip>
        Width: <span style={{ color: !width ? badColor : undefined }}>{info.width}</span> (min: {(unit.width * unit.dpi / 100)})<br />
        Height: <span style={{ color: !height ? badColor : undefined }}>{info.height}</span> (min: {(unit.height * unit.dpi / 100)})<br />
        Orientation: <span style={{ color: !orientation ? badColor : undefined }}>{info.width > info.height ? 'Landscape' : 'Portrait'}</span> ({unit.width > unit.height ? 'Landscape' : 'Portrait'})
      </Tooltip>
    }
  >
    {width && height && orientation ? (
      <CheckLg size={size} color={goodColor} />
    ) : (
      <ExclamationTriangle size={size} color={badColor} />
    )}
  </OverlayTrigger>;
}


const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 4,
  userSelect: "none",
  padding: 16,
  opacity: isDragging ? 0.5 : 1,
  borderTopWidth: 1,
  borderRadius: 0,
  alignItems: 'center',

  ...draggableStyle,
});

interface ImageItemProps {
  index: number;
  item: Card;
  files: CardSide[];
  unit?: Unit;
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
    const { index, item, files, unit } = this.props;
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
                {files.map((cardSide) => <option key={cardSide.id} value={cardSide.id}>{cardSide.file.name}</option>)}
              </Form.Select>
            </FloatingLabel>
            <ImageDetails cardSide={item.front} unit={unit} size={24} goodColor="green" badColor="red" />
            <FloatingLabel controlId="floatingSelect2" label="Back" style={{ flex: 1 }}>
              <Form.Select aria-label="Back" value={item.back?.id} onChange={this.onBackChange}>
                <option key={""} value="">Empty</option>
                {files.map((cardSide) => <option key={cardSide.id} value={cardSide.id}>{cardSide.file.name}</option>)}
              </Form.Select>
            </FloatingLabel>
            <ImageDetails cardSide={item.back} unit={unit} size={24} goodColor="green" badColor="red" />
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