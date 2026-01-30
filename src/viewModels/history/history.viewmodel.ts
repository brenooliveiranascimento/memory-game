import { useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/auth';
import { useRankingStore } from '@/store/ranking';
import { GameScore } from '@/models/score.model';
import { useAnimatedNavigation } from '@/animations';

interface HistoryStats {
  totalGames: number;
  averageTime: string;
}

interface FormattedMatch {
  id: string;
  title: string;
  position: number;
  date: string;
  time: string;
  difficulty: GameScore['difficulty'];
}

const toDate = (date: Date | string): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const difficultyWeight: Record<string, number> = {
  'Difícil': 3,
  'Médio': 2,
  'Fácil': 1,
};

export function useHistoryViewModel() {
  const { navigateTo } = useAnimatedNavigation();
  const { userName } = useAuthStore();
  const scores = useRankingStore((state) => state.scores);

  const completedGames = useMemo(() => {
    if (!userName) return [];
    return scores
      .filter((score) => score.playerName === userName && score.completed)
      .sort((a, b) => {
        if (a.time !== b.time) return a.time - b.time;
        return (difficultyWeight[b.difficulty] || 0) - (difficultyWeight[a.difficulty] || 0);
      });
  }, [userName, scores]);

  const stats = useMemo<HistoryStats>(() => {
    const totalGames = completedGames.length;

    if (totalGames === 0) {
      return { totalGames: 0, averageTime: '00:00' };
    }

    const totalSeconds = completedGames.reduce((sum, score) => sum + score.time, 0);
    const avgSeconds = Math.floor(totalSeconds / totalGames);

    return { totalGames, averageTime: formatTime(avgSeconds) };
  }, [completedGames]);

  const formattedMatches = useMemo<FormattedMatch[]>(() => {
    return completedGames.map((score, index) => ({
      id: score.id,
      title: score.category,
      position: index + 1,
      date: format(toDate(score.date), 'dd/MM/yy'),
      time: formatTime(score.time),
      difficulty: score.difficulty,
    }));
  }, [completedGames]);

  const handleBack = useCallback(() => {
    navigateTo('/(private)/home');
  }, [navigateTo]);

  return {
    stats,
    matches: formattedMatches,
    handleBack,
  };
}
