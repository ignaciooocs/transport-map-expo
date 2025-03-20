import { getAuth } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

// Función para obtener el token de Firebase
export async function getFirebaseToken() {
    const currentUser = getAuth(getApp()).currentUser;

    if (currentUser) {
        try {
            const token = await currentUser.getIdToken();
            return token;
        } catch (error) {
            console.error("Error al obtener el token:", error);
            throw error;
        }
    } else {
        throw new Error("Usuario no autenticado");
    }
}
