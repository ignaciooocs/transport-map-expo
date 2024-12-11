import auth from '@react-native-firebase/auth';

// Función para obtener el token de Firebase
export async function getFirebaseToken() {
    const currentUser = auth().currentUser;

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
