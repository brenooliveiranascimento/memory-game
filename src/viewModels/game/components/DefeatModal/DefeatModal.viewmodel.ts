import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface UseDefeatModalViewModelProps {
  visible: boolean;
}

export function useDefeatModalViewModel({ visible }: UseDefeatModalViewModelProps) {
  const translateY = useSharedValue(-1000);
  const opacity = useSharedValue(0);

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
  };
}
