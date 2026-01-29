import { useEffect, useRef } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, interpolate, withSpring, cancelAnimation, runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

import type { Card } from '@/models/card.model';
import {
  useCardEntryAnimation,
  useCardShakeAnimation,
  useCardSuccessAnimation,
  useCardSelectionAnimation,
  useCardTimeoutAnimation,
  useAnimationStore,
  ANIMATION_TIMINGS,
} from '@/animations';

interface UseGameCardViewModelProps {
  card: Card;
  cardIndex: number;
  onPress: (cardId: string) => void;
  disabled: boolean;
  shouldAnimateEntry: boolean;
  gameStatus: string;
}

export function useGameCardViewModel({
  card,
  cardIndex,
  onPress,
  disabled,
  shouldAnimateEntry,
  gameStatus,
}: UseGameCardViewModelProps) {
  const rotation = useSharedValue(card.isFlipped ? 180 : 0);
  const longPressProgress = useSharedValue(0);
  const previousMatchState = useRef(card.isMatched);
  const previousFlippedState = useRef(card.isFlipped);
  const hasFallen = useRef(false);
  const { isAnimating } = useAnimationStore();

  const entry = useCardEntryAnimation({
    cardIndex,
    shouldAnimate: shouldAnimateEntry,
  });

  const selection = useCardSelectionAnimation();
  const shake = useCardShakeAnimation();
  const success = useCardSuccessAnimation();
  const timeout = useCardTimeoutAnimation();

  const flipCard = () => {
    if (!disabled && !card.isMatched && !card.isFlipped && !isAnimating) {
      onPress(card.id);
    }
  };

  const longPressGesture = Gesture.LongPress()
    .minDuration(100)
    .onStart(() => {
      if (disabled || card.isMatched || card.isFlipped || isAnimating) return;

      longPressProgress.value = withTiming(180, {
        duration: 800,
      }, (finished) => {
        if (finished && longPressProgress.value >= 126) {
          runOnJS(flipCard)();
        }
      });
    })
    .onEnd(() => {
      if (longPressProgress.value >= 126) {
        runOnJS(flipCard)();
      }
      longPressProgress.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
        mass: 0.5,
      });
    })
    .onFinalize(() => {
      if (longPressProgress.value < 126) {
        longPressProgress.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        });
      }
    });

  useEffect(() => {
    rotation.value = withTiming(card.isFlipped ? 180 : 0, {
      duration: 300,
    });
  }, [card.isFlipped]);

  useEffect(() => {
    if (card.isMatched && !previousMatchState.current) {
      success.playSuccess();
      setTimeout(() => {
        success.fadeOut();
      }, 600);
    }
    previousMatchState.current = card.isMatched;
  }, [card.isMatched]);

  useEffect(() => {
    const wasFlipped = previousFlippedState.current;
    const isNowFlipped = card.isFlipped;

    if (wasFlipped && !isNowFlipped && !card.isMatched) {
      shake.shake();
    }

    previousFlippedState.current = isNowFlipped;
  }, [card.isFlipped]);

  useEffect(() => {
    if (gameStatus === 'timeout' && !card.isMatched && !hasFallen.current) {
      hasFallen.current = true;
      const randomDelay = Math.random() * ANIMATION_TIMINGS.fall.maxRandomDelay;
      timeout.fall(randomDelay);
    }
  }, [gameStatus, card.isMatched, timeout.fall, card.value]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const currentRotation = rotation.value + longPressProgress.value;
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${interpolate(currentRotation, [0, 180], [0, 180])}deg` },
      ],
      opacity: interpolate(currentRotation, [0, 90, 180], [1, 0, 0]),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const currentRotation = rotation.value + longPressProgress.value;
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${interpolate(currentRotation, [0, 180], [180, 360])}deg` },
      ],
      opacity: interpolate(currentRotation, [0, 90, 180], [0, 0, 1]),
    };
  });

  const handlePress = () => {
    if (!disabled && !card.isMatched && !card.isFlipped && !isAnimating) {
      onPress(card.id);
    }
  };

  return {
    frontAnimatedStyle,
    backAnimatedStyle,
    handlePress,
    longPressGesture,
    selection,
    entry,
    shake,
    success,
    timeout,
  };
}
