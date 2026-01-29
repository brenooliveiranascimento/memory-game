import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useCountdownOverlayViewModel } from './CountdownOverlay.viewmodel';

interface CountdownOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

export function CountdownOverlay({ visible, onComplete }: CountdownOverlayProps) {
  const { count, animatedStyle } = useCountdownOverlayViewModel({ visible, onComplete });

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.countContainer, animatedStyle]}>
        <Text style={styles.countText}>{count}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  countContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 72,
    fontWeight: "bold",
    color: colors.grayscale.white,
  },
});
