export interface CardSide {
  id: number;
  name: string;
  file: File;
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