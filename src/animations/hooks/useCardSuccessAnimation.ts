import { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring } from 'react-native-reanimated';
import { ANIMATION_TIMINGS } from '../config/animation.config';

export function useCardSuccessAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const playSuccess = () => {
    const { duration, scale: successScale } = ANIMATION_TIMINGS.success;

    scale.value = withSequence(
      withSpring(successScale, {
        damping: 8,
        stiffness: 100,
      }),
      withSpring(1, {
        damping: 10,
        stiffness: 80,
      })
    );
  };

  const fadeOut = () => {
    opacity.value = withTiming(0, {
      duration: ANIMATION_TIMINGS.exit.duration,
    });
    scale.value = withTiming(0.8, {
      duration: ANIMATION_TIMINGS.exit.duration,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    playSuccess,
    fadeOut,
  };
}
