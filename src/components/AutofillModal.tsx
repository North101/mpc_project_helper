import React from "react";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { Card, CardSide } from "../types/card";
import AutofillCardList from "./AutofillCardList";
import autofillTypeBasic, { AutofillBasic } from "./AutofillTypeBasic";
import autofillTypeNone, { AutofillNone, AutofillType } from "./AutofillTypeNone";
import autofillTypeNorth101, { AutofillNorth101 } from "./AutofillTypeNorth101";

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
    autofillTypeNone,
    autofillTypeBasic,
    autofillTypeNorth101,
  ];

  constructor(props: AutofillModalProps) {
    super(props);

    this.state = {
      autofill: autofillTypeBasic,
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

    let autofillView: JSX.Element | null = null;
    if (autofill.id === 'none') {
      autofillView = <AutofillNone cardSides={cardSides} onChange={this.onChange} />
    } else if (autofill.id === 'basic') {
      autofillView = <AutofillBasic cardSides={cardSides} onChange={this.onChange} />
    } else if (autofill.id === 'north101') {
      autofillView = <AutofillNorth101 cardSides={cardSides} onChange={this.onChange} />
    }

    return (
      <Modal show centered fullscreen scrollable onHide={this.onClose} dialogClassName="my-modal">
        <Modal.Header closeButton>Autofill Options</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FloatingLabel label="Autotfill">
              <Form.Select aria-label="Autotfill" value={autofill.id} onChange={this.onAutofillChange}>
                {this.autofillOptions.map((it) => (
                  <option key={it.id} value={it.id}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            {autofillView}
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