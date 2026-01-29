import { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring } from 'react-native-reanimated';
import { ANIMATION_TIMINGS, SPRING_CONFIGS } from '../config/animation.config';

export function useCardSuccessAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const playSuccess = () => {
    const { scale: successScale } = ANIMATION_TIMINGS.success;

    scale.value = withSequence(
      withSpring(successScale, SPRING_CONFIGS.successBounce),
      withSpring(1, SPRING_CONFIGS.successSettle)
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
