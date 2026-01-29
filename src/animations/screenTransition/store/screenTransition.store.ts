import { create } from "zustand";

export type TransitionPhase = "idle" | "exiting" | "entering";
export type NavigationType = "push" | "back" | "replace";

interface ScreenTransitionStore {
  phase: TransitionPhase;
  targetRoute: string | null;
  targetParams: Record<string, unknown> | null;
  navigationType: NavigationType;

  startExit: (
    route: string,
    params?: Record<string, unknown> | null,
    type?: NavigationType
  ) => void;
  startEntry: () => void;
  complete: () => void;
}

export const useScreenTransitionStore = create<ScreenTransitionStore>(
  (set) => ({
    phase: "idle",
    targetRoute: null,
    targetParams: null,
    navigationType: "push",

    startExit: (route, params = null, type = "push") => {
      set({
        phase: "exiting",
        targetRoute: route,
        targetParams: params,
        navigationType: type,
      });
    },

    startEntry: () => {
      set({ phase: "entering" });
    },

    complete: () => {
      set({
        phase: "idle",
        targetRoute: null,
        targetParams: null,
      });
    },
  })
);
