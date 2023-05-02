import { createStackNavigator } from "@react-navigation/stack";

import AttendanceLocationHome from "./AttendanceLocationHome";

const Stack = createStackNavigator();

function AttendanceLocationStack() {
  return (
    <Stack.Navigator
      initialRouteName="AttendanceLocationHome"
      screenOptions={{
        headerShown: false,
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#2E3B55" },
      }}
    >
      <Stack.Screen
        name="AttendanceLocationHome"
        component={AttendanceLocationHome}
        options={{
          title: "Attendance Location",
        }}
      />
    </Stack.Navigator>
  );
}

export default AttendanceLocationStack;
