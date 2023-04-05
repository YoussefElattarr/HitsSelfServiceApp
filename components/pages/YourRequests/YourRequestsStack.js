import { createStackNavigator } from "@react-navigation/stack";

import YourRequestsHome from "./YourRequestsHome";
import RequestPage from "./RequestPage"

const Stack = createStackNavigator();

function YourRequestsStack() {
  return (
    <Stack.Navigator
      initialRouteName="YourRequestsHome"
      screenOptions={{
        headerShown: false,
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#2E3B55" },
      }}
    >
      <Stack.Screen
        name="YourRequestsHome"
        component={YourRequestsHome}
        options={{
          title: "Your Requests",
        }}
      />

      <Stack.Screen
        name="RequestPage"
        component={RequestPage}
        option={{
          title: "Request"
        }}
      />

    </Stack.Navigator>
  );
}

export default YourRequestsStack;
