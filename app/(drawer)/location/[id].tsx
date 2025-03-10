import {
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
  Stack,
  Link,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import type { Task, Location } from "@/types/interfaces";
import { TaskListItem } from "@/components/task-list-item";

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
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: locationName || "Tasks" }} />
      <FlatList
        ListEmptyComponent={
          <View>
            <Text>No tasks found</Text>
          </View>
        }
        data={tasks}
        renderItem={({ item }) => <TaskListItem task={item} />}
      />
      <Link href={`/location/${id}/new-task`} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#F2A310",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
