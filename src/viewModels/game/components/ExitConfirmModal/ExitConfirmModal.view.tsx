import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { colors, gradients } from '@/constants/colors';
import { useModalAnimation, usePressAnimation } from '@/animations';

interface ExitConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExitConfirmModal({ visible, onConfirm, onCancel }: ExitConfirmModalProps) {
  const { animatedStyle, close } = useModalAnimation({ visible });

  const confirmPressAnimation = usePressAnimation();
  const cancelPressAnimation = usePressAnimation();

  const handleConfirm = () => {
    close(onConfirm);
  };

  const handleCancel = () => {
    close(onCancel);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <BlurView intensity={20} style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.semantic.warning} />

          <Text style={styles.title}>Sair do jogo?</Text>
          <Text style={styles.message}>
            Seu progresso atual será perdido.
          </Text>

          <Animated.View style={confirmPressAnimation.animatedStyle}>
            <LinearGradient
              colors={gradients.colorful}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Pressable
                style={styles.button}
                onPress={handleConfirm}
                onPressIn={confirmPressAnimation.onPressIn}
                onPressOut={confirmPressAnimation.onPressOut}
              >
                <Text style={styles.buttonText}>Sair do jogo</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={cancelPressAnimation.animatedStyle}>
            <Pressable
              style={styles.secondaryButton}
              onPress={handleCancel}
              onPressIn={cancelPressAnimation.onPressIn}
              onPressOut={cancelPressAnimation.onPressOut}
            >
              <Text style={styles.secondaryButtonText}>Continuar jogando</Text>
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
    paddingHorizontal: 32,
  },
  modalContainer: {
    backgroundColor: colors.grayscale.gray400,
    borderRadius: 32,
    padding: 40,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.grayscale.white,
    marginTop: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.grayscale.gray200,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonGradient: {
    borderRadius: 100,
    width: '100%',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.grayscale.white,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.grayscale.gray200,
  },
});
