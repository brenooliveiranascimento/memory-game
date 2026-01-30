import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { useGameHeaderViewModel } from './GameHeader.viewmodel';

interface GameHeaderProps {
  timeRemaining: number;
  onBack: () => void;
}

export function GameHeader({ timeRemaining, onBack }: GameHeaderProps) {
  const { timeString, isLowTime, isCriticalTime, timerAnimatedStyle } = useGameHeaderViewModel({ timeRemaining });

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <MaterialCommunityIcons name="chevron-left" size={32} color={colors.grayscale.white} />
      </Pressable>

      <Animated.View style={[styles.timerContainer, isCriticalTime && styles.timerContainerCritical, timerAnimatedStyle]}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={20}
          color={isLowTime ? colors.semantic.error : colors.semantic.warning}
        />
        <Text style={[styles.timerText, isLowTime && styles.timerTextLow]}>
          {timeString}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.grayscale.gray500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayscale.gray500,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  timerContainerCritical: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 1,
    borderColor: colors.semantic.error,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.semantic.warning,
  },
  timerTextLow: {
    color: colors.semantic.error,
  },
});
