import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { usePressAnimation } from "@/animations";
import { colors } from "@/constants/colors";

interface HomeHeaderProps {
  userName: string | null;
  onGoToHistory: () => void;
}

export function HomeHeader({ userName, onGoToHistory }: HomeHeaderProps) {
  const trophyPressAnimation = usePressAnimation({ scaleActive: 0.9 });

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Boas vindas, {userName}!</Text>
          <Text style={styles.subtitle}>
            Comece a jogar selecionando os desafios abaixo!
          </Text>
        </View>
        <View>
          <Animated.View
            style={[trophyPressAnimation.animatedStyle, { width: 100 }]}
          >
            <Pressable
              style={styles.trophyIcon}
              onPress={onGoToHistory}
              onPressIn={trophyPressAnimation.onPressIn}
              onPressOut={trophyPressAnimation.onPressOut}
            >
              <MaterialCommunityIcons
                name="trophy"
                size={28}
                color={colors.accent.orange}
              />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.grayscale.gray700,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    maxWidth: "60%",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.grayscale.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grayscale.gray200,
    lineHeight: 20,
  },
  trophyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.grayscale.gray400,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
});
