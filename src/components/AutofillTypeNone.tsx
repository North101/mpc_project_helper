import React, { ReactNode } from "react";
import { Card, CardSide } from "../types/card";

export interface AutofillNoneProps {
  cardSides: CardSide[];
  onChange: (cards: Card[]) => void;
}

export class AutofillNone<T = {}> extends React.Component<AutofillNoneProps, T> {
  static cardId = 0;

  onChange = () => {
    const { onChange } = this.props;
    onChange([]);
  }

  componentDidMount() {
    this.onChange();
  }

  render(): ReactNode {
    return null;
  }
}

export interface AutofillType {
  id: string;
  name: string;
  description: string;
  view: typeof AutofillNone;
}

const autofillTypeNone: AutofillType = {
  id: 'none',
  name: 'No Autofill',
  description: 'You\'re on your own',
  view: AutofillNone,
}
export default autofillTypeNone;