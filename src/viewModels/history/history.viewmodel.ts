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

export function useHistoryViewModel() {
  const { goBack } = useAnimatedNavigation();
  const { userName } = useAuthStore();
  const { getPlayerScores, scores } = useRankingStore();

  const playerScores = useMemo(() => {
    if (!userName) return [];
    return getPlayerScores(userName);
  }, [userName, getPlayerScores]);

  const stats = useMemo<HistoryStats>(() => {
    const completedGames = playerScores.filter(score => score.completed);
    const totalGames = completedGames.length;

    if (totalGames === 0) {
      return {
        totalGames: 0,
        averageTime: '00:00',
      };
    }

    const totalSeconds = completedGames.reduce((sum, score) => sum + score.time, 0);
    const avgSeconds = Math.floor(totalSeconds / totalGames);
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = avgSeconds % 60;

    return {
      totalGames,
      averageTime: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    };
  }, [playerScores]);

  const getPlayerPosition = useCallback((score: GameScore): number => {
    const categoryScores = scores
      .filter(s => s.category === score.category && s.difficulty === score.difficulty && s.completed)
      .sort((a, b) => {
        if (a.time !== b.time) return a.time - b.time;
        return a.moves - b.moves;
      });

    const position = categoryScores.findIndex(s => s.id === score.id);
    return position >= 0 ? position + 1 : 0;
  }, [scores]);

  const formatDate = useCallback((date: Date): string => {
    return format(new Date(date), 'dd/MM/yy');
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  const formattedMatches = useMemo<FormattedMatch[]>(() => {
    return playerScores
      .filter(score => score.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(score => ({
        id: score.id,
        title: score.category,
        position: getPlayerPosition(score),
        date: formatDate(score.date),
        time: formatTime(score.time),
        difficulty: score.difficulty,
      }));
  }, [playerScores, getPlayerPosition, formatDate, formatTime]);

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return {
    stats,
    matches: formattedMatches,
    handleBack,
  };
}
