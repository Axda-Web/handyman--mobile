import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { Location } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";

interface LocationListItemProps {
  location: Location;
  onDelete: () => void;
}

export const LocationListItem = ({
  location,
  onDelete,
}: LocationListItemProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.locationName}>{location.name}</Text>
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 4,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 500,
    color: "#333",
  },
});
