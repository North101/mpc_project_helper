import React from "react";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import unitData from "../api/data/unit.json";
import { Card } from "../types/card";
import { Site, Unit } from "../types/mpc";
import CardPreview from "./CardPreview";


interface CardPreviewModalProps {
  site: Site;
  unit?: Unit;
  cards: Card[];
  onClose: () => void;
}

interface CardPreviewModalState {
  unit?: Unit;
}

export default class CardPreviewModal extends React.Component<CardPreviewModalProps, CardPreviewModalState> {
  constructor(props: CardPreviewModalProps) {
    super(props);

    const { unit, site } = props;
    this.state = {
      unit: unit ?? unitData.find((it) => it.siteCodes.includes(site.code)),
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
    const { site, cards } = this.props;
    const { unit } = this.state;

    return (
      <Modal show centered onHide={this.onClose} scrollable dialogClassName="my-modal">
        <Modal.Header closeButton>Card Preview</Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 1px', overflowY: 'scroll' }}>
            <FloatingLabel controlId="floatingSelect1" label="Product">
              <Form.Select aria-label="Product" value={unit?.code} onChange={this.onUnitChange}>
                {unitData.filter((it) => it.siteCodes.includes(site.code)).map((it) => (
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