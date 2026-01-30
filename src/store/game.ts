import { Challenge } from "@/models/challenge.model";
import { GameResult, GameState } from "@/models/game.model";
import { GameService } from "@/services/game.service";
import { HapticService } from "@/services/haptic.service";
import { create } from "zustand";

interface GameStore extends GameState {
  // Game Logic
  initGame: (challenge: Challenge) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  clearGame: () => void;
  finishGame: () => GameResult | null;
  selectCard: (cardId: string) => void;
  resetMismatchedCards: () => void;
  tick: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  _timerId: number | null;

  // UI States
  showVictoryModal: boolean;
  showDefeatModal: boolean;
  showExitModal: boolean;
  showCountdown: boolean;
  shouldAnimateEntry: boolean;
  isPreviewingCards: boolean;

  // UI Actions
  setShowVictoryModal: (show: boolean) => void;
  setShowDefeatModal: (show: boolean) => void;
  setShowExitModal: (show: boolean) => void;
  setShowCountdown: (show: boolean) => void;
  setShouldAnimateEntry: (should: boolean) => void;
  previewAllCards: () => void;
  hideAllCards: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Game State
  status: "idle",
  challenge: null,
  cards: [],
  selectedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  moves: 0,
  timeRemaining: 0,
  timeElapsed: 0,
  startedAt: null,
  _timerId: null,

  // UI State
  showVictoryModal: false,
  showDefeatModal: false,
  showExitModal: false,
  showCountdown: false,
  shouldAnimateEntry: false,
  isPreviewingCards: false,

  initGame: (challenge: Challenge) => {
    const gameState = GameService.initializeGame(challenge);
    set(gameState);
  },

  startGame: () => {
    const currentState = get();
    const newState = GameService.startGame(currentState);
    set(newState);
    get().startTimer();
  },

  pauseGame: () => {
    const currentState = get();
    const newState = GameService.pauseGame(currentState);
    set(newState);
    get().stopTimer();
    HapticService.light();
  },

  resumeGame: () => {
    const currentState = get();
    const newState = GameService.resumeGame(currentState);
    set(newState);
    get().startTimer();
    HapticService.light();
  },

  resetGame: () => {
    const currentState = get();
    if (!currentState.challenge) return;

    const newState = GameService.resetGame(currentState.challenge);
    set(newState);
    get().stopTimer();
    HapticService.medium();
  },

  clearGame: () => {
    get().stopTimer();
    set({
      status: 'idle',
      challenge: null,
      cards: [],
      selectedCards: [],
      matchedPairs: 0,
      totalPairs: 0,
      moves: 0,
      timeRemaining: 0,
      timeElapsed: 0,
      startedAt: null,
      showVictoryModal: false,
      showDefeatModal: false,
      showExitModal: false,
      showCountdown: false,
      shouldAnimateEntry: false,
      isPreviewingCards: false,
    });
  },

  finishGame: () => {
    const currentState = get();
    const result = GameService.finishGame(currentState);
    get().stopTimer();

    if (result?.completed) {
      HapticService.success();
    }

    return result;
  },

  selectCard: (cardId: string) => {
    const currentState = get();
    const { newState, action } = GameService.selectCard(currentState, cardId);

    set(newState);

    switch (action) {
      case "flip":
        HapticService.light();
        break;
      case "match":
        HapticService.heavy();
        if (newState.status === "finished") {
          setTimeout(() => {
            get().finishGame();
          }, 500);
        }
        break;
      case "mismatch":
        HapticService.error();
        setTimeout(() => {
          get().resetMismatchedCards();
        }, 1000);
        break;
      case "invalid":
        break;
    }
  },

  resetMismatchedCards: () => {
    const currentState = get();
    const newState = GameService.resetMismatchedCards(currentState);
    set(newState);
  },

  tick: () => {
    const currentState = get();
    const newState = GameService.tick(currentState);
    set(newState);

    if (newState.timeRemaining === 10) {
      HapticService.warning();
    }

    if (newState.status === "timeout") {
      get().stopTimer();
      HapticService.error();
    }
  },

  startTimer: () => {
    const currentState = get();

    if (currentState._timerId) {
      clearInterval(currentState._timerId);
    }

    const timerId = setInterval(() => {
      get().tick();
    }, 1000);

    set({ _timerId: timerId });
  },

  stopTimer: () => {
    const currentState = get();

    if (currentState._timerId) {
      clearInterval(currentState._timerId);
      set({ _timerId: null });
    }
  },

  // UI Actions
  setShowVictoryModal: (show: boolean) => set({ showVictoryModal: show }),
  setShowDefeatModal: (show: boolean) => set({ showDefeatModal: show }),
  setShowExitModal: (show: boolean) => set({ showExitModal: show }),
  setShowCountdown: (show: boolean) => set({ showCountdown: show }),
  setShouldAnimateEntry: (should: boolean) =>
    set({ shouldAnimateEntry: should }),

  previewAllCards: () => {
    const currentState = get();
    const flippedCards = currentState.cards.map((card) => ({
      ...card,
      isFlipped: true,
    }));
    set({ cards: flippedCards, isPreviewingCards: true });
  },

  hideAllCards: () => {
    const currentState = get();
    const hiddenCards = currentState.cards.map((card) => ({
      ...card,
      isFlipped: false,
    }));
    set({ cards: hiddenCards, isPreviewingCards: false });
  },
}));
