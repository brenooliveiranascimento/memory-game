import { create } from 'zustand';
import type { CardEntryAnimationType, CardAnimationState } from '../types/animation.types';

interface AnimationStore {
  entryAnimationType: CardEntryAnimationType;
  isAnimating: boolean;
  cardStates: Map<string, CardAnimationState>;

  setEntryAnimationType: (type: CardEntryAnimationType) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  setCardState: (cardId: string, state: CardAnimationState) => void;
  getCardState: (cardId: string) => CardAnimationState;
  resetCardStates: () => void;
  resetAnimation: () => void;
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  entryAnimationType: 'throw',
  isAnimating: false,
  cardStates: new Map(),

  setEntryAnimationType: (type) => set({ entryAnimationType: type }),

  setIsAnimating: (isAnimating) => set({ isAnimating }),

  setCardState: (cardId, state) => {
    const cardStates = new Map(get().cardStates);
    cardStates.set(cardId, state);
    set({ cardStates });
  },

  getCardState: (cardId) => {
    return get().cardStates.get(cardId) || 'idle';
  },

  resetCardStates: () => set({ cardStates: new Map() }),

  resetAnimation: () =>
    set({
      isAnimating: false,
      cardStates: new Map(),
    }),
}));
