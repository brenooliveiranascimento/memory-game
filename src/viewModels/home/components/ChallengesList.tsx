import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import type { ChallengeTheme } from "@/models/challenge.model";
import { ChallengeCard } from "./ChallengeCard";

interface ChallengesListProps {
  challenges: ChallengeTheme[];
  onSelectChallenge: (id: string) => void;
}

export function ChallengesList({
  challenges,
  onSelectChallenge,
}: ChallengesListProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Desafios disponíveis</Text>
      {challenges.map((theme) => (
        <ChallengeCard
          key={theme.id}
          id={theme.id}
          title={theme.title}
          gradient={theme.gradient || ["#121228", "#020916"]}
          arrowColor={theme.arrowColor ?? ""}
          onPress={onSelectChallenge}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.grayscale.white,
    marginBottom: 16,
  },
});
