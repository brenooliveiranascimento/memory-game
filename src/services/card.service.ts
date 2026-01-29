import { ImageSourcePropType } from 'react-native';
import { Card } from '@/models/card.model';
import { Challenge, CardItem } from '@/models/challenge.model';

export class CardService {
  static createCardPair(cardItem: CardItem, startIndex: number): [Card, Card] {
    return [
      {
        id: `${cardItem.name}-1-${startIndex}`,
        value: cardItem.name,
        image: cardItem.image,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `${cardItem.name}-2-${startIndex + 1}`,
        value: cardItem.name,
        image: cardItem.image,
        isFlipped: false,
        isMatched: false,
      },
    ];
  }

  static generateCards(challenge: Challenge): Card[] {
    const cards: Card[] = [];

    challenge.cards.forEach((cardItem, index) => {
      const [card1, card2] = this.createCardPair(cardItem, index * 2);
      cards.push(card1, card2);
    });

    return this.shuffle(cards);
  }

  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  static isMatch(card1: Card, card2: Card): boolean {
    return card1.value === card2.value && card1.id !== card2.id;
  }

  static flipCard(card: Card, flipped: boolean): Card {
    return {
      ...card,
      isFlipped: flipped,
    };
  }

  static markAsMatched(card: Card): Card {
    return {
      ...card,
      isMatched: true,
      isFlipped: true,
    };
  }

  static resetCard(card: Card): Card {
    return {
      ...card,
      isFlipped: false,
      isMatched: false,
    };
  }

  static countMatchedPairs(cards: Card[]): number {
    return cards.filter((card) => card.isMatched).length / 2;
  }

  static isGameComplete(cards: Card[]): boolean {
    return cards.every((card) => card.isMatched);
  }

  static getFlippedUnmatchedCards(cards: Card[]): Card[] {
    return cards.filter((card) => card.isFlipped && !card.isMatched);
  }
}
