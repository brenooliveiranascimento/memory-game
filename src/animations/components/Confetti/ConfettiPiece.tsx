import { memo, useEffect, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ConfettiPieceProps {
  color: string;
  startX: number;
  delay: number;
  duration: number;
  size: number;
  shape: "square" | "rectangle" | "circle";
  swingDirection: number;
  swingAmount: number;
  rotationSpeed: number;
}

function ConfettiPieceComponent({
  color,
  startX,
  delay,
  duration,
  size,
  shape,
  swingDirection,
  swingAmount,
  rotationSpeed,
}: ConfettiPieceProps) {
  const progress = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.linear }),
    );

    rotateZ.value = withDelay(
      delay,
      withTiming(360 * rotationSpeed * swingDirection, {
        duration,
        easing: Easing.linear,
      }),
    );
  }, [delay, duration, progress, rotateZ, rotationSpeed, swingDirection]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [-50, SCREEN_HEIGHT + 100],
    );

    const swingPhase = progress.value * Math.PI * 6;
    const translateX = Math.sin(swingPhase) * swingAmount * swingDirection;

    return {
      transform: [
        { translateY },
        { translateX },
        { rotateZ: `${rotateZ.value}deg` },
      ],
      opacity: interpolate(progress.value, [0, 0.05, 0.9, 1], [0, 1, 1, 0]),
    };
  });

  const shapeStyle = useMemo(() => {
    if (shape === "circle") return { borderRadius: size / 2 };
    if (shape === "rectangle") return { width: size * 0.4, height: size };
    return { width: size, height: size };
  }, [shape, size]);

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: startX,
          backgroundColor: color,
          width: size,
          height: size,
          ...shapeStyle,
        },
        animatedStyle,
      ]}
    />
  );
}

export const ConfettiPiece = memo(ConfettiPieceComponent);

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    top: 0,
  },
});
