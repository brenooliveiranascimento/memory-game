import { ScrollView, StyleSheet, View } from "react-native";

import { AnimatedGroup } from "@/animations";
import { colors } from "@/constants/colors";
import { ChallengesList, DifficultySection, HomeHeader } from "./components";
import { useHomeViewModel } from "./home.viewmodel";

export function HomeView() {
  const {
    userName,
    challengeThemes,
    handleSelectChallenge,
    handleGoToHistory,
  } = useHomeViewModel();

  return (
    <View style={styles.container}>
      <AnimatedGroup exitDirection="left" entryDirection="left">
        <HomeHeader userName={userName} onGoToHistory={handleGoToHistory} />
      </AnimatedGroup>

      <AnimatedGroup
        exitDirection="right"
        entryDirection="right"
        delay={50}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <DifficultySection />

          <ChallengesList
            challenges={challengeThemes.slice(0, 3)}
            onSelectChallenge={handleSelectChallenge}
          />
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
