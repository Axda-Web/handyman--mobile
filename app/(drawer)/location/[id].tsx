import {
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
  Stack,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import type { Task, Location } from "@/types/interfaces";

export default function LocationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [locationName, setLocationName] = useState("");

  const loadLocationData = useCallback(async () => {
    const [location] = await db.getAllAsync<Location>(
      `SELECT * FROM locations WHERE id = ?`,
      [Number(id)]
    );

    if (location) {
      setLocationName(location.name);
    }

    const tasks = await db.getAllAsync<Task>(
      `SELECT * FROM tasks WHERE locationId = ?;`,
      [Number(id)]
    );

    setTasks(tasks);
  }, [id, db]);

  useFocusEffect(
    useCallback(() => {
      loadLocationData();
    }, [loadLocationData])
  );

  return (
    <View>
      <Stack.Screen options={{ title: locationName || "Tasks" }} />
      <FlatList
        data={tasks}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </View>
  );
}
