import { useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { challengeThemes, createChallenge, Difficulty } from '@/models/challenge.model';
import { useAnimationStore, type CardEntryAnimationType, getFallAnimationDuration, getEntryAnimationDuration, useAnimatedNavigation } from '@/animations';
import { useAuthStore } from '@/store/auth';
import { useGameStore } from '@/store/game';
import { useRankingStore } from '@/store/ranking';

// Custom hook with handlers for the view
export function useGameViewHandlers() {
  const { navigateTo, goBack } = useAnimatedNavigation();
  const params = useLocalSearchParams<{ themeId: string; difficulty: string }>();
  const { userName } = useAuthStore();
  const { saveGameResult } = useRankingStore();
  const { entryAnimationType, setEntryAnimationType, setIsAnimating } = useAnimationStore();

  // Extract all store properties
  const {
    challenge,
    cards,
    status,
    timeRemaining,
    timeElapsed,
    moves,
    selectCard,
    initGame,
    startGame,
    resetGame,
    stopTimer,
    showVictoryModal,
    showDefeatModal,
    showExitModal,
    showCountdown,
    shouldAnimateEntry,
    setShowVictoryModal,
    setShowDefeatModal,
    setShowExitModal,
    setShowCountdown,
    setShouldAnimateEntry,
    previewAllCards,
    hideAllCards,
  } = useGameStore();

  // Initialize game when params change
  useEffect(() => {
    const theme = challengeThemes.find((t) => t.id === params.themeId);
    if (theme && params.difficulty) {
      setShouldAnimateEntry(false);

      const animationTypes: CardEntryAnimationType[] = ['throw', 'deck'];
      const randomType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      setEntryAnimationType(randomType);

      const newChallenge = createChallenge(theme, params.difficulty as Difficulty);
      initGame(newChallenge);

      setTimeout(() => {
        setShowCountdown(true);
      }, 500);
    }
  }, [params.themeId, params.difficulty, initGame, setShowCountdown, setEntryAnimationType, setShouldAnimateEntry]);

  // Handle game status changes (victory/defeat)
  useEffect(() => {
    if (status === 'finished') {
      const saveResult = async () => {
        if (challenge && userName) {
          await saveGameResult(
            {
              completed: true,
              timeElapsed,
              moves,
              challenge,
            },
            userName
          );
        }
        setShowVictoryModal(true);
      };
      saveResult();
    } else if (status === 'timeout') {
      const saveResult = async () => {
        if (challenge && userName) {
          await saveGameResult(
            {
              completed: false,
              timeElapsed: challenge.timeLimit,
              moves,
              challenge,
            },
            userName
          );
        }
        setTimeout(() => {
          setShowDefeatModal(true);
        }, getFallAnimationDuration());
      };
      saveResult();
    }
  }, [status, challenge, timeElapsed, moves, userName, saveGameResult, setShowVictoryModal, setShowDefeatModal]);

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    setShouldAnimateEntry(true);
    setIsAnimating(true);

    const totalAnimationTime = getEntryAnimationDuration(cards.length, entryAnimationType);

    setTimeout(() => {
      setIsAnimating(false);
      previewAllCards();

      setTimeout(() => {
        hideAllCards();

        setTimeout(() => {
          startGame();
        }, 300);
      }, 2000);
    }, totalAnimationTime);
  }, [setShowCountdown, setShouldAnimateEntry, startGame, cards.length, setIsAnimating, previewAllCards, hideAllCards, entryAnimationType]);

  const handlePlayAgain = useCallback(() => {
    setShowVictoryModal(false);
    setShouldAnimateEntry(false);
    resetGame();
    setTimeout(() => {
      setShowCountdown(true);
    }, 300);
  }, [setShowVictoryModal, setShouldAnimateEntry, resetGame, setShowCountdown]);

  const handleTryAgain = useCallback(() => {
    setShowDefeatModal(false);
    setShouldAnimateEntry(false);
    resetGame();
    setTimeout(() => {
      setShowCountdown(true);
    }, 300);
  }, [setShowDefeatModal, setShouldAnimateEntry, resetGame, setShowCountdown]);

  const handleGoToHistory = useCallback(() => {
    setShowVictoryModal(false);
    setShowDefeatModal(false);
    navigateTo('/(private)/history');
  }, [setShowVictoryModal, setShowDefeatModal, navigateTo]);

  const handleBack = useCallback(() => {
    if (status === 'playing') {
      setShowExitModal(true);
    } else {
      goBack();
    }
  }, [status, setShowExitModal, goBack]);

  const handleConfirmExit = useCallback(() => {
    setShowExitModal(false);
    stopTimer();
    goBack();
  }, [setShowExitModal, stopTimer, goBack]);

  const handleCancelExit = useCallback(() => {
    setShowExitModal(false);
  }, [setShowExitModal]);

  return {
    // Game state
    challenge,
    cards,
    status,
    timeRemaining,
    timeElapsed,
    moves,
    selectCard,

    // UI state
    showVictoryModal,
    showDefeatModal,
    showExitModal,
    showCountdown,
    shouldAnimateEntry,

    // View handlers
    handleCountdownComplete,
    handlePlayAgain,
    handleTryAgain,
    handleGoToHistory,
    handleBack,
    handleConfirmExit,
    handleCancelExit,

    // Computed properties
    disabled: status !== 'playing',
  };
}
