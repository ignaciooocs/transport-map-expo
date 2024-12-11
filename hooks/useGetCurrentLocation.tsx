import { useGlobalStore } from '@/stores/globalStore';
import * as Location from 'expo-location'; 
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Button, Linking } from 'react-native';

export function useGetCurrentLocation() {
    const navigation = useNavigation();
    const { setCurrentLocation } = useGlobalStore();

    function intent() {
        navigation.setOptions({ 
            headerRight: () =>  (
                <Button 
                    title='Activar ubicación' 
                    onPress={() => Linking.openSettings()} 
                />
            )  
        })
    }

    useEffect(() => {
        let locationSubscription: any;

        (async () => {
            // Solicita permisos
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert("Recuerda que para usar todas las funciones de la app es necesario activar la ubicación");
                intent();
                return;
            }

            // let location = await Location.getCurrentPositionAsync({});
            // setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });

            // Suscribirse a actualizaciones de ubicación en tiempo real
            locationSubscription = await Location.watchPositionAsync({ 
              accuracy: Location.Accuracy.High, 
              timeInterval: 5000, // Intervalo de actualización en milisegundos
              distanceInterval: 10 // Distancia mínima (en metros) para activar una actualización
            },
            ({ coords }) => {
              setCurrentLocation({
                latitude: coords.latitude,
                longitude: coords.longitude
              });
            });
        })();

        // Limpiar la suscripción cuando el componente se desmonte
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);
}