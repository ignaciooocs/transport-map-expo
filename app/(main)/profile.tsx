import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseToken } from "@/utils/getFirebaseToken";
import { useUserStore } from "@/stores/userStore";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

export default function Profile() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;
    console.log("https://transport-map.onrender.com/");
    const [token, setToken] = useState("");
    const { user, setUser } = useUserStore();
    const [loading, setLoading] = useState(false);
    console.log(user);
    const [selectedDistance, setSelectedDistance] = useState(user.maxDistance || 5000); // Valor inicial en km

    useEffect(() => {
        (async () => {
            await getFirebaseToken()
                .then((token) => {
                    console.log(token);
                    setToken(token);
                })
                .catch((error) => console.log(error));
        })();
    }, []);

    const signOut = async () => {
        try {
            await auth().signOut();
        } catch (error) {
            console.log(error);
        }
    };

    // Función para manejar la actualización de la distancia
    const updateDistance = async () => {
        setLoading(true);
        if (user && user.email) {
            try {
                const response = await fetch("https://transport-map.onrender.com/" +'user/distance', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ distance: selectedDistance }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error('Error al actualizar la distancia');
                }

                console.log(selectedDistance);
                setUser(data);
                console.log(data);
                console.log('Distancia actualizada');
            } catch (error) {
                console.error('Error al actualizar la distancia:', error);
            } finally {
                setLoading(false);
                router.push('/(main)/home');
            }
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-100 p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Mi Perfil</Text>
            <Image
                source={require("../../assets/images/icons/profile.png")}
                className="w-24 h-24 rounded-full mb-6"
            />
            <Text className="text-lg text-gray-600 mb-8">
                Correo: {auth().currentUser?.email}
            </Text>
            <TouchableOpacity
                className="bg-blue-500 py-3 px-6 rounded-lg"
                onPress={signOut}
            >
                <Text className="text-white font-bold text-lg">Cerrar sesión</Text>
            </TouchableOpacity>

            {/* Picker para seleccionar la distancia */}
            <View className="w-full mt-6">
                <Text className="text-lg text-gray-700 mb-2">Selecciona la distancia máxima:</Text>
                <Text className="text-sm text-gray-700 mb-2 font-bold">Actualmente tu rango es de {user?.maxDistance / 1000} km</Text>
                <Picker
                    selectedValue={selectedDistance}
                    onValueChange={(itemValue) => setSelectedDistance(itemValue)}
                    style={{
                        height: 50,
                        width: '100%',
                        backgroundColor: '#fff',
                        borderRadius: 8,
                        borderColor: '#ddd',
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        fontSize: 16,
                    }}
                >
                    <Picker.Item label="5 km" value={5000} />
                    <Picker.Item label="50 km" value={50000} />
                    <Picker.Item label="100 km" value={100000} />
                    <Picker.Item label="200 km" value={200000} />
                    <Picker.Item label="500 km" value={500000} />
                    <Picker.Item label="1000 km" value={1000000} />
                    <Picker.Item label="2000 km" value={2000000} />
                    <Picker.Item label="5000 km" value={5000000} />
                    <Picker.Item label="10000 km" value={10000000} />
                </Picker>
            </View>

            <TouchableOpacity
                className="bg-blue-500 py-3 px-6 rounded-lg mt-6"
                onPress={updateDistance}
                disabled={loading}
            >
                {loading 
                ? <ActivityIndicator size="small" color="white" />
                : <Text className="text-white font-bold text-lg">Actualizar Distancia</Text>
                }
            </TouchableOpacity>
        </View>
    );
}
