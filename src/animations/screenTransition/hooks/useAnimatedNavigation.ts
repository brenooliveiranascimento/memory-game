import { useCallback } from "react";
import { useRouter } from "expo-router";

import { SCREEN_TRANSITION_CONFIG } from "../config/screenTransition.config";
import { useScreenTransitionStore } from "../store/screenTransition.store";
import { createSequence } from "../../utils/sequence.utils";

type NavigationParams = Record<string, string | number | (string | number)[] | null | undefined>;

export function useAnimatedNavigation() {
  const router = useRouter();
  const { phase, startExit, startEntry, complete } = useScreenTransitionStore();

  const navigateTo = useCallback(
    (route: string, params?: NavigationParams) => {
      if (phase !== "idle") return;
      startExit(route, params, "push");

      const exitDelay = SCREEN_TRANSITION_CONFIG.exit.duration + SCREEN_TRANSITION_CONFIG.buffer;
      const entryDelay = SCREEN_TRANSITION_CONFIG.buffer;
      const completeDelay = SCREEN_TRANSITION_CONFIG.entry.duration;

      createSequence()
        .wait(exitDelay)
        .then(() => {
          if (params) {
            router.push({ pathname: route as never, params });
          } else {
            router.push(route as never);
          }
        })
        .wait(entryDelay)
        .then(() => startEntry())
        .wait(completeDelay)
        .then(() => complete())
        .run();
    },
    [phase, router, startExit, startEntry, complete]
  );

  const goBack = useCallback(() => {
    if (phase !== "idle") return;
    startExit("", null, "back");

    const exitDelay = SCREEN_TRANSITION_CONFIG.exit.duration + SCREEN_TRANSITION_CONFIG.buffer;
    const entryDelay = SCREEN_TRANSITION_CONFIG.buffer;
    const completeDelay = SCREEN_TRANSITION_CONFIG.entry.duration;

    createSequence()
      .wait(exitDelay)
      .then(() => router.back())
      .wait(entryDelay)
      .then(() => startEntry())
      .wait(completeDelay)
      .then(() => complete())
      .run();
  }, [phase, router, startExit, startEntry, complete]);

  const replaceTo = useCallback(
    (route: string, params?: NavigationParams) => {
      if (phase !== "idle") return;
      startExit(route, params, "replace");

      const exitDelay = SCREEN_TRANSITION_CONFIG.exit.duration + SCREEN_TRANSITION_CONFIG.buffer;
      const entryDelay = SCREEN_TRANSITION_CONFIG.buffer;
      const completeDelay = SCREEN_TRANSITION_CONFIG.entry.duration;

      createSequence()
        .wait(exitDelay)
        .then(() => router.replace(route as never))
        .wait(entryDelay)
        .then(() => startEntry())
        .wait(completeDelay)
        .then(() => complete())
        .run();
    },
    [phase, router, startExit, startEntry, complete]
  );

  return {
    navigateTo,
    goBack,
    replaceTo,
    phase,
    isTransitioning: phase !== "idle",
  };
}
