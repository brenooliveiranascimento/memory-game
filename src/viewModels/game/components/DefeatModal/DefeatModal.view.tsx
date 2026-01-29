import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Modal, Pressable, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";

import { useModalAnimation, usePressAnimation } from "@/animations";
import { colors } from "@/constants/colors";

interface DefeatModalProps {
  visible: boolean;
  moves: number;
  onTryAgain: () => void;
  onGoHome: () => void;
}

export function DefeatModal({
  visible,
  moves,
  onTryAgain,
  onGoHome,
}: DefeatModalProps) {
  const { animatedStyle, close } = useModalAnimation({ visible });

  const tryAgainPressAnimation = usePressAnimation();

  const handleTryAgain = () => {
    close(onTryAgain);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <BlurView intensity={10} tint="dark" style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={29}
            color={colors.semantic.error}
          />

          <Text style={styles.title}>Ops, seu tempo acabou!</Text>
          <Text style={styles.message}>
            O tempo para finalizar o desafio terminou. Que tal tentar de novo?
          </Text>

          <Animated.View style={tryAgainPressAnimation.animatedStyle}>
            <Pressable
              style={styles.button}
              onPress={handleTryAgain}
              onPressIn={tryAgainPressAnimation.onPressIn}
              onPressOut={tryAgainPressAnimation.onPressOut}
            >
              <Text style={styles.buttonText}>Jogar novamente</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  modalContainer: {
    backgroundColor: "rgba(26, 27, 48, 0.98)",
    borderRadius: 24,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.grayscale.gray100,
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.grayscale.gray200,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
    fontWeight: 400,
  },
  button: {
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.grayscale.gray400,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.grayscale.white,
  },
});
