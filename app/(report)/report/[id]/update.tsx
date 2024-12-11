import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalStore } from "@/stores/globalStore";
import { getFirebaseToken } from "@/utils/getFirebaseToken";
import { useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from "expo-router";
import auth from "@react-native-firebase/auth";
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

interface Props {
  reportId: string; // El ID del reporte que se va a actualizar
}

export default function UpdateFormTransport() {
    const { id } = useLocalSearchParams();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;
  const queryClient = useQueryClient();
  const { currentLocation } = useGlobalStore();
  const { user } = useUserStore();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    // Obtener el token de Firebase
    (async () => {
      const token = await getFirebaseToken();
      setToken(token);
    })();

    // Cargar los datos del reporte para pre-rellenar el formulario
    const fetchReportData = async () => {
      try {
        const response = await fetch(`${"https://transport-map.onrender.com/"}report/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setInputs({
          type: data.type || "BUS",
          from: data.from || "",
          to: data.to || "",
          numberVehicle: data.numberVehicle || 0,
          quantitySeats: data.quantitySeats || 0,
          seats: data.seats || false,
          description: data.description || "",
          direccion: data.direccion || "",
          title: data.title,
        });
      } catch (error) {
        console.log("Ocurrió un error al cargar el reporte", error);
      }
    };

    if (token) fetchReportData();
  }, [token]);

  function handleChange(name: keyof Inputs, value: string | boolean | number) {
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  const onSubmit = async () => {
    setLoading(true);
    if (!token) {
      alert("No se encontró el token de Firebase");
      return;
    }

    try {
      const response = await fetch(`${"https://transport-map.onrender.com/"}report/${id}`, {
        method: "PATCH", // Usar PUT para actualizar
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...inputs,
          latitude: usePredefinedCoordinates && selectedCoordinate ? selectedCoordinate.latitude : currentLocation?.latitude,
          longitude: usePredefinedCoordinates && selectedCoordinate ? selectedCoordinate.longitude : currentLocation?.longitude,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Ocurrió un error al actualizar el reporte", error);
      alert("Ocurrió un error al actualizar el reporte");
    } finally {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: [id] });
      queryClient.invalidateQueries({ queryKey: ["markets" + user.maxDistance] });
      router.back();
    }
  };


  // Estado para controlar si se usan coordenadas predefinidas
const [usePredefinedCoordinates, setUsePredefinedCoordinates] = useState(false);

// Estado para guardar la coordenada seleccionada
const [selectedCoordinate, setSelectedCoordinate] = useState<{
  latitude: number;
  longitude: number;
  label: string;
} | null>(null);

// Coordenadas predefinidas de ciertas calles
const predefinedCoordinates = [
  { label: "AV. Libertad (Viña del Mar)", latitude: -33.012739, longitude: -71.549508 },
  { label: "AV. España (Viña del Mar)", latitude: -33.033766, longitude: -71.594481 },
  { label: "Errazuriz (Valparaíso)", latitude: -33.040548, longitude: -71.624952 },
  { label: "Av. Las Condes (Santiago)", latitude: -33.042516, longitude: -71.373377 },
  { label: "Estacion de metro (Villa Alemana)", latitude: -33.042530, longitude:  -71.373516 },
  { label: "Avda. Fco de Aguirre (La Serena)", latitude: -29.905964, longitude: -71.254207 },
  { label: "Av. Los Carrera (Concepción)", latitude: -36.822202, longitude: -73.049438 },
  { label: "Av. Carlos Condell (Quillota)", latitude: -32.896095, longitude: -71.244209 },
  { label: "Av. Bosques de Montemar (Concón)", latitude: -32.942695, longitude: -71.542829 },
  { label: "Av. Irarrázaval (Papudo)", latitude: -32.505999, longitude:-71.447695  },
];

  return (
    <ScrollView className="w-full h-full p-4 bg-white">
      <View className="w-full gap-4 pb-8">
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
          placeholder={"Titulo de " + inputs.type + " o nombre de ruta"}
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
          <View>
            <Text className="text-gray-700 font-semibold">Dirección</Text>
            <Picker
              selectedValue={inputs.direccion}
              onValueChange={(value: string) => handleChange("direccion", value)}
              className="text-black"
            >
              <Picker.Item label={inputs.from} value={inputs.from} />
              <Picker.Item label={inputs.to} value={inputs.to} />
            </Picker>
          </View>
        )}

        <TextInput
          placeholder={"Ingrese el número de " + inputs.type}
          value={inputs.numberVehicle?.toString() || ""}
          onChangeText={(value) => handleChange("numberVehicle", Number(value || 0))}
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
          <TextInput
            placeholder="Ingrese la cantidad de asientos"
            value={inputs.quantitySeats.toString()}
            onChangeText={(value) => handleChange("quantitySeats", Number(value))}
            keyboardType="numeric"
            className="border border-gray-300 rounded-md p-2"
          />
        )}

        <TextInput
          placeholder="Información adicional del recorrido"
          value={inputs.description}
          onChangeText={(value) => handleChange("description", value)}
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-md px-2 py-1"
        />

        {
        auth().currentUser?.email === "ignacio@email.com" && 
            <View className="flex-row items-center justify-between my-2">
                <Text className="text-gray-700 font-semibold">Usar coordenadas predefinidas</Text>
                <Switch
                    value={usePredefinedCoordinates}
                    onValueChange={(value: boolean) => {
                    setUsePredefinedCoordinates(value);
                    if (!value) {
                        setSelectedCoordinate(null); // Resetea la coordenada si desactivan el switch
                    }
                    }}
                />
            </View>
        }

        {usePredefinedCoordinates && (
        <View className="my-4">
            <Text className="text-gray-700 font-semibold">Seleccionar Calle</Text>
            <View className="border border-gray-300 rounded-md">
            <Picker
                selectedValue={selectedCoordinate?.label || ""}
                onValueChange={(label: string) => {
                const selected = predefinedCoordinates.find(coord => coord.label === label);
                setSelectedCoordinate(selected || null);
                }}
                className="text-black"
            >
                {predefinedCoordinates.map((coord) => (
                <Picker.Item key={coord.label} label={coord.label} value={coord.label} />
                ))}
            </Picker>
            </View>
        </View>
        )}

        <View className="flex-row justify-between mt-2 space-x-4">
          <TouchableOpacity
            className="bg-blue-500 rounded-md px-4 py-2 flex-row items-center"
            onPress={onSubmit}
            disabled={loading}
          >
            {loading && <ActivityIndicator size="small" color="white" />}
            {!loading && (
              <View className="flex-row items-center">
                <Text className="text-white font-semibold mr-1">Actualizar</Text>
                <MaterialIcons name="update" size={16} color="white" />
              </View>
            )}
            
          </TouchableOpacity>
        </View>




      </View>
    </ScrollView>
  );
}
 