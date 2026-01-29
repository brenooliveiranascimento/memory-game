import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { useNumberAnimation } from "@/animations";
import { DifficultyIcon } from "@/components/DifficultyIcon";
import { colors } from "@/constants/colors";
import type { Difficulty, DifficultyConfig } from "@/models/challenge.model";

interface DifficultySectionProps {
  selectedDifficulty: Difficulty;
  difficulties: readonly Difficulty[];
  difficultyConfig: DifficultyConfig;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  getDifficultyColor: (difficulty: Difficulty) => string;
  indicatorAnimatedStyle: any;
}

export function DifficultySection({
  selectedDifficulty,
  difficulties,
  difficultyConfig,
  onSelectDifficulty,
  getDifficultyColor,
  indicatorAnimatedStyle,
}: DifficultySectionProps) {
  const { animatedStyle: timeAnimatedStyle } = useNumberAnimation(
    difficultyConfig.estimatedTime,
  );

  return (
    <View style={styles.difficultySection}>
      <View style={styles.difficultyHeader}>
        <Text style={styles.difficultyLabel}>Dificuldade</Text>
        <View style={styles.timeIndicator}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color={colors.accent.green}
          />
          <Animated.Text style={[styles.timeText, timeAnimatedStyle]}>
            {difficultyConfig.estimatedTime}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.difficultyTabs}>
        <Animated.View
          style={[styles.difficultyIndicator, indicatorAnimatedStyle]}
        />
        {difficulties.map((difficulty) => {
          const isSelected = selectedDifficulty === difficulty;
          const diffColor = getDifficultyColor(difficulty);

          return (
            <Pressable
              key={difficulty}
              style={styles.difficultyTab}
              onPress={() => onSelectDifficulty(difficulty)}
            >
              <DifficultyIcon
                difficulty={difficulty}
                color={diffColor}
                isSelected={isSelected}
                inactiveColor={colors.grayscale.gray200}
              />
              <Text
                style={[
                  styles.difficultyText,
                  {
                    color: isSelected
                      ? colors.grayscale.white
                      : colors.grayscale.gray200,
                  },
                ]}
              >
                {difficulty}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  difficultySection: {
    marginBottom: 24,
  },
  difficultyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.grayscale.white,
  },
  timeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grayscale.gray500,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.grayscale.white,
  },
  difficultyTabs: {
    flexDirection: "row",
    borderRadius: 100,
    padding: 4,
    position: "relative",
    borderColor: colors.grayscale.gray400,
    borderWidth: 1,
  },
  difficultyIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 0,
    width: "33.333%",
    backgroundColor: colors.grayscale.gray500,
    borderRadius: 100,
    zIndex: 0,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: colors.grayscale.gray400,
  },
  difficultyTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 100,
    gap: 6,
    zIndex: 1,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
