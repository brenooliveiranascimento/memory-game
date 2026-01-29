import { useCallback, useMemo } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { ANIMATION_TIMINGS } from '../config/animation.config';

export function useCardTimeoutAnimation() {
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const reset = useCallback(() => {
    translateY.value = 0;
    rotation.value = 0;
    opacity.value = 1;
  }, [translateY, rotation, opacity]);

  const fall = useCallback((delay: number = 0) => {
    const config = ANIMATION_TIMINGS.fall;

    rotation.value = withDelay(
      delay,
      withTiming((Math.random() - 0.5) * 60, {
        duration: config.rotationDuration,
        easing: Easing.out(Easing.ease),
      })
    );

    translateY.value = withDelay(
      delay,
      withTiming(800, {
        duration: config.duration,
        easing: Easing.in(Easing.cubic),
      })
    );

    opacity.value = withDelay(
      delay + config.opacityDelay,
      withTiming(0, {
        duration: config.opacityDuration,
      })
    );
  }, [translateY, rotation, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotateZ: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return useMemo(() => ({
    animatedStyle,
    fall,
    reset,
  }), [animatedStyle, fall, reset]);
}
