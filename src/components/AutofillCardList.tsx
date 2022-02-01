import React from "react";
import { Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { Card } from "../types/card";
import { remove, replace } from "../util";

interface AutofillCardItemProps {
  index: number;
  item: Card;
  onChange: (index: number, item: Card) => void;
  onDelete: (index: number) => void;
}

class AutofillCardItem extends React.Component<AutofillCardItemProps> {
  onChange = (item: Card) => {
    const { index, onChange } = this.props;
    onChange(index, item);
  }

  onCountChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { item, onChange } = this.props;
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
      <ListGroup.Item
        key={index}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          padding: 16,
          borderTopWidth: 1,
          borderRadius: 0,
        }}
        as="li"
      >
        <div style={{
          alignSelf: 'center',
          textAlign: 'right',
          minWidth: 30,
          padding: 4,
        }}>{index + 1}</div>
        <FloatingLabel controlId="floatingSelect1" label="Front" style={{ flex: 1 }}>
          <Form.Control value={item.front?.file.name ?? ''} disabled />
        </FloatingLabel>
        <FloatingLabel controlId="floatingSelect2" label="Back" style={{ flex: 1 }}>
          <Form.Control value={item.back?.file.name ?? ''} disabled />
        </FloatingLabel>
        <FloatingLabel controlId="floatingCount" label="Count" style={{ width: 80 }}>
          <Form.Control
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
    );
  }
}

interface AutofillCardListProps {
  cards: Card[];
  onChange: (cards: Card[]) => void;
}

export default class AutofillCardList extends React.Component<AutofillCardListProps> {
  onItemChange = (index: number, item: Card) => {
    const { cards, onChange } = this.props;
    onChange(replace(cards, index, item));
  }

  onItemRemove = (index: number) => {
    const { cards, onChange } = this.props;
    onChange(remove(cards, index));
  }

  render() {
    const { cards } = this.props;
    return (
      <ListGroup as="ol" style={{ flex: 1 }}>
        {cards.map((card, index) => (
          <AutofillCardItem
            key={card.id}
            index={index}
            item={card}
            onChange={this.onItemChange}
            onDelete={this.onItemRemove}
          />
        ))}
      </ListGroup>
    )
  }
}