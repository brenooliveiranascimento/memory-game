import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameScore, RankingFilters } from '@/models/score.model';
import { GameResult } from '@/models/game.model';

interface RankingStore {
  scores: GameScore[];
  filteredScores: GameScore[];
  activeFilters: RankingFilters;
  isLoading: boolean;
  saveGameResult: (result: GameResult, playerName: string) => void;
  applyFilters: (filters: RankingFilters) => void;
  clearFilters: () => void;
  clearAllScores: () => void;
  deleteScore: (scoreId: string) => void;
  getTopScores: (limit?: number) => GameScore[];
  getPlayerScores: (playerName: string) => GameScore[];
}

export const useRankingStore = create<RankingStore>()(
  persist(
    (set, get) => ({
      scores: [],
      filteredScores: [],
      activeFilters: {},
      isLoading: false,

      saveGameResult: (result: GameResult, playerName: string) => {
        const score: GameScore = {
          id: Date.now().toString(),
          playerName,
          category: result.challenge.title,
          difficulty: result.challenge.difficulty,
          time: result.timeElapsed,
          moves: result.moves,
          date: new Date(),
          completed: result.completed,
        };

        set((state) => {
          const updatedScores = [...state.scores, score].sort((a, b) => a.time - b.time);
          return {
            scores: updatedScores,
            filteredScores: state.activeFilters.category || state.activeFilters.difficulty || state.activeFilters.dateRange
              ? state.filteredScores
              : updatedScores,
          };
        });
      },

      applyFilters: (filters: RankingFilters) => {
        set({ activeFilters: filters });

        const { scores } = get();
        let filtered = [...scores];

        if (filters.category) {
          filtered = filtered.filter((score) => score.category === filters.category);
        }

        if (filters.difficulty) {
          filtered = filtered.filter(
            (score) => score.difficulty === filters.difficulty
          );
        }

        if (filters.dateRange) {
          filtered = filtered.filter((score) => {
            const scoreDate = new Date(score.date);
            return (
              scoreDate >= filters.dateRange!.start &&
              scoreDate <= filters.dateRange!.end
            );
          });
        }

        set({ filteredScores: filtered });
      },

      clearFilters: () => {
        const { scores } = get();
        set({
          activeFilters: {},
          filteredScores: scores,
        });
      },

      clearAllScores: () => {
        set({
          scores: [],
          filteredScores: [],
        });
      },

      deleteScore: (scoreId: string) => {
        const { scores, filteredScores } = get();

        set({
          scores: scores.filter((s) => s.id !== scoreId),
          filteredScores: filteredScores.filter((s) => s.id !== scoreId),
        });
      },

      getTopScores: (limit: number = 10) => {
        const { filteredScores } = get();
        return filteredScores.slice(0, limit);
      },

      getPlayerScores: (playerName: string) => {
        const { scores } = get();
        return scores.filter((score) => score.playerName === playerName);
      },
    }),
    {
      name: '@memory-game:scores',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
