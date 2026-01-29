import { useCallback } from "react";
import { useRouter } from "expo-router";

import { SCREEN_TRANSITION_CONFIG } from "../config/screenTransition.config";
import { useScreenTransitionStore } from "../store/screenTransition.store";

export function useAnimatedNavigation() {
  const router = useRouter();
  const { phase, startExit, startEntry, complete } = useScreenTransitionStore();

  const navigateTo = useCallback(
    (route: string, params?: Record<string, unknown>) => {
      if (phase !== "idle") return;
      startExit(route, params, "push");

      setTimeout(() => {
        if (params) {
          router.push({ pathname: route as never, params });
        } else {
          router.push(route as never);
        }

        setTimeout(() => {
          startEntry();

          setTimeout(() => {
            complete();
          }, SCREEN_TRANSITION_CONFIG.entry.duration);
        }, SCREEN_TRANSITION_CONFIG.buffer);
      }, SCREEN_TRANSITION_CONFIG.exit.duration + SCREEN_TRANSITION_CONFIG.buffer);
    },
    [phase, router, startExit, startEntry, complete]
  );

  const goBack = useCallback(() => {
    if (phase !== "idle") return;
    startExit("", null, "back");

    setTimeout(() => {
      router.back();
      setTimeout(() => {
        startEntry();
        setTimeout(() => complete(), SCREEN_TRANSITION_CONFIG.entry.duration);
      }, SCREEN_TRANSITION_CONFIG.buffer);
    }, SCREEN_TRANSITION_CONFIG.exit.duration + SCREEN_TRANSITION_CONFIG.buffer);
  }, [phase, router, startExit, startEntry, complete]);

  const replaceTo = useCallback(
    (route: string, params?: Record<string, unknown>) => {
      if (phase !== "idle") return;
      startExit(route, params, "replace");

      setTimeout(() => {
        router.replace(route as never);

        setTimeout(() => {
          startEntry();

          setTimeout(() => {
            complete();
          }, SCREEN_TRANSITION_CONFIG.entry.duration);
        }, SCREEN_TRANSITION_CONFIG.buffer);
      }, SCREEN_TRANSITION_CONFIG.exit.duration + SCREEN_TRANSITION_CONFIG.buffer);
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
