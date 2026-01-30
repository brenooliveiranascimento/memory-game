import { useEffect, useRef } from 'react';
import { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat, cancelAnimation } from 'react-native-reanimated';
import { HapticService } from '@/services/haptic.service';

interface UseGameHeaderViewModelProps {
  timeRemaining: number;
}

export function useGameHeaderViewModel({ timeRemaining }: UseGameHeaderViewModelProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isLowTime = timeRemaining <= 30;
  const isCriticalTime = timeRemaining <= 10;

  const scale = useSharedValue(1);
  const lastHapticTime = useRef(timeRemaining);

  useEffect(() => {
    if (isLowTime && timeRemaining > 0) {
      scale.value = withSequence(
        withTiming(1.15, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );

      if (isCriticalTime && timeRemaining !== lastHapticTime.current) {
        HapticService.warning();
        lastHapticTime.current = timeRemaining;
      }
    }

    return () => {
      cancelAnimation(scale);
    };
  }, [timeRemaining, isLowTime, isCriticalTime]);

  useEffect(() => {
    if (isCriticalTime && timeRemaining > 0) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        true
      );
    } else if (!isLowTime) {
      cancelAnimation(scale);
      scale.value = 1;
    }

    return () => {
      cancelAnimation(scale);
    };
  }, [isCriticalTime, isLowTime]);

  const timerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    timeString,
    isLowTime,
    isCriticalTime,
    timerAnimatedStyle,
  };
}
