import React from "react";
import { Card } from "./ImageTab";

interface CardPreviewProps {
  height: number;
  width: number;
  card: Card;
}

interface CardPreviewState {
  front?: string;
  back?: string;
}

export default class CardPreview extends React.Component<CardPreviewProps, CardPreviewState> {
  constructor(props: CardPreviewProps) {
    super(props);

    this.state = {
      front: undefined,
      back: undefined,
    }
  }

  render() {
    const { height, width, card } = this.props;
    return (
      <div style={{ display: 'flex', gap: 4, border: '1px dashed', padding: 4, }}>
        <div style={{ display: 'flex', height: height / 2, width: width / 2 }}>
          <img src={card.front ? URL.createObjectURL(card.front.file) : ''}></img>
        </div>
        <div style={{ display: 'flex', height: height / 2, width: width / 2 }}>
          <img src={card.back ? URL.createObjectURL(card.back.file) : ''}></img>
        </div>
      </div>
    );
  }
}