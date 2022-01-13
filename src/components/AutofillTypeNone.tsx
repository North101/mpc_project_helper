import React, { ReactNode } from "react";
import { Form } from "react-bootstrap";
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
    return (
      <Form.Text>You're on your own</Form.Text>
    );
  }
}

export interface AutofillType {
  id: string;
  name: string;
}

const autofillTypeNone: AutofillType = {
  id: 'none',
  name: 'No Autofill',
}
export default autofillTypeNone;