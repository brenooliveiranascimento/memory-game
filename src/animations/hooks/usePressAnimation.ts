import { useCallback } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface UsePressAnimationConfig {
  scaleActive?: number;
  springConfig?: {
    damping?: number;
    stiffness?: number;
  };
}

export function usePressAnimation({
  scaleActive = 0.95,
  springConfig = { damping: 15, stiffness: 150 },
}: UsePressAnimationConfig = {}) {
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleActive, springConfig);
  }, [scale, scaleActive, springConfig]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, springConfig);
  }, [scale, springConfig]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    width: "100%",
  }));

  return {
    onPressIn,
    onPressOut,
    animatedStyle,
  };
}
