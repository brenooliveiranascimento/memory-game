import { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat } from 'react-native-reanimated';
import { ANIMATION_TIMINGS } from '../config/animation.config';

export function useCardShakeAnimation() {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);

  const shake = () => {
    const { distance, duration, repeat } = ANIMATION_TIMINGS.shake;
    const singleShakeDuration = duration / (repeat * 4);

    translateX.value = withSequence(
      withTiming(distance, { duration: singleShakeDuration }),
      withRepeat(
        withSequence(
          withTiming(-distance, { duration: singleShakeDuration * 2 }),
          withTiming(distance, { duration: singleShakeDuration * 2 })
        ),
        repeat - 1,
        false
      ),
      withTiming(0, { duration: singleShakeDuration })
    );

    rotation.value = withSequence(
      withTiming(5, { duration: singleShakeDuration }),
      withRepeat(
        withSequence(
          withTiming(-5, { duration: singleShakeDuration * 2 }),
          withTiming(5, { duration: singleShakeDuration * 2 })
        ),
        repeat - 1,
        false
      ),
      withTiming(0, { duration: singleShakeDuration })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotateZ: `${rotation.value}deg` }],
  }));

  return {
    animatedStyle,
    shake,
  };
}
