import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

import Login from "./Login";
import Drawer from "./Drawer";
import { Platform } from "react-native";

export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Drawer"
        screenOptions={{
          headerShown: false,
          headerMode: "screen",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#2E3B55" },
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Drawer"
          options={{
            animationEnabled: Platform.OS === "ios" ? true : false,
          }}
          component={Drawer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
