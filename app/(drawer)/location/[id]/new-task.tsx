import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Task } from "@/types/interfaces";
import * as ImagePicker from "expo-image-picker";
import { TimeIntervalTriggerInput } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Page = () => {
  const { id: locationId, taskId } = useLocalSearchParams<{
    id: string;
    taskId?: string;
  }>();
  const router = useRouter();
  const db = useSQLiteContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      loadTaskData();
    }
    Notifications.requestPermissionsAsync();
  }, [taskId]);

  const loadTaskData = async () => {
    const task = await db.getFirstAsync<Task>(
      `SELECT * FROM tasks WHERE id = ?`,
      [Number(taskId)]
    );

    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIsUrgent(task.isUrgent);
      setImageUri(task.imageUri || null);
    }
  };

  const handleSaveTask = async () => {
    let newTaskId = Number(taskId);

    if (taskId) {
      // UPDATE
      await db.runAsync(
        "UPDATE tasks SET title = ?, description = ?, isUrgent = ?, imageUri = ? WHERE id = ?",
        [title, description, isUrgent ? 1 : 0, imageUri, Number(taskId)]
      );
    } else {
      // INSERT
      const result = await db.runAsync(
        `INSERT INTO tasks (locationId, title, description, isUrgent, imageUri) VALUES (?, ?, ?, ?, ?)`,
        [Number(locationId), title, description, isUrgent ? 1 : 0, imageUri]
      );
      newTaskId = result.lastInsertRowId;
    }

    if (isUrgent) {
      // Notifications
      scheduleNotification(newTaskId, title);
    }

    router.back();
  };

  const handleFinishTask = async () => {
    Alert.alert(
      "Finish Task",
      "Are you sure you want to finish this task? It will be removed from the database.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Finish",
          onPress: async () => {
            await db.runAsync("DELETE FROM tasks WHERE id = ?", [
              Number(taskId),
            ]);
            router.back();
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const scheduleNotification = async (taskId: number, title: string) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Urgent Task Reminder",
        body: `Don't forget about your urgent task: ${title}`,
        data: { taskId, locationId },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  };

  return (
    <ScrollView style={styles.container} keyboardDismissMode="on-drag">
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.row}>
        <Text>Urgent</Text>
        <Switch
          value={Boolean(isUrgent)}
          onValueChange={setIsUrgent}
          trackColor={{ true: "#F2A310", false: "#767577" }}
        />
      </View>

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>
          {imageUri ? "Change Image" : "Add Image"}
        </Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
        <Text style={styles.buttonText}>
          {taskId ? "Update Task" : "Create Task"}
        </Text>
      </TouchableOpacity>

      {taskId && (
        <TouchableOpacity
          style={[styles.button, styles.finishButton]}
          onPress={handleFinishTask}
        >
          <Text style={styles.buttonText}>Finish Task</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#F2A310",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  finishButton: {
    backgroundColor: "#4CAF50",
  },
  imageButton: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    resizeMode: "contain",
  },
});
