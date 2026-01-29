import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import type { Difficulty } from '@/models/challenge.model';

interface UseDifficultyIconViewModelProps {
  difficulty: Difficulty;
  color: string;
  isSelected: boolean;
  inactiveColor: string;
}

export function useDifficultyIconViewModel({
  difficulty,
  color,
  isSelected,
  inactiveColor,
}: UseDifficultyIconViewModelProps) {
  const barCount = difficulty === 'Fácil' ? 1 : difficulty === 'Médio' ? 2 : 3;
  const barHeights = [6, 10, 14];
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withTiming(1.3, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [isSelected]);

  const getBarStyle = (index: number) => ({
    height: barHeights[index - 1],
    backgroundColor: index <= barCount && isSelected ? color : inactiveColor,
    opacity: index <= barCount ? 1 : 0.3,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    getBarStyle,
    animatedStyle,
  };
}
