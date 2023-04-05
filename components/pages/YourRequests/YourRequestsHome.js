import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { List } from "react-native-paper";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";



const YourRequestsHome = (props) => {

  const [refreshing, setRefreshing] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [sfaRequests, setSfaRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
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
  }, [refreshing === false]);

  return (
    <View style={{}}>
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <List.AccordionGroup>
            <List.Accordion title="Pending" id="1">
              {pendingRequests.map((request) => {
                return (
                  <List.Item
                    key={request.request_id}
                    title={request.request_type}
                    description={
                      request.status +
                      "\n" +
                      new Date(request.request_date).toLocaleDateString()
                    }
                    onPress={() => {
                      props.navigation.navigate("RequestPage", {
                        request_id: request.request_id,
                        request_type_id: request.request_type_id,
                      });
                    }}
                  />
                );
              })}
            </List.Accordion>
            <List.Accordion title="Sent for Approval" id="2">
              {sfaRequests.map((request) => {
                return (
                  <List.Item
                    key={request.request_id}
                    title={request.request_type}
                    description={
                      request.status +
                      "\n" +
                      new Date(request.request_date).toLocaleDateString()
                    }
                    onPress={() => {
                      props.navigation.navigate("RequestPage", {
                        request_id: request.request_id,
                        request_type_id: request.request_type_id,
                      });
                    }}
                  />
                );
              })}
            </List.Accordion>
            <List.Accordion title="Rejected" id="3">
              {rejectedRequests.map((request) => {
                return (
                  <List.Item
                    key={request.request_id}
                    title={request.request_type}
                    description={
                      request.status +
                      "\n" +
                      new Date(request.request_date).toLocaleDateString()
                    }
                    onPress={() => {
                      props.navigation.navigate("RequestPage", {
                        request_id: request.request_id,
                        request_type_id: request.request_type_id,
                      });
                    }}
                  />
                );
              })}
            </List.Accordion>

            <List.Accordion title="Approved" id="4">
              {approvedRequests.map((request) => {
                return (
                  <List.Item
                    key={request.request_id}
                    title={request.request_type}
                    description={
                      request.status +
                      "\n" +
                      new Date(request.request_date).toLocaleDateString()
                    }
                    onPress={() => {
                      props.navigation.navigate("RequestPage", {
                        request_id: request.request_id,
                        request_type_id: request.request_type_id,
                      });
                    }}
                  />
                );
              })}
            </List.Accordion>
          </List.AccordionGroup>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default YourRequestsHome;
