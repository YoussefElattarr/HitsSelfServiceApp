import React, { useState, useEffect } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, InteractionManager } from "react-native";
import { useNavigation } from "@react-navigation/native";

import HomeStack from "./Home/HomeStack";
import AttendanceStack from "./Attendance/AttendanceStack";
import ApplyForRequestsStack from "./ApplyForRequests/ApplyForRequestsStack";
import YourRequestsStack from "./YourRequests/YourRequestsStack";
import NotificationWorkListStack from "./NotificationWorkList/NotificationWorkListStack";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const nav = useNavigation();

  return (
    <DrawerContentScrollView
      contentContainerStyle={{ height: "100%" }} //uncomment to make the height take the whole screen
      {...props}
    >
      <DrawerItemList {...props} />
      <View
        style={{ marginTop: "auto", bottom: 20 }} //when the above height is 100%, the logout button will be at the bottom
      >
        <DrawerItem
          label="Log Out"
          onPress={() => {
            //clear the the username from the storage
            AsyncStorage.clear();
            //navigate to login and delete the navigation stack so that the user does not go back
            nav.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

// Define a custom screen component that wraps the original screen component
// the custom screen component uses InteractionManager.runAfterInteractions to delay the rendering of the children components
// it is delayed until any pending interactions have completed
// to optimize the code and get rid of laggy animations
function ScreenWithInteractionManager({ children }) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRendered(true);
    });
  }, []);

  if (!rendered) {
    return null;
  }

  return children;
}

export default function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        drawerPosition: "right",
        headerStyle: {
          backgroundColor: "#2E3B55", //Set Header color
        },
        //remove bottom border from header
        headerShadowVisible: false,
        headerTintColor: "#fff", //Set Header text color
      }}
      //custom drawer to add footer and header
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: "Home",
        }}
      /> */}
      <Drawer.Screen
        name="HomeStack"
        // component={HomeStack}
        options={{
          title: "Home",
        }}
      >
        {() => (
          <ScreenWithInteractionManager>
            <HomeStack />
          </ScreenWithInteractionManager>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="AttendanceStack"
        // component={AttendanceStack}
        options={{
          title: "Attendance",
        }}
      >
        {() => (
          <ScreenWithInteractionManager>
            <AttendanceStack />
          </ScreenWithInteractionManager>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="ApplyForRequestsStack"
        //component={ApplyForRequestsStack}
        options={{
          title: "Apply For Requests",
        }}
      >
        {() => (
          <ScreenWithInteractionManager>
            <ApplyForRequestsStack />
          </ScreenWithInteractionManager>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="YourRequestsStack"
        //component={YourRequestsStack}
        options={{
          title: "Your Requests",
        }}
      >
        {() => (
          <ScreenWithInteractionManager>
            <YourRequestsStack />
          </ScreenWithInteractionManager>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="NotificationWorkListStack"
        //component={NotificationWorkListStack}
        options={{
          title: "Notification WorkList",
        }}
      >
        {() => (
          <ScreenWithInteractionManager>
            <NotificationWorkListStack />
          </ScreenWithInteractionManager>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
