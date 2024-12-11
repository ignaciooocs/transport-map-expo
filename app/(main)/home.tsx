import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"
import AlternativeMap from "../../components/AlternativeMap";
import { useGlobalStore } from "@/stores/globalStore";
import { useQuery } from "@tanstack/react-query";
import Icon from "@expo/vector-icons/Ionicons";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useUserStore } from "@/stores/userStore";

export default function Home() {
    const { currentLocation } = useGlobalStore();
    const { user } = useUserStore();
    const navigate = useNavigation();
    const [loading, setLoading] = useState(false)

    const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['markets' + user.maxDistance],
        queryFn: async () => {
            try {
                const response = await fetch(`${apiUrl}report/nearby?longitude=${currentLocation?.longitude}&latitude=${currentLocation?.latitude}&maxDistance=${user.maxDistance}`);
                const data = await response.json();
                console.log(data);
                return data
            } catch (error) {
                return null
            }
        },
        enabled: user.maxDistance !== undefined, 
    })

    function handleRefetch() {
        setLoading(true)
        setTimeout(() => {
            refetch()
            setLoading(false)
        }, 1000)
    }


    useEffect(() => {
        navigate.setOptions({ 
            headerRight: () => (
                <TouchableOpacity className="mr-2" onPress={handleRefetch}>
                    <SimpleLineIcons className="pr-4" name="refresh" size={24} color="black" />
                </TouchableOpacity>
            )
         })
    }, [])

    function handleType(type: string) {
        if (type === 'TAXI') return require('../../assets/images/icons/taxi.png') 
        else if (type === 'MICRO') return require('../../assets/images/icons/micro.png')
        else if (type === 'METRO') return require('../../assets/images/icons/train.png')
        else if (type === 'BUSMETRO') return require('../../assets/images/icons/bus-metro.png')
        else if (type === 'BUS') return require('../../assets/images/icons/bus.png')
        else return null
    }

    if (!currentLocation?.latitude || !currentLocation?.longitude) return <AlternativeMap />

    if (isLoading) return <ActivityIndicator size="large" />
    if (error) return <View>Error</View>

    return (
        <View className="w-full h-full">
            <MapView 
                provider={PROVIDER_GOOGLE} 
                style={{width: "100%", height: "100%" }}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            >
                <Marker 
                    coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }} 
                    icon={require('../../assets/images/icons/location.png')} 
                    title="Mi ubicación"
                />
                { data && 
                    data.map((market: any) => (
                        <Marker 
                            key={market._id} 
                            icon={handleType(market.type)}
                            coordinate={{ 
                                latitude: market.latitude, 
                                longitude: market.longitude 
                            }} 
                            onPress={() => router.push(`/report/${market._id}`)}
                            title={market.title}
                            description={market.description}
                        />
                    ))

                }
            </MapView>
            <TouchableOpacity 
                className="absolute bottom-8 left-8 bg-white p-3 rounded-full" 
                onPress={() => router.navigate('/(report)/report-add')}
            >
                <Icon name="add" size={32} color="black" />
            </TouchableOpacity>
            { loading && (
                <View className="w-full h-full absolute bg-black opacity-50 p-3 items-center justify-center">
                    <ActivityIndicator size="large" color="white" />
                </View>
            ) }
        </View>
    )
}