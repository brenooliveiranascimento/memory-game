import { useEffect, useCallback, useRef } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';

interface UseModalAnimationProps {
  visible: boolean;
}

const EXIT_ANIMATION_DURATION = 300;

export function useModalAnimation({ visible }: UseModalAnimationProps) {
  const translateY = useSharedValue(-1000);
  const opacity = useSharedValue(0);
  const pendingCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 120,
        mass: 1,
      });
      opacity.value = withSpring(1, {
        damping: 25,
        stiffness: 120,
      });
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

    translateY.value = withTiming(1000, { duration: EXIT_ANIMATION_DURATION });
    opacity.value = withTiming(0, { duration: EXIT_ANIMATION_DURATION }, (finished) => {
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
