import { createStackNavigator } from "@react-navigation/stack";

import AttendanceEmployeesLocationHome from "./AttendanceEmployeesLocationHome";

const Stack = createStackNavigator();

function AttendanceEmployeesLocationStack() {
  return (
    <Stack.Navigator
      initialRouteName="AttendanceEmployeesLocationHome"
      screenOptions={{
        headerShown: false,
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#2E3B55" },
      }}
    >
      <Stack.Screen
        name="AttendanceEmployeesLocationHome"
        component={AttendanceEmployeesLocationHome}
        options={{
          title: "Attendance Employees Location",
        }}
      />
    </Stack.Navigator>
  );
}

export default AttendanceEmployeesLocationStack;
