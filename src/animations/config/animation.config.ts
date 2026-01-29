import { Easing, WithSpringConfig } from 'react-native-reanimated';
import type { AnimationTimings, ParticleConfig } from '../types/animation.types';

export const SPRING_CONFIGS = {
  selection: {
    damping: 15,
    stiffness: 300,
  } as WithSpringConfig,

  successBounce: {
    damping: 8,
    stiffness: 100,
  } as WithSpringConfig,

  successSettle: {
    damping: 10,
    stiffness: 80,
  } as WithSpringConfig,

  entryThrow: {
    damping: 25,
    stiffness: 180,
  } as WithSpringConfig,

  entryDeck: {
    damping: 22,
    stiffness: 140,
  } as WithSpringConfig,

  entryScale: {
    damping: 22,
    stiffness: 180,
  } as WithSpringConfig,

  press: {
    damping: 15,
    stiffness: 150,
  } as WithSpringConfig,

  modal: {
    damping: 25,
    stiffness: 120,
    mass: 1,
  } as WithSpringConfig,
};

export const ANIMATION_TIMINGS: AnimationTimings = {
  entry: {
    throw: {
      duration: 400,
      delayBetweenCards: 50,
    },
    deck: {
      duration: 350,
      delayBetweenCards: 40,
    },
  },
  selection: {
    duration: 150,
    scale: 1.05,
  },
  shake: {
    duration: 400,
    distance: 10,
    repeat: 3,
  },
  success: {
    duration: 600,
    scale: 1.1,
    particleCount: 8,
  },
  exit: {
    duration: 300,
  },
  fall: {
    duration: 600,
    rotationDuration: 300,
    opacityDelay: 400,
    opacityDuration: 200,
    maxRandomDelay: 200,
  },
};

export const PARTICLE_CONFIG: ParticleConfig = {
  count: 8,
  colors: ['#55EAE1', '#7DAFFF', '#C27CFB', '#32D74B'],
  size: 8,
  spread: 60,
  duration: 800,
};

export const ANIMATION_EASINGS = {
  entry: Easing.out(Easing.cubic),
  exit: Easing.in(Easing.cubic),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1.2),
  linear: Easing.linear,
};

export const ENTRY_ANIMATION_START_POSITIONS = {
  throw: {
    x: 300,
    y: 600,
  },
  deck: {
    x: 0,
    y: 400,
  },
};
