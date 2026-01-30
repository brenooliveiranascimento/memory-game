import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { useCountdownOverlayViewModel } from './CountdownOverlay.viewmodel';

interface CountdownOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

export function CountdownOverlay({ visible, onComplete }: CountdownOverlayProps) {
  const { count, animatedStyle, textAnimatedStyle, ringAnimatedStyle } = useCountdownOverlayViewModel({ visible, onComplete });

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.countWrapper}>
        <Animated.View style={[styles.ring, ringAnimatedStyle]} />
        <Animated.View style={[styles.countContainer, animatedStyle]}>
          <Animated.Text style={[styles.countText, textAnimatedStyle]}>
            {count}
          </Animated.Text>
        </Animated.View>
      </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  countWrapper: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  ring: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.accent.purple,
  },
  countContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  countText: {
    fontSize: 72,
    fontWeight: "bold",
  },
});
