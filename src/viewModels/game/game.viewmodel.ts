import { useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { challengeThemes, createChallenge, Difficulty } from '@/models/challenge.model';
import { useAnimationStore, type CardEntryAnimationType, getFallAnimationDuration, getEntryAnimationDuration, useAnimatedNavigation, createSequence } from '@/animations';
import { useAuthStore } from '@/store/auth';
import { useGameStore } from '@/store/game';
import { useRankingStore } from '@/store/ranking';

export function useGameViewHandlers() {
  const { navigateTo, goBack } = useAnimatedNavigation();
  const params = useLocalSearchParams<{ themeId: string; difficulty: string }>();
  const { userName } = useAuthStore();
  const { saveGameResult } = useRankingStore();
  const { entryAnimationType, setEntryAnimationType, setIsAnimating } = useAnimationStore();

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
    clearGame,
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

  useEffect(() => {
    const theme = challengeThemes.find((t) => t.id === params.themeId);
    if (theme && params.difficulty) {
      setShouldAnimateEntry(false);

      const animationTypes: CardEntryAnimationType[] = ['throw', 'deck'];
      const randomType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      setEntryAnimationType(randomType);

      const newChallenge = createChallenge(theme, params.difficulty as Difficulty);
      initGame(newChallenge);

      createSequence()
        .wait(500)
        .then(() => setShowCountdown(true))
        .run();
    }
  }, [params.themeId, params.difficulty, initGame, setShowCountdown, setEntryAnimationType, setShouldAnimateEntry]);

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
        createSequence()
          .wait(getFallAnimationDuration())
          .then(() => setShowDefeatModal(true))
          .run();
      };
      saveResult();
    }
  }, [status, challenge, timeElapsed, moves, userName, saveGameResult, setShowVictoryModal, setShowDefeatModal]);

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    setShouldAnimateEntry(true);
    setIsAnimating(true);

    const totalAnimationTime = getEntryAnimationDuration(cards.length, entryAnimationType);

    createSequence()
      .wait(totalAnimationTime)
      .then(() => {
        setIsAnimating(false);
        previewAllCards();
      })
      .wait(2000)
      .then(() => hideAllCards())
      .wait(300)
      .then(() => startGame())
      .run();
  }, [setShowCountdown, setShouldAnimateEntry, startGame, cards.length, setIsAnimating, previewAllCards, hideAllCards, entryAnimationType]);

  const handlePlayAgain = useCallback(() => {
    setShowVictoryModal(false);
    setShouldAnimateEntry(false);
    resetGame();

    createSequence()
      .wait(300)
      .then(() => setShowCountdown(true))
      .run();
  }, [setShowVictoryModal, setShouldAnimateEntry, resetGame, setShowCountdown]);

  const handleTryAgain = useCallback(() => {
    setShowDefeatModal(false);
    setShouldAnimateEntry(false);
    resetGame();

    createSequence()
      .wait(300)
      .then(() => setShowCountdown(true))
      .run();
  }, [setShowDefeatModal, setShouldAnimateEntry, resetGame, setShowCountdown]);

  const handleGoToHistory = useCallback(() => {
    clearGame();
    navigateTo('/(private)/history');
  }, [clearGame, navigateTo]);

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
    challenge,
    cards,
    status,
    timeRemaining,
    timeElapsed,
    moves,
    selectCard,

    showVictoryModal,
    showDefeatModal,
    showExitModal,
    showCountdown,
    shouldAnimateEntry,

    handleCountdownComplete,
    handlePlayAgain,
    handleTryAgain,
    handleGoToHistory,
    handleBack,
    handleConfirmExit,
    handleCancelExit,

    disabled: status !== 'playing',
  };
}
