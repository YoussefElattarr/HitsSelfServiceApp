import { createStackNavigator } from "@react-navigation/stack";

import Home from "./Home";

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#2E3B55" },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Awesome app",
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
