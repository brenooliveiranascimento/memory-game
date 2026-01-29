import { create } from 'zustand';
import { Difficulty } from '@/models/challenge.model';

interface HomeStore {
  selectedDifficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  selectedDifficulty: 'Médio',
  setDifficulty: (difficulty: Difficulty) => set({ selectedDifficulty: difficulty }),
}));
