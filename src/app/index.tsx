import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace("/(private)/home");
        } else {
          router.replace("/(public)/login");
        }
      }, 100);
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent.purple} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray600,
    alignItems: "center",
    justifyContent: "center",
  },
});
