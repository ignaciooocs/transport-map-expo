import { Stack } from "expo-router";

export default function AuthLayout () {
    return (
        <Stack>
            <Stack.Screen name="sign-in" options={{
                title: "Iniciar sesión",
                headerTitleAlign: "center",
            }} />
            <Stack.Screen name="sign-up" options={{
                title: "Registrarse",
                headerTitleAlign: "center",
            }} />
        </Stack>
    )
}