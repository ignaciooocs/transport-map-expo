import { useUserStore } from "@/stores/userStore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { QueryClientProvider, QueryClient} from '@tanstack/react-query'

const queryClient = new QueryClient();

export default function RootLayout() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;

  const [initializing, setInitializing] = useState(true);
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log(user)
    setUser(user);
    if (initializing) setInitializing(false);
    // Si el usuario está autenticado, traemos más información de su perfil desde MongoDB
    if (user) {
      fetchUserDetails(user.email!); // Usamos el email del usuario para hacer la solicitud
    }
};

const fetchUserDetails = async (email: string) => {
  try {
    const response = await fetch(apiUrl + `user/findByEmail/${email}`);
    const data = await response.json();
    console.log(data); // Ver los datos que recibimos

    if (data) {
      setUser(data); // Combina los datos del usuario con los que ya están en el estado
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario desde MongoDB:", error);
  }
};


  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return () => subscriber()
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(main)';

    if (user && !inAuthGroup) {
      router.replace('/(main)/home')
    } else if (!user && inAuthGroup) {
      router.replace('/')
    }
  }, [user, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(report)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
