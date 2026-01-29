import { colors } from "@/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedGroup } from "@/animations";
import { MatchHistoryCard, StatCard } from "./components";
import { useHistoryViewModel } from "./history.viewmodel";

export function HistoryView() {
  const { stats, matches, handleBack } = useHistoryViewModel();

  return (
    <View style={styles.container}>
      <AnimatedGroup exitDirection="left" entryDirection="left">
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.grayscale.white}
            />
          </Pressable>
          <Text style={styles.title}>Histórico de partidas</Text>
        </View>
      </AnimatedGroup>

      <AnimatedGroup
        exitDirection="right"
        entryDirection="right"
        delay={50}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.statsContainer}>
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="gamepad-variant"
                size={28}
                color={colors.accent.purple}
              />
            }
            value={stats.totalGames}
            label="Total de jogos"
            variant="purple"
          />
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="clock-outline"
                size={28}
                color={colors.accent.cyan}
              />
            }
            value={stats.averageTime}
            label="Tempo médio"
            variant="cyan"
          />
        </View>

        <Text style={styles.sectionTitle}>Ranking</Text>

        <View style={styles.matchesSection}>
          {matches.length > 0 ? (
            matches.map((match) => (
              <MatchHistoryCard
                key={match.id}
                title={match.title}
                position={match.position}
                date={match.date}
                time={match.time}
                difficulty={match.difficulty}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="trophy-outline"
                size={64}
                color={colors.grayscale.gray300}
              />
              <Text style={styles.emptyText}>
                Nenhuma partida completada ainda
              </Text>
              <Text style={styles.emptySubtext}>
                Complete desafios para ver seu histórico aqui
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      </AnimatedGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray700,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 28,
    backgroundColor: colors.grayscale.gray500,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.grayscale.gray400,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.grayscale.white,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.grayscale.gray200,
    marginBottom: 16,
  },
  matchesSection: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.grayscale.gray200,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.grayscale.gray300,
    textAlign: "center",
  },
});
