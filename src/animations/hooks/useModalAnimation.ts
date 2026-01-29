import { useEffect, useCallback, useRef } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { SPRING_CONFIGS, ANIMATION_TIMINGS } from '../config/animation.config';

interface UseModalAnimationProps {
  visible: boolean;
}

export function useModalAnimation({ visible }: UseModalAnimationProps) {
  const translateY = useSharedValue(-1000);
  const opacity = useSharedValue(0);
  const pendingCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, SPRING_CONFIGS.modal);
      opacity.value = withSpring(1, SPRING_CONFIGS.modal);
    } else {
      translateY.value = -1000;
      opacity.value = 0;
    }
  }, [visible]);

  const executeCallback = useCallback(() => {
    if (pendingCallbackRef.current) {
      pendingCallbackRef.current();
      pendingCallbackRef.current = null;
    }
  }, []);

  const close = useCallback((callback: () => void) => {
    pendingCallbackRef.current = callback;
    const exitDuration = ANIMATION_TIMINGS.exit.duration;

    translateY.value = withTiming(1000, { duration: exitDuration });
    opacity.value = withTiming(0, { duration: exitDuration }, (finished) => {
      if (finished) {
        runOnJS(executeCallback)();
      }
    });
  }, [executeCallback]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    close,
  };
}
