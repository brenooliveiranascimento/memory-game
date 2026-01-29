import { Easing } from 'react-native-reanimated';
import type { AnimationTimings, ParticleConfig } from '../types/animation.types';

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
