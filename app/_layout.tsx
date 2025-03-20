import { useUserStore } from "@/stores/userStore";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;
  const [initializing, setInitializing] = useState(true);
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
    if (user) {
      fetchUserDetails(user.email!);
    }
  };

  const fetchUserDetails = async (email: string) => {
    try {
      const response = await fetch(apiUrl + `user/findByEmail/${email}`);
      
      const data = await response.json();
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario desde MongoDB:", { error });
    }
  };

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = authInstance.onAuthStateChanged(onAuthStateChanged);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(main)';

    if (user && !inAuthGroup) {
      router.replace('/(main)/home');
    } else if (!user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
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
