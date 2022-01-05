import React from "react";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import unitData from "../api/data/unit.json";
import CardPreview from "./CardPreview";
import { Card } from "./ImageTab";
import { Unit } from "./ProjectTab";


interface CardPreviewModalProps {
  siteCode: string;
  cards: Card[];
  onClose: () => void;
}

interface CardPreviewModalState {
  unit?: Unit;
}

export default class CardPreviewModal extends React.Component<CardPreviewModalProps, CardPreviewModalState> {
  constructor(props: CardPreviewModalProps) {
    super(props);

    const { siteCode } = props;
    this.state = {
      unit: unitData.find((it) => it.siteCodes.includes(siteCode)),
    }
  }

  onUnitChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const unitCode = event.currentTarget.value;
    this.setState({
      unit: unitData.find((it) => it.code === unitCode),
    });
  }

  onClose = () => {
    this.props.onClose();
  }

  render() {
    const { siteCode, cards } = this.props;
    const { unit } = this.state;

    return (
      <Modal show={true} centered={true} onHide={this.onClose} scrollable dialogClassName="my-modal">
        <Modal.Header closeButton>Card Preview</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FloatingLabel controlId="floatingSelect1" label="Product">
              <Form.Select aria-label="Product" value={unit?.code} onChange={this.onUnitChange}>
                {unitData.filter((it) => it.siteCodes.includes(siteCode)).map((it) => (
                  <option key={it.code} value={it.code}>{it.name}</option>
                ))}
              </Form.Select>
            </FloatingLabel>
            {unit && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {cards.reduce<Card[]>((data, card) => {
                  for (let i = 0; i < card.count; i++) {
                    data.push(card);
                  }
                  return data;
                }, []).map((it) => <CardPreview height={unit.height} width={unit.width} card={it} />)}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}