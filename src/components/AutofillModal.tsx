import React from "react";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { Card, CardSide } from "../types/card";
import AutofillCardList from "./AutofillCardList";
import AutofillNorth101 from "./AutofilltTypeNorth101";
import AutofillBasic from "./AutofillTypeBasic";
import AutofillNone from "./AutofillTypeNone";

interface AutofillType {
  id: string;
  name: string;
  description: string;
  view: typeof AutofillNone;
}

const noAutofill: AutofillType = {
  id: 'none',
  name: 'No Autofill',
  description: '',
  view: AutofillNone,
}

const basicAutofill: AutofillType = {
  id: 'basic',
  name: 'Basic',
  description: '',
  view: AutofillBasic,
}

const north101Autofill: AutofillType = {
  id: 'north101',
  name: 'North101\'s Autofill',
  description: '',
  view: AutofillNorth101,
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
      cards: [],
    };
  }

  onAutofillChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const autofill = this.autofillOptions.find((it) => it.id === event.currentTarget.value);
    if (autofill === undefined) return;

    this.setState({
      autofill,
    });
  }

  onChange = (cards: Card[]) => {
    this.setState({
      cards,
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
            <Form.Text>{autofill.description}</Form.Text>
            <autofill.view cardSides={cardSides} onChange={this.onChange} />
            <AutofillCardList cards={cards} />
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