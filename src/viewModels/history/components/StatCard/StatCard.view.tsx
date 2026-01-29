import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  variant?: "purple" | "cyan";
}

export function StatCard({
  icon,
  value,
  label,
  variant = "purple",
}: StatCardProps) {
  const valueColor =
    variant === "purple" ? colors.accent.purple : colors.accent.cyan;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        <View style={styles.iconContainer}>{icon}</View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: colors.grayscale.gray400,
    height: 93,
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 16,
    paddingLeft: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  iconContainer: {
    marginBottom: 16,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.grayscale.gray200,
  },
});
