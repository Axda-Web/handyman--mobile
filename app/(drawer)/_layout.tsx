import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "#F2A310",
          headerTintColor: "#000",
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="location" options={{ title: "Location" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
