import { useEffect, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing } from 'react-native-reanimated';

interface UseCountdownOverlayViewModelProps {
  visible: boolean;
  onComplete: () => void;
}

export function useCountdownOverlayViewModel({ visible, onComplete }: UseCountdownOverlayViewModelProps) {
  const [count, setCount] = useState(3);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (visible) {
      setCount(3);
      let currentCount = 3;

      const countdown = setInterval(() => {
        if (currentCount > 1) {
          currentCount--;
          setCount(currentCount);

          scale.value = 0;
          opacity.value = 0;
          scale.value = withSequence(
            withTiming(1.2, { duration: 200, easing: Easing.out(Easing.ease) }),
            withTiming(1, { duration: 100 })
          );
          opacity.value = withTiming(1, { duration: 200 });
        } else {
          clearInterval(countdown);
          opacity.value = withTiming(0, { duration: 300 });
          setTimeout(() => {
            onComplete();
          }, 300);
        }
      }, 1000);

      scale.value = 0;
      opacity.value = 0;
      scale.value = withSequence(
        withTiming(1.2, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 100 })
      );
      opacity.value = withTiming(1, { duration: 200 });

      return () => clearInterval(countdown);
    }
  }, [visible, onComplete, scale, opacity]);

  return {
    count,
    animatedStyle,
  };
}
