import { createStackNavigator } from "@react-navigation/stack";

import Barcode from "./BarCode";
import AttendanceHome from "./AttendanceHome";

const Stack = createStackNavigator();

function AttendanceHomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="AttendanceHome"
      screenOptions={{
        headerShown: false,
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#2E3B55" },
      }}
    >
      <Stack.Screen
        name="AttendanceHome"
        component={AttendanceHome}
        options={{
          title: "Attendance",
        }}
      />
      <Stack.Screen name="Barcode" component={Barcode} />

    </Stack.Navigator>
  );
}

export default AttendanceHomeStack;
