import { Difficulty } from './challenge.model';

export interface GameScore {
  id: string;
  playerName: string;
  category: string;
  difficulty: Difficulty;
  time: number; // tempo em segundos
  moves: number;
  date: Date;
  completed: boolean;
}

export interface RankingFilters {
  category?: string;
  difficulty?: Difficulty;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
