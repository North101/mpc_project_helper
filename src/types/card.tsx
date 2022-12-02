export type CardFace = 'front' | 'back';

export const CardFaces: CardFace[] = [
  'front',
  'back',
]

export interface CardSide {
  id: number;
  file: File;
  info: {
    width: number;
    height: number;
  };
}

export interface Card {
  id: number;
  front?: CardSide;
  back?: CardSide;
  count: number;
}

export interface CardListGroup {
  key: string;
  front?: CardSide;
  back?: CardSide;
  items: (Card | undefined)[];
}