import { View, StyleSheet } from 'react-native';

import { GameCard } from '../GameCard/GameCard.view';
import type { Card } from '@/models/card.model';
import { gradients } from '@/constants/colors';

interface CardGridProps {
  cards: Card[];
  onCardPress: (cardId: string) => void;
  disabled: boolean;
  shouldAnimateEntry: boolean;
  gameStatus: string;
}

export function CardGrid({
  cards,
  onCardPress,
  disabled,
  shouldAnimateEntry,
  gameStatus,
}: CardGridProps) {
  return (
    <View style={styles.grid}>
      {cards.map((card, index) => (
        <GameCard
          key={card.id}
          card={card}
          cardIndex={index}
          gradient={gradients.card}
          onPress={onCardPress}
          disabled={disabled}
          shouldAnimateEntry={shouldAnimateEntry}
          gameStatus={gameStatus}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
