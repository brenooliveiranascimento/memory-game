import { useCallback, useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Difficulty, challengeThemes, difficultyConfigs } from '@/models/challenge.model';
import { useAuthStore } from '@/store/auth';
import { useHomeStore } from '@/store/home';
import { colors } from '@/constants/colors';
import { useAnimatedNavigation } from '@/animations';

export function useHomeViewModel() {
  const { navigateTo } = useAnimatedNavigation();
  const { userName } = useAuthStore();
  const { selectedDifficulty, setDifficulty } = useHomeStore();

  const difficulties: readonly Difficulty[] = ['Fácil', 'Médio', 'Difícil'];
  const difficultyConfig = difficultyConfigs[selectedDifficulty];

  const selectedIndex = difficulties.indexOf(selectedDifficulty);
  // translateX com % move relativo ao tamanho do próprio elemento
  // Então para mover 1 posição = 100%, 2 posições = 200%
  const translateX = useSharedValue(selectedIndex * 100);

  useEffect(() => {
    const newIndex = difficulties.indexOf(selectedDifficulty);
    translateX.value = withSpring(newIndex * 100, {
      damping: 30,
      stiffness: 120,
    });
  }, [selectedDifficulty]);

  const getDifficultyColor = useCallback((difficulty: Difficulty) => {
    const colorsMap: Record<Difficulty, string> = {
      Fácil: colors.semantic.success,
      Médio: colors.semantic.warning,
      Difícil: colors.semantic.error,
    };
    return colorsMap[difficulty];
  }, []);

  const handleSelectDifficulty = useCallback((difficulty: Difficulty) => {
    setDifficulty(difficulty);
  }, [setDifficulty]);

  const handleSelectChallenge = useCallback((themeId: string) => {
    navigateTo('/(private)/game', {
      themeId,
      difficulty: selectedDifficulty,
    });
  }, [selectedDifficulty, navigateTo]);

  const handleGoToHistory = useCallback(() => {
    navigateTo('/(private)/history');
  }, [navigateTo]);

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));

  return {
    // Data
    userName,
    selectedDifficulty,
    difficulties,
    difficultyConfig,
    challengeThemes,

    // Handlers
    handleSelectDifficulty,
    handleSelectChallenge,
    handleGoToHistory,
    getDifficultyColor,

    // Animations
    indicatorAnimatedStyle,
  };
}
