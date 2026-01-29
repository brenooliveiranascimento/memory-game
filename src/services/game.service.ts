import { Card } from '@/models/card.model';
import { Challenge } from '@/models/challenge.model';
import { GameState, GameStatus, GameResult } from '@/models/game.model';
import { CardService } from './card.service';

export class GameService {
  static initializeGame(challenge: Challenge): GameState {
    const cards = CardService.generateCards(challenge);
    const totalPairs = challenge.cards.length;

    return {
      status: 'countdown',
      challenge,
      cards,
      selectedCards: [],
      matchedPairs: 0,
      totalPairs,
      moves: 0,
      timeRemaining: challenge.timeLimit,
      timeElapsed: 0,
      startedAt: null,
    };
  }

  static startGame(gameState: GameState): GameState {
    return {
      ...gameState,
      status: 'playing',
      startedAt: new Date(),
    };
  }

  static selectCard(
    gameState: GameState,
    cardId: string
  ): { newState: GameState; action: 'flip' | 'match' | 'mismatch' | 'invalid' } {
    const { cards, selectedCards, status } = gameState;

    if (status !== 'playing') {
      return { newState: gameState, action: 'invalid' };
    }

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isMatched || card.isFlipped) {
      return { newState: gameState, action: 'invalid' };
    }

    if (selectedCards.length >= 2) {
      return { newState: gameState, action: 'invalid' };
    }

    const updatedCards = cards.map((c) =>
      c.id === cardId ? CardService.flipCard(c, true) : c
    );

    const newSelectedCards = [...selectedCards, card];

    if (newSelectedCards.length === 1) {
      return {
        newState: {
          ...gameState,
          cards: updatedCards,
          selectedCards: newSelectedCards,
        },
        action: 'flip',
      };
    }

    const [firstCard, secondCard] = newSelectedCards;
    const isMatch = CardService.isMatch(firstCard, secondCard);
    const moves = gameState.moves + 1;

    if (isMatch) {
      const finalCards = updatedCards.map((c) =>
        c.id === firstCard.id || c.id === secondCard.id
          ? CardService.markAsMatched(c)
          : c
      );

      const matchedPairs = gameState.matchedPairs + 1;
      const isComplete = CardService.isGameComplete(finalCards);

      return {
        newState: {
          ...gameState,
          cards: finalCards,
          selectedCards: [],
          matchedPairs,
          moves,
          status: isComplete ? 'finished' : 'playing',
        },
        action: 'match',
      };
    } else {
      return {
        newState: {
          ...gameState,
          cards: updatedCards,
          selectedCards: newSelectedCards,
          moves,
        },
        action: 'mismatch',
      };
    }
  }

  static resetMismatchedCards(gameState: GameState): GameState {
    const { cards, selectedCards } = gameState;

    const updatedCards = cards.map((card) => {
      const isSelected = selectedCards.some((sc) => sc.id === card.id);
      return isSelected && !card.isMatched
        ? CardService.flipCard(card, false)
        : card;
    });

    return {
      ...gameState,
      cards: updatedCards,
      selectedCards: [],
    };
  }

  static tick(gameState: GameState): GameState {
    if (gameState.status !== 'playing') {
      return gameState;
    }

    const timeRemaining = Math.max(0, gameState.timeRemaining - 1);
    const timeElapsed = gameState.timeElapsed + 1;

    return {
      ...gameState,
      timeRemaining,
      timeElapsed,
      status: timeRemaining === 0 ? 'timeout' : gameState.status,
    };
  }

  static pauseGame(gameState: GameState): GameState {
    return {
      ...gameState,
      status: 'paused',
    };
  }

  static resumeGame(gameState: GameState): GameState {
    return {
      ...gameState,
      status: 'playing',
    };
  }

  static finishGame(gameState: GameState): GameResult | null {
    if (!gameState.challenge) {
      return null;
    }

    return {
      completed: gameState.status === 'finished',
      timeElapsed: gameState.timeElapsed,
      moves: gameState.moves,
      challenge: gameState.challenge,
    };
  }

  static resetGame(challenge: Challenge): GameState {
    return this.initializeGame(challenge);
  }

  static calculateScore(result: GameResult): number {
    return result.timeElapsed + result.moves * 5;
  }
}
