import { useAnimatedNavigation } from "@/animations";
import { challengeThemes } from "@/models/challenge.model";
import { useAuthStore } from "@/store/auth";
import { useHomeStore } from "@/store/home";
import { useCallback } from "react";

export function useHomeViewModel() {
  const { navigateTo } = useAnimatedNavigation();
  const { userName } = useAuthStore();
  const { selectedDifficulty } = useHomeStore();

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

  return {
    userName,
    challengeThemes,
    handleSelectChallenge,
    handleGoToHistory,
  };
}
