import { useEffect, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring, Easing, interpolateColor } from 'react-native-reanimated';
import { HapticService } from '@/services/haptic.service';
import { colors } from '@/constants/colors';

interface UseCountdownOverlayViewModelProps {
  visible: boolean;
  onComplete: () => void;
}

export function useCountdownOverlayViewModel({ visible, onComplete }: UseCountdownOverlayViewModelProps) {
  const [count, setCount] = useState(3);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const colorProgress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      colorProgress.value,
      [0, 1, 2],
      [colors.semantic.success, colors.semantic.warning, colors.semantic.error]
    ),
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const pulseNumber = (countValue: number) => {
    colorProgress.value = 3 - countValue;

    scale.value = 0.5;
    opacity.value = 0;

    scale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );
    opacity.value = withTiming(1, { duration: 150 });

    ringScale.value = 0.8;
    ringOpacity.value = 0.6;
    ringScale.value = withTiming(2, { duration: 600, easing: Easing.out(Easing.ease) });
    ringOpacity.value = withTiming(0, { duration: 600 });
  };

  useEffect(() => {
    if (visible) {
      setCount(3);
      let currentCount = 3;

      HapticService.medium();
      pulseNumber(currentCount);

      const countdown = setInterval(() => {
        if (currentCount > 1) {
          currentCount--;
          setCount(currentCount);
          HapticService.medium();
          pulseNumber(currentCount);
        } else {
          clearInterval(countdown);
          HapticService.heavy();
          opacity.value = withTiming(0, { duration: 200 });
          scale.value = withTiming(0.5, { duration: 200 });
          setTimeout(() => {
            onComplete();
          }, 200);
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [visible, onComplete]);

  return {
    count,
    animatedStyle,
    textAnimatedStyle,
    ringAnimatedStyle,
  };
}
