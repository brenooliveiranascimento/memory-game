import { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import {
  SCREEN_TRANSITION_CONFIG,
  SCREEN_TRANSITION_EASINGS,
} from "../config/screenTransition.config";
import { useScreenTransitionStore } from "../store/screenTransition.store";

export type TransitionDirection = "left" | "right" | "up" | "down";

interface AnimatedGroupProps {
  exitDirection?: TransitionDirection;
  entryDirection?: TransitionDirection;
  delay?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

function getDistance(direction: TransitionDirection): { x: number; y: number } {
  const { horizontal, vertical } = SCREEN_TRANSITION_CONFIG.distance;

  switch (direction) {
    case "left":
      return { x: -horizontal, y: 0 };
    case "right":
      return { x: horizontal, y: 0 };
    case "up":
      return { x: 0, y: -vertical };
    case "down":
      return { x: 0, y: vertical };
    default:
      return { x: 0, y: 0 };
  }
}

export function AnimatedGroup({
  exitDirection = "left",
  entryDirection = "left",
  delay = 0,
  children,
  style,
}: AnimatedGroupProps) {
  const { phase } = useScreenTransitionStore();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (phase === "exiting") {
      const exitDistance = getDistance(exitDirection);

      translateX.value = withDelay(
        delay,
        withTiming(exitDistance.x, {
          duration: SCREEN_TRANSITION_CONFIG.exit.duration,
          easing: SCREEN_TRANSITION_EASINGS.exit,
        })
      );
      translateY.value = withDelay(
        delay,
        withTiming(exitDistance.y, {
          duration: SCREEN_TRANSITION_CONFIG.exit.duration,
          easing: SCREEN_TRANSITION_EASINGS.exit,
        })
      );
      opacity.value = withDelay(
        delay,
        withTiming(0, {
          duration: SCREEN_TRANSITION_CONFIG.exit.duration * 0.8,
        })
      );
    } else if (phase === "entering") {
      const entryDistance = getDistance(entryDirection);
      translateX.value = entryDistance.x;
      translateY.value = entryDistance.y;
      opacity.value = 0;

      translateX.value = withDelay(
        delay,
        withTiming(0, {
          duration: SCREEN_TRANSITION_CONFIG.entry.duration,
          easing: SCREEN_TRANSITION_EASINGS.entry,
        })
      );
      translateY.value = withDelay(
        delay,
        withTiming(0, {
          duration: SCREEN_TRANSITION_CONFIG.entry.duration,
          easing: SCREEN_TRANSITION_EASINGS.entry,
        })
      );
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: SCREEN_TRANSITION_CONFIG.entry.duration * 0.8,
        })
      );
    } else if (phase === "idle") {
      translateX.value = 0;
      translateY.value = 0;
      opacity.value = 1;
    }
  }, [phase, exitDirection, entryDirection, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
