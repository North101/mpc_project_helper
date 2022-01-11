import React, { ReactNode } from "react";
import { Card, CardSide } from "../types/card";

export interface AutofillNoneProps {
  cardSides: CardSide[];
  onChange: (cards: Card[]) => void;
}

export default class AutofillNone<T = {}> extends React.Component<AutofillNoneProps, T> {
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