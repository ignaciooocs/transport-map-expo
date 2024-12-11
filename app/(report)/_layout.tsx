import { Stack } from "expo-router";

export default function ReportLayout () {
    return (
        <Stack>
            <Stack.Screen name="report-add" options={{ 
                headerTitleAlign: "center",
                title: "Nuevo reporte"
             }} />

            <Stack.Screen name="report/[id]/index" options={{ 
                headerTitleAlign: "center",
                title: "Reporte"
             }} />

            <Stack.Screen name="report/[id]/comment" options={{
                headerTitleAlign: "center",
                title: "Comentarios"
            }} />
            <Stack.Screen name="report/[id]/update" options={{
                headerTitleAlign: "center",
                title: "Editar reporte"
            }}
            />
        </Stack>
    )
}