import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link } from "expo-router";

export default function SignUp() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focus, setFocus] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateInputs = () => {
    // Verificar que el correo no esté vacío y tenga un formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      alert("Por favor ingresa un correo electrónico válido.");
      return false;
    }

    // Verificar que la contraseña no esté vacía y tenga al menos 6 caracteres
    if (!password.trim() || password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return false;
    }

    return true;
  };

  const signUp = async () => {
    if (!validateInputs()) return; // Si la validación falla, detiene el flujo

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      if (userCredential) {
        // Solo realiza la solicitud a tu backend si el registro en Firebase fue exitoso
        const response = await fetch("https://transport-map.onrender.com/" + "user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        });

        const data = await response.json();
        console.log("Usuario guardado en la base de datos", data);

        if (!response.ok) {
          throw new Error("Error al guardar el usuario en la base de datos");
        }
      }
    } catch (error) {
      const err = error as FirebaseError;
      alert("Registro fallido: " + err.message);
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
          onFocus={() => setFocus({ ...focus, email: true })}
          onBlur={() => setFocus({ ...focus, email: false })}
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
          onFocus={() => setFocus({ ...focus, password: true })}
          onBlur={() => setFocus({ ...focus, password: false })}
        />
        <Text>Confirmar contraseña</Text>
        <TextInput
          placeholder="Confirma tu contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          className={`p-3 bg-gray-200 rounded-md border-2 border-transparent ${
            focus.confirmPassword ? "border-2 border-blue-500" : ""
          }`}
          onFocus={() => setFocus({ ...focus, confirmPassword: true })}
          onBlur={() => setFocus({ ...focus, confirmPassword: false })}
        />
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={signUp}
            className="justify-center items-center p-3 bg-blue-500 rounded-md w-1/3"
          >
            <Text className="text-white text-lg">Crear</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-base">
            ¿Ya tienes cuenta?{" "}
            <Link href="/(auth)/sign-in" className="text-blue-500 underline">
              Iniciar sesión
            </Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
