import { router, useNavigation } from "expo-router"
import { useEffect } from "react"
import Icon from '@expo/vector-icons/Ionicons'

export const useBackButtonHome = () => {
    const navigation = useNavigation()

    useEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <Icon 
            name="arrow-back"
            size={24}
            onPress={() => router.push('/')}
            color="black" />
        )
      })
    }, [])


}