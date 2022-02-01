import React from "react";
import Accordion from "react-bootstrap/esm/Accordion";
import { Card, CardListGroup, CardSide } from "../types/card";
import { AutofillType, AutofillNone } from "./AutofillTypeNone";
import { FilenameTooltip } from "./AutofillTypeBasic";

export class AutofillNorth101 extends AutofillNone {
  cardMatcher = /^(.+?)(?:(?:\s|\-|_|\.)(\d+))?(?:(?:\s|\-|_|\.)(front|back|a|b|1|2))\.(png|jpg)$/;

  onChange = () => {
    const { onChange } = this.props;
    onChange(this.process());
  }

  process = () => {
    const { cardSides } = this.props;

    const groups: {
      [key: string]: CardListGroup,
    } = {};
    for (const cardSide of cardSides) {
      const match = cardSide.file.name.match(this.cardMatcher);
      if (!match) continue;

      const name = match[1];
      const index = parseInt(match[2]) || 0;
      const side = match[3];

      const group = groups[name] ??= {
        key: name,
        items: [],
      };
      if (!index && (side === 'front' || side === 'back')) {
        group[side] = cardSide;
      } else {
        const card = group.items[index] ??= {
          id: AutofillNone.cardId++,
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
          id: AutofillNone.cardId++,
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

  componentDidMount() {
    this.onChange();
  }

  render() {
    return (
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ padding: 0 }}>Description</Accordion.Header>
          <Accordion.Body>
            <p>A autofill that will match groups of cards by index, front and back images</p>
            <p>
              <span>Filename structure (hover for more info): </span>
              <span style={{ color: 'blue', textDecoration: 'underline' }}>
                <FilenameTooltip text={'<group>'}>
                  <span style={{ fontWeight: 'bold' }}>Required</span><br />
                  group: Literally anything
                </FilenameTooltip>
                <FilenameTooltip text={'-<index>'}>
                  <span style={{ fontWeight: 'bold' }}>Optional</span><br />
                  seperator: -, _, ., {'<space>'}<br />
                  index: The index (starting at 1). Skipping an index will increase the count of the next card by the number of skips.<br/>
                  If no index is provided then it will be assigned as the default front / back image for that group.
                </FilenameTooltip>
                <FilenameTooltip text={'-<side>'}>
                  <span style={{ fontWeight: 'bold' }}>Required</span><br />
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
}

const autofillTypeNorth101: AutofillType = {
  id: 'north101',
  name: 'North101\'s Autofill',
}
export default autofillTypeNorth101;