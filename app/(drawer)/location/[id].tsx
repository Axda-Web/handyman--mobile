import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function LocationDetailsScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Location Details</Text>
      <Text>My id: {id}</Text>
    </View>
  );
}
