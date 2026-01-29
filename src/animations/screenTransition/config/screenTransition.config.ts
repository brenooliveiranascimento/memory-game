import { Easing } from "react-native-reanimated";

export const SCREEN_TRANSITION_CONFIG = {
  exit: {
    duration: 300,
  },
  entry: {
    duration: 350,
  },
  distance: {
    horizontal: 400,
    vertical: 600,
  },
  buffer: 50,
};

export const SCREEN_TRANSITION_EASINGS = {
  exit: Easing.in(Easing.cubic),
  entry: Easing.out(Easing.cubic),
};
