import React from "react";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Modal from "react-bootstrap/esm/Modal";
import { Card, CardListGroup, CardSide } from "../types/card";

interface AutofillType {
  id: string;
  name: string;
  description: string;
  process: (cardSides: CardSide[]) => Card[];
}

const noAutofill: AutofillType = {
  id: 'none',
  name: 'No Autofill',
  description: '',
  process: () => [],
}

const basicAutofill: AutofillType = {
  id: 'basic',
  name: 'Basic',
  description: '',
  process: (cardSides: CardSide[]) => {
    const re = /^(.+?(?:-x(\d+))?)(?:(\-front|\-back|a|b|\-1|\-2))\.(png|jpg)$/;

    const groups: {
      [key: string]: Card;
    } = {};
    for (const cardSide of cardSides) {
      const match = cardSide.file.name.match(re);
      console.log(match);
      if (!match) continue;

      const name = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      const side = match[3]?.replace('-', '');
      const card = groups[name] ??= {
        id: AutofillModal.cardId++,
        count,
      }
      if (['front', 'a', '1'].includes(side)) {
        card.front = cardSide;
      } else if (['back', 'b', '2'].includes(side)) {
        card.back = cardSide;
      } else {
        console.log(side);
      }
    }

    return Object.values(groups);
  },
}

const north101Autofill: AutofillType = {
  id: 'north101',
  name: 'North101 Autofill',
  description: '',
  process: (cardSides: CardSide[]) => {
    const re = /^(.+?)(\d+)?(?:(\-front|\-back|a|b|\-1|\-2))?\.(png|jpg)$/;

    const groups: {
      [key: string]: CardListGroup,
    } = {};
    for (const cardSide of cardSides) {
      const match = cardSide.file.name.match(re);
      console.log(match);
      if (!match) continue;

      const name = match[1];
      const index = parseInt(match[2]) || 0;
      const side = match[3]?.replace('-', '');

      const group = groups[name] ??= {
        key: name,
        items: [],
      };
      if (!index && (side === 'front' || side === 'back')) {
        group[side] = cardSide;
      } else {
        const card = group.items[index] ??= {
          id: AutofillModal.cardId++,
          count: 1,
        };
        if (['front', 'a', '1'].includes(side)) {
          card.front = cardSide;
        } else if (['back', 'b', '2'].includes(side)) {
          card.back = cardSide;
        } else {
          console.log(side);
        }
      }
    }
    console.log(groups);
    for (const group of Object.values(groups)) {
      const lastCardSide: {
        front?: CardSide;
        back?: CardSide;
      } = {};
      for (let i = group.items.length - 1; i >= 0; i--) {
        const card = group.items[i];
        if (!card) continue;

        for (const side of ['front', 'back'] as ('front' | 'back')[]) {
          lastCardSide[side] = card[side] ??= group[side] ?? lastCardSide[side];
        }
      }
    }

    return Object.values(groups).reduce<Card[]>((list, group) => {
      if (group.items.length === 0) {
        list.push({
          id: AutofillModal.cardId++,
          front: group.front,
          back: group.back,
          count: 1,
        });
      } else {
        const card = group.items[0];
        if (card) {
          list.push({
            ...card,
            count: card.count,
          });
        }

        let i = 1;
        let count = 0;
        while (i < group.items.length) {
          const card = group.items[i];
          count++;
          if (card) {
            list.push({
              ...card,
              count: count,
            });
            count = 0;
          }
          i++;
        }
      }
      return list;
    }, []);
  }
}

interface AutofillModalProps {
  cardSides: CardSide[];
  onAdd: (cardSides: CardSide[], cards: Card[]) => void;
  onClose: () => void;
}

interface AutofillModalState {
  autofill: AutofillType;
  cards: Card[];
}

export default class AutofillModal extends React.Component<AutofillModalProps, AutofillModalState> {
  static cardId = 0;

  autofillOptions = [
    noAutofill,
    basicAutofill,
    north101Autofill,
  ];

  constructor(props: AutofillModalProps) {
    super(props);

    this.state = {
      autofill: basicAutofill,
      cards: basicAutofill.process(props.cardSides),
    };
  }

  onAutofillChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { cardSides } = this.props;
    const autofill = this.autofillOptions.find((it) => it.id === event.currentTarget.value) ?? this.autofillOptions[0];

    this.setState({
      autofill,
      cards: autofill.process(cardSides),
    });
  }

  onAdd = () => {
    const { cardSides, onAdd } = this.props;
    const { cards } = this.state;

    onAdd(cardSides, cards);
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  render() {
    const { cardSides } = this.props;
    const { autofill, cards } = this.state;
    return (
      <Modal show centered fullscreen scrollable onHide={this.onClose} dialogClassName="my-modal">
        <Modal.Header closeButton>Autofill Options</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FloatingLabel controlId="floatingSelect1" label="Autotfill">
              <Form.Select aria-label="Autotfill" value={autofill.id} onChange={this.onAutofillChange}>
                {this.autofillOptions.map((it) => (
                  <option key={it.id} value={it.id}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <Form.Text>
              {autofill.description}
            </Form.Text>
            <ListGroup as="ol">
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
                    <Form.Control value={card.front?.name} disabled />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect2" label="Back" style={{ flex: 1 }}>
                    <Form.Control value={card.back?.name} disabled />
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onClose}>Close</Button>
          <Button onClick={this.onAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}