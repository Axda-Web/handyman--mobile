import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import {
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerStatus,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Image, StyleSheet, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import type { Location } from "@/types/interfaces";
import Logo from "@/assets/images/logo.png";

const LOGO_IMAGE = Image.resolveAssetSource(Logo).uri;

const dbStudio = SQLite.openDatabaseSync("handyman.db");

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const isDrawerOpen = useDrawerStatus() === "open";

  useDrizzleStudio(dbStudio);

  const loadLocations = async () => {
    const locations = await db.getAllAsync<Location>(`
      SELECT * FROM locations
    `);
    setLocations(locations);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      loadLocations();
    }
  }, [isDrawerOpen]);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <Image source={{ uri: LOGO_IMAGE }} style={styles.logo} />
        <View style={styles.locationsContainer}>
          <DrawerItemList {...props} />
          <Text style={styles.title}>Locations</Text>
          {locations.map((location) => {
            const isActive = pathname === `/location/${location.id}`;
            return (
              <DrawerItem
                key={location.id}
                label={location.name}
                onPress={() => router.navigate(`/location/${location.id}`)}
                focused={isActive}
                activeTintColor="#F2A310"
                inactiveTintColor="#000"
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          paddingBottom: 20 + bottom,
          borderTopWidth: 1,
          borderTopColor: "#dde3fe",
          padding: 16,
        }}
      >
        <Text>Copyright Galaxies 2024</Text>
      </View>
    </View>
  );
};

export default function DrawerLayout() {
  // useDrizzleStudio(db);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "#F2A310",
          headerTintColor: "#000",
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Manage Locations" }} />
        <Drawer.Screen
          name="location"
          options={{
            title: "Location",
            headerShown: false,
            drawerItemStyle: {
              display: "none",
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  locationsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 16,
    paddingTop: 24,
    color: "#A6A6A6",
  },
  footer: {
    paddingBottom: 20,
  },
});
