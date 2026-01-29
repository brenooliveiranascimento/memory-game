import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { AnimatedGroup } from "@/animations";
import { CardGrid } from "./components/CardGrid/CardGrid.view";
import { CountdownOverlay } from "./components/CountdownOverlay/CountdownOverlay.view";
import { DefeatModal } from "./components/DefeatModal/DefeatModal.view";
import { ExitConfirmModal } from "./components/ExitConfirmModal/ExitConfirmModal.view";
import { GameHeader } from "./components/GameHeader/GameHeader.view";
import { VictoryModal } from "./components/VictoryModal/VictoryModal.view";
import { useGameViewHandlers } from "./game.viewmodel";

export function GameView() {
  const {
    challenge,
    cards,
    status,
    timeRemaining,
    timeElapsed,
    moves,
    selectCard,
    showVictoryModal,
    showDefeatModal,
    showExitModal,
    showCountdown,
    shouldAnimateEntry,
    handleCountdownComplete,
    handlePlayAgain,
    handleTryAgain,
    handleGoToHistory,
    handleBack,
    handleConfirmExit,
    handleCancelExit,
    disabled,
  } = useGameViewHandlers();

  return (
    <View style={styles.container}>
      <AnimatedGroup exitDirection="left" entryDirection="left">
        <GameHeader timeRemaining={timeRemaining} onBack={handleBack} />
      </AnimatedGroup>

      <AnimatedGroup exitDirection="right" entryDirection="right" delay={50}>
        <View style={styles.gameInfo}>
          <Text style={styles.title}>{challenge?.title}</Text>
          <Text style={styles.subtitle}>
            Encontre todos os pares dentro do tempo!
          </Text>
        </View>

        <View style={styles.content}>
          {shouldAnimateEntry && (
            <CardGrid
              cards={cards}
              onCardPress={selectCard}
              disabled={disabled}
              shouldAnimateEntry={shouldAnimateEntry}
              gameStatus={status}
            />
          )}
        </View>
      </AnimatedGroup>

      <VictoryModal
        visible={showVictoryModal}
        timeElapsed={timeElapsed}
        moves={moves}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoToHistory}
      />

      <DefeatModal
        visible={showDefeatModal}
        moves={moves}
        onTryAgain={handleTryAgain}
        onGoHome={handleGoToHistory}
      />

      <ExitConfirmModal
        visible={showExitModal}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />

      <CountdownOverlay
        visible={showCountdown}
        onComplete={handleCountdownComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray700,
  },
  gameInfo: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.grayscale.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grayscale.gray200,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
});
