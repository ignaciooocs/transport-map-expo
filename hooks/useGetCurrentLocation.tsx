import { useGlobalStore } from '@/stores/globalStore';
import * as Location from 'expo-location'; 
import * as Updates from 'expo-updates'; // Importar expo-updates
import { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';

export function useGetCurrentLocation() {
    const { setCurrentLocation } = useGlobalStore();
    const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | null | Location.PermissionStatus>(null);

        const handleReloadApp = async () => {
            try {
                await Updates.reloadAsync(); // Recarga la app
            } catch (error) {
                console.error("Error al recargar la app: ", error);
            }
        };

    useEffect(() => {
        let locationSubscription: any;

        (async () => {
            // Solicita permisos
            let { status } = await Location.requestForegroundPermissionsAsync();
            setPermissionStatus(status);

            if (status !== 'granted') {
                Alert.alert(
                  "Permiso denegado",
                  "Recuerda que para usar todas las funciones de la app es necesario activar la ubicación",
                  [{ text: "Activar", onPress: () => { ; 
                    Alert.alert(
                      'Activar ubicación', 
                      'Una vez activada la ubicación, es necesario actualizar',
                      [{ text: 'Actualizar', onPress: () => handleReloadApp() }]
                    ); 
                    Linking.openSettings()
                  }},
                  ]
                );
                return;
            }

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

    return { permissionStatus };
}
