import React from "react";
import { Tabs } from "expo-router";
import Icon from "@expo/vector-icons/Ionicons";
import { useGlobalStore } from "@/stores/globalStore";
import { useGetCurrentLocation } from "@/hooks/useGetCurrentLocation";
import { SafeAreaView } from "react-native-safe-area-context";
import AlternativeMap from "../../components/AlternativeMap";

export default function Layout() {
    const { currentLocation } = useGlobalStore(); // Estado global
    const { permissionStatus } = useGetCurrentLocation(); // Obtener el estado del permiso

    // Si no hay ubicación o permisos denegados, mostramos la opción de reintentar
    if (!currentLocation || permissionStatus === 'denied') {
        return (
            <SafeAreaView>
              <AlternativeMap />
          </SafeAreaView>
        );
    }

    return (
        <Tabs sceneContainerStyle={{ borderBottomColor: "blue" }}>
            <Tabs.Screen
                name="home"
                options={{
                    headerTitleAlign: "center",
                    title: '',
                    headerTransparent: true,
                    tabBarIcon: ({ size, color }) => <Icon name="earth-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "",
                    headerShown: false,
                    headerTitleAlign: "center",
                    tabBarIcon: ({ size, color }) => <Icon name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
