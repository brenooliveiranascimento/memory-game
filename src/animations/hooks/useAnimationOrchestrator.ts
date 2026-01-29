import { useEffect, useCallback } from 'react';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAnimationStore } from '../store/animation.store';

interface UseAnimationOrchestratorProps {
  cardId: string;
  onAnimationComplete?: () => void;
}

export function useAnimationOrchestrator({ cardId, onAnimationComplete }: UseAnimationOrchestratorProps) {
  const { getCardState, setCardState } = useAnimationStore();
  const animationState = useSharedValue(getCardState(cardId));

  useEffect(() => {
    animationState.value = getCardState(cardId);
  }, [animationState, cardId, getCardState]);

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  }, []);

  const updateState = useCallback(
    (newState: string) => {
      'worklet';
      runOnJS(setCardState)(cardId, newState as any);
    },
    [cardId, setCardState]
  );

  const notifyCompletion = useCallback(() => {
    'worklet';
    if (onAnimationComplete) {
      runOnJS(onAnimationComplete)();
    }
  }, [onAnimationComplete]);

  return {
    animationState,
    triggerHaptic,
    updateState,
    notifyCompletion,
  };
}
