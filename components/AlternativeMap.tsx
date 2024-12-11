import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function AternativeMap() {
    return (
        <View>
            <MapView 
                provider={PROVIDER_GOOGLE} 
                style={{width: "100%", height: "100%" }} 
                initialRegion={{
                    latitude: -33.45694,
                    longitude: -70.64827,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            />
        </View>
    );
}