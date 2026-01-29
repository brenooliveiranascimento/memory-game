import { LinearGradient } from "expo-linear-gradient";
import {
  ColorValue,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { colors } from "@/constants/colors";
import type { Card } from "@/models/card.model";
import { useGameCardViewModel } from "./GameCard.viewmodel";

interface GameCardProps {
  card: Card;
  cardIndex: number;
  gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
  onPress: (cardId: string) => void;
  disabled: boolean;
  shouldAnimateEntry: boolean;
  gameStatus: string;
}

export function GameCard({
  card,
  cardIndex,
  gradient,
  onPress,
  disabled,
  shouldAnimateEntry,
  gameStatus,
}: GameCardProps) {
  const {
    frontAnimatedStyle,
    backAnimatedStyle,
    handlePress,
    longPressGesture,
    selection,
    entry,
    shake,
    success,
    timeout,
  } = useGameCardViewModel({
    card,
    cardIndex,
    onPress,
    disabled,
    shouldAnimateEntry,
    gameStatus,
  });

  const borderColor =
    card.isMatched || card.isFlipped ? colors.accent.cyan : "transparent";

  return (
    <Animated.View
      style={[
        styles.containerWrapper,
        entry.animatedStyle,
        shake.animatedStyle,
        success.animatedStyle,
        timeout.animatedStyle,
      ]}
    >
      <GestureDetector gesture={longPressGesture}>
        <Pressable
          onPressIn={selection.onPressIn}
          onPressOut={selection.onPressOut}
          onPress={handlePress}
          disabled={disabled || card.isMatched || card.isFlipped}
          style={styles.container}
        >
          <Animated.View
            style={[styles.innerContainer, selection.animatedStyle]}
          >
            <Animated.View
              style={[styles.cardFace, styles.cardFront, frontAnimatedStyle]}
            >
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.cardGradient,
                  {
                    borderColor,
                    borderWidth: card.isMatched || card.isFlipped ? 2 : 0,
                  },
                ]}
              >
                <Image
                  source={require("@/assets/Logo-Transparent.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </LinearGradient>
            </Animated.View>

            <Animated.View
              style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}
            >
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.cardGradient, { borderColor, borderWidth: 2 }]}
              >
                <View style={styles.cardContent}>
                  {card.image ? (
                    <Image
                      source={card.image}
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={require("@/assets/Logo-Transparent.png")}
                      style={styles.logoImageSmall}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.cardText}>{card.value}</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        </Pressable>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    width: "32%",
    height: 130,
    marginBottom: 8,
    borderColor: colors.grayscale.gray400,
    borderWidth: 1,
    borderRadius: 16,
  },
  container: {
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 2,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  logoImage: {
    width: "50%",
    height: "50%",
    opacity: 0.3,
  },
  cardContent: {
    alignItems: "center",
    gap: 4,
  },
  cardImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  logoImageSmall: {
    width: 24,
    height: 24,
  },
  cardText: {
    color: colors.grayscale.gray100,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
});
