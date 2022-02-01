import React from "react";
import Accordion from "react-bootstrap/esm/Accordion";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { Card, CardSide } from "../types/card";
import { AutofillNone, AutofillNoneProps, AutofillType } from "./AutofillTypeNone";

const sideData: {
  id: 'front' | 'back';
  name: string;
}[] = [
  {
    id: 'front',
    name: 'Front',
  },
  {
    id: 'back',
    name: 'Back',
  },
];

export const FilenameTooltip = (props: any) => {
  return (
    <OverlayTrigger
      placement='bottom'
      overlay={<Tooltip>{props.children}</Tooltip>}
    >
      <span className="filename-part">{props.text}</span>
    </OverlayTrigger>
  )
}

interface AutofillBasicState {
  defaultSide?: 'front' | 'back';
  defaultFront?: CardSide;
  defaultBack?: CardSide;
}

export class AutofillBasic extends AutofillNone<AutofillBasicState> {
  cardMatcher = /^(.+?(?:(?:\s|\-|_|\.)x(\d+))?)(?:(?:(?:\s|\-|_|\.)(front|back|[AaBb12]))|((?<=\d)[AaBb]))?\.(png|jpg)$/;
  defaultFrontMatcher = /^front.(png|jpg)$/
  defaultBackMatcher = /^back.(png|jpg)$/

  constructor(props: AutofillNoneProps) {
    super(props);

    const { cardSides } = props;
    this.state = {
      defaultSide: undefined,
      defaultFront: cardSides.find((it) => it.file.name.match(this.defaultFrontMatcher)),
      defaultBack: cardSides.find((it) => it.file.name.match(this.defaultBackMatcher)),
    };
  }

  onChange = () => {
    const { onChange } = this.props;
    onChange(this.process());
  }

  onDefaultSideChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const defaultSide = sideData.find((it) => it.id === event.currentTarget.value)?.id;

    this.setState({
      defaultSide,
    }, () => this.onChange());
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
    const { defaultSide, defaultFront, defaultBack } = this.state;

    const groups: {
      [key: string]: Card;
    } = {};
    for (const cardSide of cardSides) {
      const match = cardSide.file.name.match(this.cardMatcher);
      if (!match) continue;

      const name = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      const side = (match[3] ?? match[4])?.toLowerCase();
      if (!side && ['front', 'back'].includes(name)) continue;

      const card = groups[name] ?? {
        id: AutofillNone.cardId++,
        front: defaultFront,
        back: defaultBack,
        count,
      }
      if (['front', 'a', '1'].includes(side) || (!side && defaultSide === 'front')) {
        card.front = cardSide;
      } else if (['back', 'b', '2'].includes(side) || (!side && defaultSide === 'back')) {
        card.back = cardSide;
      } else {
        continue;
      }
      groups[name] = card;
    }

    return Object.values(groups);
  }

  render() {
    const { cardSides } = this.props;
    const { defaultSide, defaultFront, defaultBack } = this.state;

    return (
      <div>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header style={{ padding: 0 }}>Description</Accordion.Header>
            <Accordion.Body>
              <p>A basic autofill that will match front and back images and (optionally) a count</p>
              <p>
                <span>An image with the filename </span>
                <span style={{ color: 'blue', textDecoration: 'underline' }}>
                  <FilenameTooltip text={'<side>'}>
                    <span style={{ fontWeight: 'bold' }}>Required</span><br />
                    side: front, back
                  </FilenameTooltip>
                  <FilenameTooltip text={'.<ext>'}>
                    <span style={{ fontWeight: 'bold' }}>Required</span><br />
                    ext: .png, .jpg
                  </FilenameTooltip>
                </span>
                <span> will be automatically set as the default front or back image</span>
              </p>
              <p>
                <span>Filename structure (hover for more info): </span>
                <span style={{ color: 'blue', textDecoration: 'underline' }}>
                  <FilenameTooltip text={'<anything>'}>
                    Literally anything
                  </FilenameTooltip>
                  <FilenameTooltip text={'-x<count>'}>
                    <span style={{ fontWeight: 'bold' }}>Optional</span><br />
                    seperator: -, _, ., {'<space>'}<br />
                    count: number. the number of times you want this duplicated in the project
                  </FilenameTooltip>
                  <FilenameTooltip text={'-<side>'}>
                    <span style={{ fontWeight: 'bold' }}>Optional (default: front)</span><br />
                    seperator: -, _, ., {'<space>'}<br />
                    side:<br />
                    <ul>
                      <li>front, 1, a: will be assigned as the front image</li>
                      <li>back, 2, b: will be assigned as the back image</li>
                    </ul>
                  </FilenameTooltip>
                  <FilenameTooltip text={'.<ext>'}>
                    <span style={{ fontWeight: 'bold' }}>Required</span><br />
                    ext: .png, .jpg
                  </FilenameTooltip>
                </span>
              </p>
              <div>
                e.g.<br />
                <ul>
                  <li>
                    <span style={{ color: 'blue', textDecoration: 'underline' }}>
                      01-card
                      <FilenameTooltip text={'-x2'}>
                        <span style={{ fontWeight: 'bold' }}>{'-x<count>'}</span><br />
                        Sets the count to 2
                      </FilenameTooltip>
                      <FilenameTooltip text={'-front'}>
                        <span style={{ fontWeight: 'bold' }}>{'-<side>'}</span><br />
                        This is the front image for 01-card-x2
                      </FilenameTooltip>
                      <FilenameTooltip text={'.jpg'}>
                        <span style={{ fontWeight: 'bold' }}>{'.<ext>'}</span><br />
                        The file type
                      </FilenameTooltip>
                    </span>
                  </li>
                  <li>
                    <span style={{ color: 'blue', textDecoration: 'underline' }}>
                      01-card
                      <FilenameTooltip text={'-x2'}>
                        <span style={{ fontWeight: 'bold' }}>{'-<count>'}</span><br />
                        Sets the count to 2
                      </FilenameTooltip>
                      <FilenameTooltip text={'-back'}>
                        <span style={{ fontWeight: 'bold' }}>{'-<side>'}</span><br />
                        This is the back image for 01-card-x2
                      </FilenameTooltip>
                      <FilenameTooltip text={'.png'}>
                        <span style={{ fontWeight: 'bold' }}>{'.<ext>'}</span><br />
                        The file type
                      </FilenameTooltip>
                    </span>
                  </li>
                  <li>
                    <span style={{ color: 'blue', textDecoration: 'underline' }}>
                      my-filename
                      <FilenameTooltip text={'-front'}>
                        <span style={{ fontWeight: 'bold' }}>{'-<side>'}</span><br />
                        This is the front image for my-filename
                      </FilenameTooltip>
                      <FilenameTooltip text={'.png'}>
                        <span style={{ fontWeight: 'bold' }}>{'.<ext>'}</span><br />
                        The file type
                      </FilenameTooltip>
                    </span>
                  </li>
                  <li>
                    <span style={{ color: 'blue', textDecoration: 'underline' }}>
                      my-filename
                      <FilenameTooltip text={'-front'}>
                        <span style={{ fontWeight: 'bold' }}>{'-<side>'}</span><br />
                        This is the back image for my-filename
                      </FilenameTooltip>
                      <FilenameTooltip text={'.png'}>
                        <span style={{ fontWeight: 'bold' }}>{'.{ext>'}</span><br />
                        The file type
                      </FilenameTooltip>
                    </span>
                  </li>
                </ul>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flex: '1 1 1px', overflowY: 'scroll' }}>
          <FloatingLabel label="Default Side" style={{ flex: 1 }}>
            <Form.Select value={defaultSide} onChange={this.onDefaultSideChange}>
              <option>None</option>
              {sideData.map((it) => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
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
      </div >
    );
  }
}

const autofillTypeBasic: AutofillType = {
  id: 'basic',
  name: 'Basic',
}
export default autofillTypeBasic;