import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalStore } from "@/stores/globalStore";
import { getFirebaseToken } from "@/utils/getFirebaseToken";
import { useQueryClient } from '@tanstack/react-query'
import { router } from "expo-router";
import { useUserStore } from "@/stores/userStore";

interface Inputs {
  type: string;
  from: string;
  to: string;
  numberVehicle: number | null;
  quantitySeats: number;
  seats: boolean;
  description: string;
  direccion: string;
  title: string;
}

export default function FormTransport() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;
  const { user } = useUserStore();
  

  const queryClient = useQueryClient()
  const {currentLocation} = useGlobalStore();
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      const token = await getFirebaseToken();
      setToken(token);
    })();
  }, [])

  const [inputs, setInputs] = useState<Inputs>({
    type: "BUS",
    from: "",
    to: "",
    numberVehicle: 0,
    quantitySeats: 0,
    seats: false,
    description: "",
    direccion: "",
    title: "",
  });

  const [expirationTime, setExpirationTime] = useState<number>(60 * 1000 * 15); // Default: 15 minutes

  function handleChange(name: keyof Inputs, value: string | boolean | number) {
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  const validateInputs = (): boolean => {
    if (!inputs.title.trim()) {
      alert("El título es obligatorio.");
      return false;
    }
  
    if (!inputs.from.trim()) {
      alert("El campo 'Desde' es obligatorio.");
      return false;
    }
  
    if (!inputs.to.trim()) {
      alert("El campo 'Hacia' es obligatorio.");
      return false;
    }
  
    if (!inputs.numberVehicle || isNaN(inputs.numberVehicle)) {
      alert("El número del vehículo es obligatorio y debe ser un número válido.");
      return false;
    }
  
    if (inputs.seats && (!inputs.quantitySeats || isNaN(inputs.quantitySeats))) {
      alert("Si hay asientos disponibles, debes indicar la cantidad.");
      return false;
    }
  
    if (!inputs.description.trim()) {
      alert("La descripción es obligatoria.");
      return false;
    }
  
    if (!inputs.direccion.trim()) {
      alert("Debes seleccionar una dirección.");
      return false;
    }
  
    return true;
  };
  
  const onSubmit = async () => {
    if (!validateInputs()) {
      return;
    }
  
    if (!token) {
      alert("No se encontró el token de Firebase");
      return;
    }
  
    try {
      const response = await fetch(apiUrl + 'report', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...inputs,
          expirationTime,
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          date: new Date()
        }),
      });
  
      const data = await response.json();
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['markets'+user.maxDistance] });
  
    } catch (error) {
      console.log("Ocurrió un error al enviar el reporte", error);
      alert("Ocurrió un error al enviar el reporte");
    } finally {
      router.back();
    }
  };
  

  return (
    <ScrollView className="w-full h-full p-4 bg-white">
      <View className="w-full gap-4 pb-8">
      <Text className="text-gray-700 font-semibold text-base">Tiempo de expiración</Text>
        <View className="border border-gray-300 rounded-md">
          <Picker
            selectedValue={expirationTime}
            onValueChange={(value) => setExpirationTime(value)}
            className="text-black"
          >
            <Picker.Item label="1 minuto" value={60 * 1000} />
            <Picker.Item label="15 minutos" value={60 * 1000 * 15} />
            <Picker.Item label="30 minutos" value={60 * 1000 * 30} />
            <Picker.Item label="1 hora" value={60 * 1000 * 60} />
            <Picker.Item label="2 horas" value={60 * 1000 * 120} />
            <Picker.Item label="5 horas" value={60 * 1000 * 300} />
          </Picker>
        </View>
        <View className="gap-y-2">
          <Text className="text-gray-700 font-semibold text-base">Tipo de transporte</Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
            selectedValue={inputs.type}
            onValueChange={(value: string) => handleChange("type", value)}
            className="text-black"
          >
            <Picker.Item label="Bus" value="BUS" />
            <Picker.Item label="Micro" value="MICRO" />
            <Picker.Item label="Colectivo" value="TAXI" />
            <Picker.Item label="Tren" value="METRO" />
            <Picker.Item label="Bus Metro" value="BUSMETRO" />
          </Picker>
          </View> 
        </View>
        <TextInput 
          placeholder={"titulo de " + inputs.type + " o nombre de ruta"}
          value={inputs.title}
          onChangeText={(value) => handleChange("title", value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <View className="flex-row justify-between">
          <TextInput
            placeholder="Desde"
            value={inputs.from}
            onChangeText={(value) => handleChange("from", value)}
            className="border border-gray-300 rounded-md p-2 flex-1 mr-1"
          />
          <TextInput
            placeholder="Hacia"
            value={inputs.to}
            onChangeText={(value) => handleChange("to", value)}
            className="border border-gray-300 rounded-md p-2 flex-1 ml-1"
          />
        </View>

        {inputs.from.trim() && inputs.to.trim() && (
          <View className="gap-y-2">
            <Text className="text-gray-700 font-semibold">Dirección</Text>
            <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={inputs.direccion}
              onValueChange={(value: string) => handleChange("direccion", value)}
              className="text-black"
            >
              <Picker.Item label={inputs.from} value={inputs.from} />
              <Picker.Item label={inputs.to} value={inputs.to} />
            </Picker>
            </View>
          </View>
        )}

        <Text className="text-gray-700 font-semibold text-base">Número de {inputs.type}</Text>
        <TextInput
          placeholder={"Ingrese el número de " + inputs.type}
          value={inputs.numberVehicle?.toString()}
          onChangeText={(value) => handleChange("numberVehicle", Number(value))}
          keyboardType="numeric"
          className="border border-gray-300 rounded-md p-2"
        />

        <View className="flex-row items-center justify-between">
          <Text className="text-gray-700 font-semibold text-base">¿Hay asientos disponibles?</Text>
          <Switch
            value={inputs.seats}
            onValueChange={(value: boolean) => handleChange("seats", value)}
          />
        </View>

        {inputs.seats && (
          <View >
            <Text className="text-gray-700 font-semibold text-base">Cantidad de asientos</Text>
            <TextInput
              placeholder="Ingrese la cantidad de asientos"
              value={inputs.quantitySeats.toString()}
              onChangeText={(value) => handleChange("quantitySeats", Number(value))}
              keyboardType="numeric"
              className="border border-gray-300 rounded-md p-2"
            />
          </View>
        )}

        <TextInput
          placeholder="Información adicional del recorrido"
          value={inputs.description}
          onChangeText={(value) => handleChange("description", value)}
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-md px-2 py-1"
        />

        <View className="flex-row justify-between mt-2 space-x-4">
          <TouchableOpacity
            className="bg-blue-500 rounded-md px-4 py-2 flex-row items-center"
            onPress={onSubmit}
          >
            <Text className="text-white font-semibold mr-1">Enviar</Text>
            <MaterialIcons name="send" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
