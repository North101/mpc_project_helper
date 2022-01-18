import React from "react";
import Accordion from "react-bootstrap/esm/Accordion";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { Card, CardSide } from "../types/card";
import { AutofillNone, AutofillNoneProps, AutofillType } from "./AutofillTypeNone";

interface AutofillBasicState {
  defaultFront?: CardSide;
  defaultBack?: CardSide;
}

export class AutofillBasic extends AutofillNone<AutofillBasicState> {
  cardMatcher = /^(.+?(?:(?:\s|\-|_|\.)x(\d+))?)(?:(?:\s|\-|_|\.)(front|back|a|b|1|2))\.(png|jpg)$/;
  defaultFrontMatcher = /^front.(png|jpg)$/
  defaultBackMatcher = /^back.(png|jpg)$/

  constructor(props: AutofillNoneProps) {
    super(props);

    const { cardSides } = props;
    this.state = {
      defaultFront: cardSides.find((it) => it.file.name.match(this.defaultFrontMatcher)),
      defaultBack: cardSides.find((it) => it.file.name.match(this.defaultBackMatcher)),
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

    const groups: {
      [key: string]: Card;
    } = {};
    for (const cardSide of cardSides) {
      const match = cardSide.file.name.match(this.cardMatcher);
      console.log(match);
      if (!match) continue;

      const name = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      const side = match[3];
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
      <div>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header style={{ padding: 0 }}>Description</Accordion.Header>
            <Accordion.Body>
              <span>Filename structure (hover for more info):</span><br />
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip>
                    Literally anything
                  </Tooltip>
                }
              >
                <span className="filename-part">{'<anything>'}</span>
              </OverlayTrigger>
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip>
                    <span>Optional</span><br />
                    <span>seperator: -, _, ., {'<space>'}</span><br />
                    <span>count: number. the number of times you want this duplicated in the project</span>
                  </Tooltip>
                }
              >
                <span className="filename-part">{'<{seperator}x{count}>'}</span>
              </OverlayTrigger>
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip>
                    <span>Required</span><br />
                    <span>seperator: -, _, ., {'<space>'}</span><br />
                    <span>side: front, back, 1, 2, a, b</span>
                  </Tooltip>
                }
              >
                <span className="filename-part">{'<{seperator}{side}>'}</span>
              </OverlayTrigger>
              <OverlayTrigger
                placement='bottom'
                overlay={
                  <Tooltip>
                    <span>Required</span><br />
                    <span>ext: .png, .jpg</span>
                  </Tooltip>
                }
              >
                <span className="filename-part">{'.{ext}'}</span>
              </OverlayTrigger>
              <br />
              <span>e.g.</span><br />
              <span>my-filename x2 front.png</span><br />
              <span>my-filename x2 back.png</span><br />
              <span>my-filename-1.png</span><br />
              <span>my-filename-2.png</span><br />

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flex: '1 1 1px', overflowY: 'scroll' }}>
          <FloatingLabel label="Default Front" style={{ flex: 1 }}>
            <Form.Select value={defaultFront?.id} onChange={this.onDefaultFrontChange}>
              <option>None</option>
              {cardSides.map((it) => (
                <option key={it.id} value={it.id}>{it.file.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel label="Default Back" style={{ flex: 1 }}>
            <Form.Select value={defaultBack?.id} onChange={this.onDefaultBackChange}>
              <option>None</option>
              {cardSides.map((it) => (
                <option key={it.id} value={it.id}>{it.file.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </div>
      </div>
    );
  }
}

const autofillTypeBasic: AutofillType = {
  id: 'basic',
  name: 'Basic',
}
export default autofillTypeBasic;