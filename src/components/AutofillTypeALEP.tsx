import React from "react";
import Accordion from "react-bootstrap/esm/Accordion";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import { Card } from "../types/card";
import { AutofillNone, AutofillNoneProps, AutofillType } from "./AutofillTypeNone";

const sides: { [key: string]: 'front' | 'back'; } = {
  '1': 'front',
  '2': 'back',
}

const authenticityData = [
  {
    id: 'o',
    name: 'Official',
  },
  {
    id: 'u',
    name: 'Unofficial',
  },
];

interface AutofillALePState {
  backAuthenticity: typeof authenticityData[number];
}

export class AutofillALeP extends AutofillNone<AutofillALePState> {
  cardMatcher = /^(.+\-)(?:(1|2)(u|o))\.(png|jpg)$/;

  constructor(props: AutofillNoneProps) {
    super(props);

    this.state = {
      backAuthenticity: authenticityData[1],
    };
  }

  onChange = () => {
    const { onChange } = this.props;
    onChange(this.process());
  }

  onBackAuthenticityChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const backAuthenticity = authenticityData.find((it) => `${it.id}` === event.currentTarget.value);
    if (!backAuthenticity) return;

    this.setState({
      backAuthenticity,
    }, () => this.onChange());
  }

  componentDidMount() {
    this.onChange();
  }

  process = () => {
    const { cardSides } = this.props;
    const { backAuthenticity } = this.state;
    console.log(backAuthenticity);

    const groups: {
      [key: string]: Card;
    } = {};
    for (const cardSide of cardSides) {
      const match = cardSide.file.name.match(this.cardMatcher);
      if (!match) continue;

      const name = match[1];
      const side = sides[match[2].toLowerCase()];
      const authenticityId = match[3].toLowerCase();
      if (side === 'back' && backAuthenticity.id !== authenticityId) continue;
  
      const card = groups[name] ?? {
        id: AutofillNone.cardId++,
        count: 1,
      }
      if (side === 'front') {
        card.front = cardSide;
      } else if (side === 'back') {
        card.back = cardSide;
      } else {
        continue;
      }
      groups[name] = card;
    }

    return Object.values(groups);
  }

  render() {
    const { backAuthenticity } = this.state;

    return (
      <div>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header style={{ padding: 0 }}>Description</Accordion.Header>
            <Accordion.Body>
              <p>An autofill for A Long-extended Party, an unofficial community run project that makes makes player cards and quests for the Lord of the Rings: The Card Game</p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flex: '1 1 1px', overflowY: 'scroll' }}>
          <FloatingLabel label="Back Authenticity" style={{ flex: 1 }}>
            <Form.Select value={backAuthenticity.id} onChange={this.onBackAuthenticityChange}>
              {authenticityData.map((it) => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </div>
      </div >
    );
  }
}

const autofillTypeALeP: AutofillType = {
  id: 'alep',
  name: 'ALeP',
};
export default autofillTypeALeP;