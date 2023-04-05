import { createStackNavigator } from "@react-navigation/stack";

import NotificationWorkListHome from "./NotificationWorkListHome";
import NotificationPage from "./NotificationPage";
import WebViewPage from "./WebView";

const Stack = createStackNavigator();

function NotificationWorkListStack() {
  return (
    <Stack.Navigator
      initialRouteName="NotificationWorkListHome"
      screenOptions={{
        headerShown: false,
        headerMode: "screen",
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#2E3B55" },
      }}
    >
      <Stack.Screen
        name="NotificationWorkListHome"
        component={NotificationWorkListHome}
        options={{
          title: "Your Notifications",
        }}
      />

      <Stack.Screen
        name="NotificationPage"
        component={NotificationPage}
        options={{
            title: "Notification"
        }}
      />
      <Stack.Screen
        name="WebViewPage"
        component={WebViewPage}
        options={{
            title: "WebViewPage"
        }}
      />
    </Stack.Navigator>
  );
}

export default NotificationWorkListStack;
