import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";

export default function Report () {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;
    
    const auth = getAuth(getApp());

    const { id } = useLocalSearchParams();
    const queryClient = useQueryClient()

    async function deleteReport () {
        try {
            await fetch(apiUrl + `report/${id}`, { method: "DELETE" })
        } catch (error) {
            alert("Ocurrio un error al eliminar el reporte")
        } finally {
            queryClient.invalidateQueries({ queryKey: ["markets"] })
            router.back()
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: [id],
        queryFn: async () => {
            const response = await fetch(apiUrl + `report/${id}`)
            const data = await response.json()
            return data
        }
    })


    if (isLoading) {
        return (
            <View className="w-full h-full bg-white justify-center items-center py-3 gap-3">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (error) return <Text>Error</Text>

    if (!data._id) {
        return (
            <View className="w-full h-full bg-white justify-center items-center py-3 gap-3">
                <Text className="text-center text-lg font-bold">Reporte no encontrado</Text>
            </View>
        )
    }

    return (
        <View className="p-4 pt-6 gap-y-4 bg-white w-full h-full">
            {data.emailUser === auth.currentUser?.email && (
                <View className="flex-row justify-around">
                    <Button title="eliminar reporte" color="#f55" onPress={deleteReport} />
                    <Button title="editar reporte" color="#2ad" onPress={() => router.push(`/report/${id}/update`)} />
                </View>
            )}
            <View className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">Tipo de transporte: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.type }</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">Titulo: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.title }</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">desde: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.from }</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">hasta: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.to }</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">en direccion a: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.direccion }</Text>
            </View>
            <View  className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">numero: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.numberVehicle }</Text>
            </View>
            <View  className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">asientos: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.quantitySeats }</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">fecha: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.date.split('T')[0] }</Text>
            </View>            
            <View className="flex-row items-center">
                <Text className="font-bold text-lg text-blue-400 underline">hora: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.date.split('T')[1].split('.')[0] }</Text>
            </View>
            <View>
                <Text className="font-bold text-lg text-blue-400 underline">Descripción: </Text>
                <Text className="text-base font-semibold text-gray-600">{ data.description }</Text>
            </View>
            <View>
                <Button title='ver comentarios' onPress={() => router.push(`/(report)/report/${id}/comment`)}/>
            </View>
        </View>
    )
}