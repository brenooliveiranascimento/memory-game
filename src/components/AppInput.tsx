import { colors } from "@/constants/colors";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface AppInputProps extends TextInputProps {
  placeholder: string;
}

export function AppInput({ placeholder, ...rest }: AppInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={colors.grayscale.gray300}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    backgroundColor: colors.grayscale.gray500,
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.grayscale.white,
    borderWidth: 1,
    borderColor: colors.grayscale.gray400,
  },
});
