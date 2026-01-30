import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { colors, gradients } from '@/constants/colors';
import { useVictoryModalViewModel } from './VictoryModal.viewmodel';
import { usePressAnimation, useModalAnimation, ConfettiEffect } from '@/animations';

interface VictoryModalProps {
  visible: boolean;
  timeElapsed: number;
  moves: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  rankingPosition?: number;
}

export function VictoryModal({ visible, timeElapsed, moves, onPlayAgain, onGoHome, rankingPosition }: VictoryModalProps) {
  const { timeString, getPositionSuffix } = useVictoryModalViewModel({ timeElapsed, rankingPosition });
  const { animatedStyle, close } = useModalAnimation({ visible });

  const playAgainPressAnimation = usePressAnimation();
  const goHomePressAnimation = usePressAnimation();

  const handlePlayAgain = () => {
    close(onPlayAgain);
  };

  const handleGoHome = () => {
    close(onGoHome);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <BlurView intensity={80} tint="dark" style={styles.overlay}>
        <ConfettiEffect
          active={visible}
          burstCount={35}
          continuousCount={2}
          continuousInterval={600}
        />

        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <MaterialCommunityIcons name="trophy" size={64} color={colors.accent.purple} />

          <Text style={styles.title}>Parabéns!</Text>
          <Text style={styles.message}>
            Você concluiu o desafio em <Text style={styles.highlight}>{timeString}</Text>
            {rankingPosition && (
              <>
                {' e conseguiu seu '}
                <Text style={styles.highlight}>
                  {rankingPosition}{getPositionSuffix(rankingPosition)} melhor resultado
                </Text>
              </>
            )}
          </Text>

          <Animated.View style={playAgainPressAnimation.animatedStyle}>
            <LinearGradient
              colors={gradients.colorful}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Pressable
                style={styles.button}
                onPress={handlePlayAgain}
                onPressIn={playAgainPressAnimation.onPressIn}
                onPressOut={playAgainPressAnimation.onPressOut}
              >
                <Text style={styles.buttonText}>Jogar novamente</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={goHomePressAnimation.animatedStyle}>
            <Pressable
              style={styles.secondaryButton}
              onPress={handleGoHome}
              onPressIn={goHomePressAnimation.onPressIn}
              onPressOut={goHomePressAnimation.onPressOut}
            >
              <Text style={styles.secondaryButtonText}>Ver histórico</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContainer: {
    backgroundColor: 'rgba(26, 27, 48, 0.98)',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.grayscale.white,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.grayscale.gray200,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  highlight: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.grayscale.white,
  },
  buttonGradient: {
    borderRadius: 100,
    width: '100%',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.grayscale.white,
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.purple,
  },
});
