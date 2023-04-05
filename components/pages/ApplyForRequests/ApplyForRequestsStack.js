import { createStackNavigator } from "@react-navigation/stack";

import ApplyForRequestsHome from "./ApplyForRequestsHome";
import ApplyForRequestsForm from "./ApplyForRequestsForm";

const Stack = createStackNavigator();

function ApplyForRequestsStack() {
  return (
    <Stack.Navigator
      initialRouteName="ApplyForRequestsHome"
      screenOptions={{
        headerShown: false,
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#2E3B55" },
      }}
    >
      <Stack.Screen
        name="ApplyForRequestsHome"
        component={ApplyForRequestsHome}
        options={{
          title: "Apply For Requests",
        }}
      />

      <Stack.Screen
        name="ApplyForRequestsForm"
        component={ApplyForRequestsForm}
        options={{
          title: "Request Form",
        }}
      />
    </Stack.Navigator>
  );
}

export default ApplyForRequestsStack;
