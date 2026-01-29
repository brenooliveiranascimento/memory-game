import type { CardPosition } from '../types/animation.types';
import { ANIMATION_TIMINGS } from '../config/animation.config';

export const calculateCardPosition = (
  index: number,
  gridColumns: number,
  cardWidth: number,
  cardHeight: number,
  marginBottom: number,
  paddingHorizontal: number,
  screenWidth: number
): CardPosition => {
  const row = Math.floor(index / gridColumns);
  const col = index % gridColumns;

  const availableWidth = screenWidth - paddingHorizontal * 2;
  const totalGapWidth = availableWidth - cardWidth * gridColumns;
  const gapBetweenCards = totalGapWidth / (gridColumns - 1);

  const x = paddingHorizontal + col * (cardWidth + gapBetweenCards);
  const y = row * (cardHeight + marginBottom);

  return { x, y, index };
};

export const getRandomRotation = (min: number = -15, max: number = 15): number => {
  return Math.random() * (max - min) + min;
};

export const getRandomDelay = (baseDelay: number, variance: number = 0.2): number => {
  const min = baseDelay * (1 - variance);
  const max = baseDelay * (1 + variance);
  return Math.random() * (max - min) + min;
};

export const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const lerp = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const getFallAnimationDuration = (): number => {
  const config = ANIMATION_TIMINGS.fall;
  return config.maxRandomDelay + config.duration + config.opacityDelay + config.opacityDuration + 200;
};

export const getEntryAnimationDuration = (
  cardCount: number,
  animationType: 'throw' | 'deck'
): number => {
  const config = ANIMATION_TIMINGS.entry[animationType];
  const lastCardDelay = (cardCount - 1) * config.delayBetweenCards;
  const springSettleTime = animationType === 'throw' ? 800 : config.duration;
  return lastCardDelay + springSettleTime + 200;
};
