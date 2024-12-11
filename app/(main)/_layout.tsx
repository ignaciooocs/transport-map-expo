import React from "react"
import { Tabs } from "expo-router"
import Icon from '@expo/vector-icons/Ionicons'
import { useGetCurrentLocation } from "@/hooks/useGetCurrentLocation";
import { useGlobalStore } from "@/stores/globalStore";

export default function Layout () {
    const { currentLocation } = useGlobalStore();
    useGetCurrentLocation();

    if (!currentLocation?.latitude || !currentLocation?.longitude) return null
    
    return (
        <Tabs sceneContainerStyle={{ borderBottomColor: "blue" }}>
            <Tabs.Screen name="home" options={{
                headerTitleAlign: "center",
                title: "Mapa",
                tabBarIcon: ({ size, color }) => <Icon name="earth-outline" size={size} color={color}  />
            }} />
            <Tabs.Screen name="profile" options={{
                title: "Perfil",
                headerTitleAlign: "center",
                tabBarIcon: ({ size, color }) => <Icon name="person-outline" size={size} color={color} />
            }}
            />
        </Tabs>
    )
}