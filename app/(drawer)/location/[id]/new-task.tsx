import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function NewTaskScreen() {
  const { id: locationId, taskId } = useLocalSearchParams();

  return (
    <View>
      <Text>New Task</Text>
    </View>
  );
}
