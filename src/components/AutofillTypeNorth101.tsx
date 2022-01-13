import { Card, CardListGroup, CardSide } from "../types/card";
import { AutofillType, AutofillNone } from "./AutofillTypeNone";

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
      console.log(match);
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
    return null;
  }
}

const autofillTypeNorth101: AutofillType = {
  id: 'north101',
  name: 'North101\'s Autofill',
}
export default autofillTypeNorth101;