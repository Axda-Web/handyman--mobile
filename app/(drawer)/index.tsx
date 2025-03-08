import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";

import type { Location } from "@/types/interfaces";
import { LocationForm } from "@/components/location-form";

function HomeScreen() {
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    loadLocations();
  }, [db]);

  const loadLocations = async () => {
    const locations = await db.getAllAsync<Location>("SELECT * FROM locations");
    setLocations(locations);
  };

  const addLocation = async (name: string) => {
    await db.runAsync("INSERT INTO locations (name) VALUES (?)", name);
    loadLocations();
  };

  return (
    <View style={styles.container}>
      <LocationForm onSubmit={addLocation} />
      <FlatList
        data={locations}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
