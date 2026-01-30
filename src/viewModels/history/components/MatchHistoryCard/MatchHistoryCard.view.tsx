import { DifficultyIcon } from "@/components/DifficultyIcon";
import { colors } from "@/constants/colors";
import { Difficulty } from "@/models/challenge.model";
import { getDifficultyColor } from "@/utils/difficulty";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface MatchHistoryCardProps {
  title: string;
  position: number;
  date: string;
  time: string;
  difficulty: Difficulty;
}

export function MatchHistoryCard({
  title,
  position,
  date,
  time,
  difficulty,
}: MatchHistoryCardProps) {
  const getPositionColor = (pos: number) => {
    if (pos === 1) return "#FFD700";
    if (pos === 2) return colors.grayscale.gray200;
    if (pos === 3) return colors.accent.orange;
    return colors.accent.cyan;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.position, { color: getPositionColor(position) }]}>
          {position}°
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.infoBadge}>
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color={colors.grayscale.gray300}
          />
          <Text style={styles.infoText}>{date}</Text>
        </View>

        <View style={styles.infoBadge}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color={colors.grayscale.gray300}
          />
          <Text style={styles.infoText}>{time}</Text>
        </View>

        <View style={styles.difficultyBadge}>
          <DifficultyIcon
            difficulty={difficulty}
            color={getDifficultyColor(difficulty)}
            isSelected
            inactiveColor={colors.grayscale.gray200}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grayscale.gray450,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    gap: 20,
    borderWidth: 1,
    borderColor: colors.grayscale.gray400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.grayscale.white,
    flex: 1,
  },
  position: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.grayscale.gray400,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.grayscale.gray200,
  },
  difficultyBadge: {
    marginLeft: "auto",
    backgroundColor: colors.grayscale.gray500,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
