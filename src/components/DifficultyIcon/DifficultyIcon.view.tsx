import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Difficulty } from '@/models/challenge.model';
import { useDifficultyIconViewModel } from './DifficultyIcon.viewmodel';

interface DifficultyIconProps {
  difficulty: Difficulty;
  color: string;
  isSelected: boolean;
  inactiveColor: string;
}

export function DifficultyIcon({ difficulty, color, isSelected, inactiveColor }: DifficultyIconProps) {
  const { getBarStyle, animatedStyle } = useDifficultyIconViewModel({ difficulty, color, isSelected, inactiveColor });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {[1, 2, 3].map((index) => (
        <View key={index} style={[styles.bar, getBarStyle(index)]} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
});
