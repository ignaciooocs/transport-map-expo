import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link } from "expo-router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState({
    email: false,
    password: false,
  });

  const validateInputs = () => {
    // Verifica que el correo no esté vacío y tenga un formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      alert("Por favor ingresa un correo electrónico válido.");
      return false;
    }

    // Verifica que la contraseña no esté vacía y tenga al menos 6 caracteres
    if (!password.trim() || password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const signIn = async () => {
    if (!validateInputs()) return; // Si la validación falla, detiene el flujo

    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      const err = error as FirebaseError;
      alert("Inicio de sesión fallido: " + err.message);
    } finally {
      console.log("Inicio de sesión finalizado");
    }
  };

  return (
    <View className="w-full h-full bg-white pt-8 items-center ">
      <KeyboardAvoidingView className="w-4/5 gap-y-3 outline-4 outline-blue-400" behavior="padding">
        <Text>Correo electrónico</Text>
        <TextInput
          placeholder="Escribe tu correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className={`p-3 bg-gray-200 rounded-md border-2 border-transparent ${
            focus.email ? "border-2 border-blue-500" : ""
          }`}
          onFocus={() => setFocus({ email: true, password: false })}
          onBlur={() => setFocus({ email: false, password: false })}
        />
        <Text>Contraseña</Text>
        <TextInput
          placeholder="Escribe tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className={`p-3 bg-gray-200 rounded-md border-2 border-transparent ${
            focus.password ? "border-2 border-blue-500" : ""
          }`}
          onFocus={() => setFocus({ email: false, password: true })}
          onBlur={() => setFocus({ email: false, password: false })}
        />
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={signIn}
            className="justify-center items-center p-3 bg-blue-500 rounded-md w-1/3"
          >
            <Text className="text-white text-lg">Iniciar</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-base">
            ¿No tienes una cuenta?{" "}
            <Link href="/(auth)/sign-up" className="text-blue-500 underline">
              Regístrate
            </Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
