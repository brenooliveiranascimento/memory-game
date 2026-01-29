import { AppInput } from "@/components/AppInput";
import { colors, gradients } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLoginViewModel } from "./login.viewmodel";

export default function LoginView() {
  const router = useRouter();
  const { name, isLoading, error, setName, handleLogin } = useLoginViewModel();

  const onLoginPress = async () => {
    const success = await handleLogin();
    if (success) {
      router.replace("/(private)/home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>memory game</Text>
          <Text style={styles.subtitle}>
            Teste sua memória enquanto aprende!
          </Text>
        </View>

        <View style={styles.formContainer}>
          <AppInput
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={onLoginPress}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <LinearGradient
            colors={gradients.colorful}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={onLoginPress}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray700,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 71,
    height: 71,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.grayscale.gray100,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.grayscale.gray200,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    gap: 16,
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: 14,
    textAlign: "center",
    marginTop: -8,
  },
  buttonGradient: {
    borderRadius: 50,
    width: "100%",
  },
  button: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.grayscale.white,
  },
});
