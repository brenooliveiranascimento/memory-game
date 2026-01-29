import { useCallback } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { SPRING_CONFIGS } from "../config/animation.config";

interface UsePressAnimationConfig {
  scaleActive?: number;
  springConfig?: WithSpringConfig;
}

export function usePressAnimation({
  scaleActive = 0.95,
  springConfig = SPRING_CONFIGS.press,
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
