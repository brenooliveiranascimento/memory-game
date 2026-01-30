import { useAnimatedNavigation } from "@/animations";
import {
  Difficulty,
  challengeThemes,
  difficultyConfigs,
} from "@/models/challenge.model";
import { useAuthStore } from "@/store/auth";
import { useHomeStore } from "@/store/home";
import { getDifficultyColor } from "@/utils/difficulty";
import { useCallback, useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function useHomeViewModel() {
  const { navigateTo } = useAnimatedNavigation();
  const { userName } = useAuthStore();
  const { selectedDifficulty, setDifficulty } = useHomeStore();

  const difficulties: readonly Difficulty[] = ["Fácil", "Médio", "Difícil"];
  const difficultyConfig = difficultyConfigs[selectedDifficulty];

  const selectedIndex = difficulties.indexOf(selectedDifficulty);
  const translateX = useSharedValue(selectedIndex * 100);

  useEffect(() => {
    const newIndex = difficulties.indexOf(selectedDifficulty);
    translateX.value = withSpring(newIndex * 100, {
      damping: 30,
      stiffness: 120,
    });
  }, [selectedDifficulty]);

  const handleSelectDifficulty = useCallback(
    (difficulty: Difficulty) => {
      setDifficulty(difficulty);
    },
    [setDifficulty],
  );

  const handleSelectChallenge = useCallback(
    (themeId: string) => {
      navigateTo("/(private)/game", {
        themeId,
        difficulty: selectedDifficulty,
      });
    },
    [selectedDifficulty, navigateTo],
  );

  const handleGoToHistory = useCallback(() => {
    navigateTo("/(private)/history");
  }, [navigateTo]);

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));

  return {
    userName,
    selectedDifficulty,
    difficulties,
    difficultyConfig,
    challengeThemes,

    handleSelectDifficulty,
    handleSelectChallenge,
    handleGoToHistory,
    getDifficultyColor,

    indicatorAnimatedStyle,
  };
}
