import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ANIMATION_TIMINGS, SPRING_CONFIGS } from '../config/animation.config';

export function useCardSelectionAnimation() {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(ANIMATION_TIMINGS.selection.scale, SPRING_CONFIGS.selection);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIGS.selection);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
}
