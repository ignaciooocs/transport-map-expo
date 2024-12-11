import Comments from "@/components/Comments";
import { getFirebaseToken } from "@/utils/getFirebaseToken";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Comment() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;
    

    const { id } = useLocalSearchParams();

    const queryClient = useQueryClient()
    const [comment, setComment] = useState("")

    const { data, isLoading, error } = useQuery({
        queryKey: [`comments-${id}`],
        queryFn: async () => {
            const response = await fetch(apiUrl + `comment/report/${id}`)
            const data = await response.json()
            return data
        }
    })

    async function sendComment() {
        // Validar si el comentario está vacío o tiene solo espacios
        if (!comment.trim()) {
            alert("El comentario no puede estar vacío.");
            return;
        }
    
        try {
            const token = await getFirebaseToken();
            if (!token) {
                alert("No se encontró el token de Firebase");
                return;
            }
    
            const response = await fetch(apiUrl + "comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: comment,
                    report: id,
                    date: new Date()
                }),
            });
    
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log("Error al enviar el comentario:", error);
        } finally {
            setComment(""); // Limpiar el campo de comentario
            queryClient.invalidateQueries({ queryKey: [`comments-${id}`] }); // Actualizar la lista de comentarios
        }
    }

    if (isLoading) {
        return (
            <View className="w-full h-full bg-white justify-center items-center py-3 gap-3">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (error) return <Text>Error</Text>


    return (
        <View className="flex flex-col justify-center p-4 bg-white w-full h-full">
            {data.length ?
                <FlatList
                        data={data}
                        renderItem={({ item }) => <Comments comment={item} />}
                        contentContainerStyle={{ gap: 15, height: "80%", width: "100%" }}
                />
                : <View className="w-full h-5/6 justify-center items-center">
                    <Text className="text-base font-semibold text-gray-600">No hay comentarios</Text>
                </View>
            } 
            <View className="flex-row items-center justify-between w-full h-1/6 gap-3">
                <TextInput
                    placeholder="escribe tu comentario"
                    multiline
                    numberOfLines={2}
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    className="border w-2/3 border-gray-300 rounded-md p-2"
                />
                <TouchableOpacity onPress={sendComment} className="w-1/4 bg-blue-500 p-2 rounded-md justify-center items-center">
                    <Text className="text-white text-base">Comentar</Text>
                </TouchableOpacity>
            </View>
        </View>
            
    )
}