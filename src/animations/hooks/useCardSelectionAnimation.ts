import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ANIMATION_TIMINGS } from '../config/animation.config';

export function useCardSelectionAnimation() {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(ANIMATION_TIMINGS.selection.scale, {
      damping: 15,
      stiffness: 300,
    });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
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
