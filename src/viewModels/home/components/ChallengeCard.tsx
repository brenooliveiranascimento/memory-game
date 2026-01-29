import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { usePressAnimation } from "@/animations";

interface ChallengeCardProps {
  id: string;
  title: string;
  gradient: string[];
  arrowColor: string;
  onPress: (id: string) => void;
}

export function ChallengeCard({
  id,
  title,
  gradient,
  arrowColor,
  onPress,
}: ChallengeCardProps) {
  const pressAnimation = usePressAnimation({ scaleActive: 0.98 });

  return (
    <LinearGradient
      colors={gradient as any || ["#121228", "#020916"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.challengeCard}
    >
      <Animated.View style={pressAnimation.animatedStyle}>
        <Pressable
          style={styles.challengeContent}
          onPress={() => onPress(id)}
          onPressIn={pressAnimation.onPressIn}
          onPressOut={pressAnimation.onPressOut}
        >
          <Text style={styles.challengeTitle}>{title}</Text>
          <View
            style={[styles.arrowButton, { backgroundColor: arrowColor }]}
          >
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  challengeCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  challengeContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  arrowIcon: {
    fontSize: 24,
    color: "#000000",
  },
});
