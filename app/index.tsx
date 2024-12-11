import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const goSignIn = () => router.push('/(auth)/sign-in')
  const goSignUp = () => router.push('/(auth)/sign-up')

  return (
    <View
       className="w-full h-full bg-white justify-center items-center py-3 gap-3"
    >
      <View className="w-full h-3/4 bg-white justify-between items-center py-3 gap-3">
      <Text className='text-blue-500 font-bold text-3xl text-center w-1/2'> Bienvenido a Transport Map</Text>
      <Image source={require('../assets/images/icons/map.png')} />
      <View className="w-2/3 flex-row justify-around">
        <TouchableOpacity className="p-3 bg-blue-500 rounded-md" activeOpacity={0.5} onPress={goSignIn}>
          <Text className="text-white text-base">iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-blue-500 rounded-md" activeOpacity={0.5} onPress={goSignUp}>
          <Text className="text-white text-base">Registrarse</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}