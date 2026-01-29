import { ScrollView, StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";
import { AnimatedGroup } from "@/animations";
import { ChallengesList, DifficultySection, HomeHeader } from "./components";
import { useHomeViewModel } from "./home.viewmodel";

export function HomeView() {
  const {
    userName,
    selectedDifficulty,
    difficulties,
    difficultyConfig,
    challengeThemes,
    handleSelectDifficulty,
    handleSelectChallenge,
    handleGoToHistory,
    getDifficultyColor,
    indicatorAnimatedStyle,
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
          <DifficultySection
            selectedDifficulty={selectedDifficulty}
            difficulties={difficulties}
            difficultyConfig={difficultyConfig}
            onSelectDifficulty={handleSelectDifficulty}
            getDifficultyColor={getDifficultyColor}
            indicatorAnimatedStyle={indicatorAnimatedStyle}
          />

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

