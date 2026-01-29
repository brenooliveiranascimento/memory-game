export type CardEntryAnimationType = 'throw' | 'deck';

export type CardAnimationState =
  | 'idle'
  | 'entering'
  | 'selecting'
  | 'selected'
  | 'shaking'
  | 'success'
  | 'matched'
  | 'exiting';

export interface CardAnimationConfig {
  duration: number;
  delay?: number;
  easing?: any;
}

export interface AnimationTimings {
  entry: {
    throw: {
      duration: number;
      delayBetweenCards: number;
    };
    deck: {
      duration: number;
      delayBetweenCards: number;
    };
  };
  selection: {
    duration: number;
    scale: number;
  };
  shake: {
    duration: number;
    distance: number;
    repeat: number;
  };
  success: {
    duration: number;
    scale: number;
    particleCount: number;
  };
  exit: {
    duration: number;
  };
  fall: {
    duration: number;
    rotationDuration: number;
    opacityDelay: number;
    opacityDuration: number;
    maxRandomDelay: number;
  };
}

export interface ParticleConfig {
  count: number;
  colors: string[];
  size: number;
  spread: number;
  duration: number;
}
