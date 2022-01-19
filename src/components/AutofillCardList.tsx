import React from "react";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { Card } from "../types/card";

interface AutofillCardListProps {
  cards: Card[];
}

export default class AutofillCardList extends React.Component<AutofillCardListProps> {
  render() {
    const { cards } = this.props;
    return (
      <ListGroup as="ol" style={{ flex: 1 }}>
        {cards.map((card, index) => (
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
              <Form.Control value={card.front?.file.name ?? ''} disabled />
            </FloatingLabel>
            <FloatingLabel controlId="floatingSelect2" label="Back" style={{ flex: 1 }}>
              <Form.Control value={card.back?.file.name ?? ''} disabled />
            </FloatingLabel>
            <FloatingLabel controlId="floatingCount" label="Count" style={{ width: 80 }}>
              <Form.Control
                type="number"
                placeholder="Count"
                value={card.count}
                disabled
              />
            </FloatingLabel>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )
  }
}