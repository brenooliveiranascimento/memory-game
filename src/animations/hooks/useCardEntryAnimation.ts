import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  ANIMATION_EASINGS,
  ANIMATION_TIMINGS,
  ENTRY_ANIMATION_START_POSITIONS,
  SPRING_CONFIGS,
} from "../config/animation.config";
import { useAnimationStore } from "../store/animation.store";

interface UseCardEntryAnimationProps {
  cardIndex: number;
  shouldAnimate: boolean;
}

export function useCardEntryAnimation({
  cardIndex,
  shouldAnimate,
}: UseCardEntryAnimationProps) {
  const { entryAnimationType } = useAnimationStore();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (shouldAnimate) {
      const config = ANIMATION_TIMINGS.entry[entryAnimationType];
      const delay = cardIndex * config.delayBetweenCards;

      if (entryAnimationType === "throw") {
        translateX.value = ENTRY_ANIMATION_START_POSITIONS.throw.x;
        translateY.value = ENTRY_ANIMATION_START_POSITIONS.throw.y;
        rotation.value = -30;

        translateX.value = withDelay(
          delay,
          withSpring(0, SPRING_CONFIGS.entryThrow),
        );

        translateY.value = withDelay(
          delay,
          withSpring(0, SPRING_CONFIGS.entryThrow),
        );

        rotation.value = withDelay(
          delay,
          withSpring(0, SPRING_CONFIGS.entryDeck),
        );
      } else {
        translateX.value = ENTRY_ANIMATION_START_POSITIONS.deck.x;
        translateY.value = ENTRY_ANIMATION_START_POSITIONS.deck.y;

        translateX.value = withDelay(
          delay,
          withTiming(0, {
            duration: config.duration,
            easing: ANIMATION_EASINGS.entry,
          }),
        );

        translateY.value = withDelay(
          delay,
          withTiming(0, {
            duration: config.duration,
            easing: ANIMATION_EASINGS.entry,
          }),
        );
      }

      opacity.value = withDelay(delay, withTiming(1, { duration: 150 }));
      scale.value = withDelay(
        delay,
        withSpring(1, SPRING_CONFIGS.entryScale),
      );
    }
  }, [shouldAnimate, cardIndex, entryAnimationType]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    translateX,
    translateY,
    opacity,
    scale,
    rotation,
  };
}
