import { useNumberAnimation } from "@/animations";
import {
  Difficulty,
  DifficultyConfig,
  difficultyConfigs,
} from "@/models/challenge.model";
import { useHomeStore } from "@/store/home";
import { getDifficultyColor } from "@/utils/difficulty";
import { useCallback, useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const DIFFICULTIES: readonly Difficulty[] = ["Fácil", "Médio", "Difícil"];

export function useDifficultySectionViewModel() {
  const { selectedDifficulty, setDifficulty } = useHomeStore();
  const difficultyConfig: DifficultyConfig = difficultyConfigs[selectedDifficulty];

  const selectedIndex = DIFFICULTIES.indexOf(selectedDifficulty);
  const translateX = useSharedValue(selectedIndex * 100);

  const { animatedStyle: timeAnimatedStyle } = useNumberAnimation(
    difficultyConfig.estimatedTime,
  );

  useEffect(() => {
    const newIndex = DIFFICULTIES.indexOf(selectedDifficulty);
    translateX.value = withSpring(newIndex * 100, {
      damping: 30,
      stiffness: 120,
    });
  }, [selectedDifficulty, translateX]);

  const handleSelectDifficulty = useCallback(
    (difficulty: Difficulty) => {
      setDifficulty(difficulty);
    },
    [setDifficulty],
  );

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));

  return {
    selectedDifficulty,
    difficulties: DIFFICULTIES,
    difficultyConfig,
    handleSelectDifficulty,
    getDifficultyColor,
    indicatorAnimatedStyle,
    timeAnimatedStyle,
  };
}
