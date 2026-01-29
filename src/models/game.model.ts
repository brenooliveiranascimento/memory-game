import { Card } from './card.model';
import { Challenge } from './challenge.model';

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'finished' | 'timeout';

export interface GameState {
  status: GameStatus;
  challenge: Challenge | null;
  cards: Card[];
  selectedCards: Card[];
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  timeRemaining: number;
  timeElapsed: number;
  startedAt: Date | null;
}

export interface GameResult {
  completed: boolean;
  timeElapsed: number;
  moves: number;
  challenge: Challenge;
}
