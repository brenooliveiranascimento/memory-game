import { ImageSourcePropType } from "react-native";

export interface Card {
  id: string;
  value: string;
  image?: ImageSourcePropType;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface CardPair {
  card1: Card;
  card2: Card;
}
