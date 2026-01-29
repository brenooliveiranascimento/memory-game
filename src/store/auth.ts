import { User } from "@/models/user.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userName: string | null;
  setAuthenticated: (value: boolean, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      userName: null,
      setAuthenticated: (value: boolean, name?: string) => {
        if (value && name) {
          const user: User = {
            id: `user-${Date.now()}`,
            name: name.trim(),
            createdAt: new Date(),
          };
          set({
            isAuthenticated: value,
            userName: name.trim(),
            user,
          });
        } else {
          set({
            isAuthenticated: value,
            userName: null,
            user: null,
          });
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          userName: null,
          user: null,
        });
      },
    }),
    {
      name: "@memory-game:auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
