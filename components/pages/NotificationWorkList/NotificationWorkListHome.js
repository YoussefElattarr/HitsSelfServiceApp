import React, { useEffect, useState, useCallback } from "react";
import { List, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";

const NotificationWorkListHome = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setData([]);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
        setData(arr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshing == false]);

  return data.length === 0 ? (
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
        >
          {data.map((d) => {
            return (
              <List.Item
                key={d.notification_id}
                title={d.subject}
                description={
                  d.step_alias
                    ? new Date(d.notification_date).toLocaleDateString() +
                      "\n" +
                      d.status +
                      " . " +
                      d.step_alias
                    : new Date(d.notification_date).toLocaleDateString() +
                      "\n" +
                      d.status
                }
                onPress={() => {
                  props.navigation.navigate("NotificationPage", {
                    notification_id: d.notification_id,
                    request_type: null,
                    request_type_name: null,
                  });
                  // props.navigation.navigate("WebViewPage", {
                  //   notification_id: d.notification_id,
                  //   request_type: null,
                  //   request_type_name: null,
                  // });
                }}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default NotificationWorkListHome;
