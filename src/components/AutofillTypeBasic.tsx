import React from "react";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import { Card, CardSide } from "../types/card";
import AutofillNone, { AutofillNoneProps } from "./AutofillTypeNone";

interface AutofillBasicState {
  defaultFront?: CardSide;
  defaultBack?: CardSide;
}

export default class AutofillBasic extends AutofillNone<AutofillBasicState> {
  constructor(props: AutofillNoneProps) {
    super(props);

    this.state = {
      defaultFront: undefined,
      defaultBack: undefined,
    };
  }

  onChange = () => {
    const { onChange } = this.props;
    onChange(this.process());
  }

  onDefaultFrontChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { cardSides } = this.props;
    const defaultFront = cardSides.find((it) => `${it.id}` === event.currentTarget.value);

    this.setState({
      defaultFront,
    }, () => this.onChange());
  }

  onDefaultBackChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { cardSides } = this.props;
    const defaultBack = cardSides.find((it) => `${it.id}` === event.currentTarget.value);

    this.setState({
      defaultBack,
    }, () => this.onChange());
  }

  componentDidMount() {
    this.onChange();
  }

  process = () => {
    const { cardSides } = this.props;
    const { defaultFront, defaultBack } = this.state;

    const re = /^(.+?(?:\-x(\d+))?)(?:\-(front|back|a|b|1|2))\.(png|jpg)$/;

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
        id: AutofillNone.cardId++,
        front: defaultFront,
        back: defaultBack,
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
  }

  render() {
    const { cardSides } = this.props;
    const { defaultFront, defaultBack } = this.state;

    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <FloatingLabel label="Default Front" style={{ flex: 1 }}>
          <Form.Select value={defaultFront?.id} onChange={this.onDefaultFrontChange}>
            <option>None</option>
            {cardSides.map((it) => (
              <option key={it.id} value={it.id}>{it.name}</option>
            ))}
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel label="Default Back" style={{ flex: 1 }}>
          <Form.Select value={defaultBack?.id} onChange={this.onDefaultBackChange}>
            <option>None</option>
            {cardSides.map((it) => (
              <option key={it.id} value={it.id}>{it.name}</option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </div>
    );
  }
}