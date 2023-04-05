import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import axios from "axios";
import {
  Avatar,
  TextInput,
  Button,
  Appbar,
  ActivityIndicator,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  VictoryPie,
  VictoryLabel,
  VictoryChart,
  VictoryTheme,
  VictoryBar,
} from "victory-native";

export default function Home(props) {
  const { height } = useWindowDimensions();

  const [username, setUsername] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [sfaRequests, setSfaRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);

  const pieData = [
    {
      x: "Pending",
      y: pendingRequests.length,
      startAngle: 0,
      endAngle: Math.PI / 2,
    },
    {
      x: "Sent For Approval",
      y: sfaRequests.length,
      startAngle: Math.PI / 2,
      endAngle: Math.PI,
    },
    {
      x: "Approved",
      y: approvedRequests.length,
      startAngle: Math.PI,
      endAngle: (3 * Math.PI) / 2,
    },
    {
      x: "Rejected",
      y: rejectedRequests.length,
      startAngle: (3 * Math.PI) / 2,
      endAngle: 2 * Math.PI,
    },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setNotifications([]);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    (async () => {
      const asyncStorageKeys = await AsyncStorage.getAllKeys();
      if (asyncStorageKeys.length === 0) {
        nav.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      } else {
        const usernameFromStorage = await AsyncStorage.getItem("username");
        setUsername(usernameFromStorage);
      }
    })();
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/get_todo_notifications",
        {
          params: {
            p_requester_id: null,
            p_view: "ALL",
            p_notification_id: null,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        let arr = res.data;
        //sort depending on request date, the most recent first
        arr.sort((a, b) => {
          if (new Date(a.notification_date) < new Date(b.notification_date))
            return 1;
          if (new Date(a.notification_date) > new Date(b.notification_date))
            return -1;
          return 0;
        });
        let arrFiltered = arr.filter((n) => n.status === "Approval Required");
        setNotifications(arrFiltered);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(
        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/request",
        {
          params: {
            p_person_id: null,
            p_requester_id: null,
            p_request_id: null,
          },
        }
      )
      .then(function (response) {
        let arr = response.data;
        //sort depending on request date, the most recent first
        arr.sort((a, b) => {
          if (new Date(a.request_date) < new Date(b.request_date)) return 1;
          if (new Date(a.request_date) > new Date(b.request_date)) return -1;
          return 0;
        });
        let pending = arr.filter((req) => req.status === "Pending");
        let approved = arr.filter((req) => req.status === "Approved");
        let sfa = arr.filter((req) => req.status === "SENT_FOR_APPROVAL");
        let rejected = arr.filter((req) => req.status === "Rejected");
        setPendingRequests(pending);
        setApprovedRequests(approved);
        setSfaRequests(sfa);
        setRejectedRequests(rejected);
      })
      .catch(function (error) {
        alert(error);
      });
  }, [refreshing == false]);

  const nav = useNavigation();

  return notifications.length === 0 ? (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator animating={true} color="#2E3B55" />
    </View>
  ) : (
    <View>
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{ height: height }}
        >
          <View style={styles.banner}>
            <Avatar.Image
              size={100}
              source={{
                uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              }}
            />
            <Text style={{ marginTop: "5%", fontSize: 18, color: "#ffffff" }}>
              Hello, {username}
            </Text>
          </View>
          <Text style={{ marginTop: "5%", marginLeft: "2%", fontSize: 32 }}>
            Your Notifications
          </Text>
          <Text style={{ marginTop: "5%", marginLeft: "2%", fontSize: 16 }}>
            You have {notifications.length} notifications awaiting your approval
          </Text>
          <Text style={{ marginTop: "10%", marginLeft: "2%", fontSize: 32 }}>
            Your Requests
          </Text>
          <View style={{ width: 300, height: 300 }}>
            <VictoryPie
              data={pieData}
              colorScale={["#00BFFF", "#FFD700", "#4CAF50", "#FF6347"]}
              innerRadius={70}
              labels={({ datum }) => datum.y === 0 ? null : `${datum.x}: ${datum.y}`}
              labelRadius={({ innerRadius }) => innerRadius + 30}
              style={{ labels: { fontSize: 11 } }}
              padAngle={3}
            />
            
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  banner: {
    height: 200,
    backgroundColor: "#2E3B55",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
