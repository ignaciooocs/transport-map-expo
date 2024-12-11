import { Text, View } from "react-native";

export default function Comments({ comment }: any) {
    return (
        <View className="p-2 bg-gray-200 w-full rounded-md gap-y-2">
            <Text className="text-base font-semibold text-gray-600">{comment.text}</Text>
            <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">{comment.date.split("T")[0]} </Text>
                <Text className="text-sm text-gray-500"> a las {comment.date.split("T")[1].split(".")[0]}</Text>
            </View>
        </View>
    )
}