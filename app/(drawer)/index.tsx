import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";

import type { Location } from "@/types/interfaces";
import { LocationForm } from "@/components/location-form";
import { LocationListItem } from "@/components/location-list-item";
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

  const deleteLocation = async (id: number) => {
    await db.runAsync("DELETE FROM locations WHERE id = ?", id);
    loadLocations();
  };

  return (
    <View style={styles.container}>
      <LocationForm onSubmit={addLocation} />
      <FlatList
        data={locations}
        renderItem={({ item }) => (
          <LocationListItem
            location={item}
            onDelete={() => deleteLocation(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No locations added yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 500,
    fontStyle: "italic",
    color: "#333",
    textAlign: "center",
    marginTop: 16,
  },
});

export default HomeScreen;
