import { ANIMATION_TIMINGS } from '../config/animation.config';

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
