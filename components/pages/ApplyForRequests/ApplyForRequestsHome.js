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

const ApplyForRequestsHome = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [requestTypes, setRequestTypes] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/request_types",
        {
          params: {
            p_person_id: null,
            p_requester_id: null,
          },
        }
      )
      .then(function (response) {
        setRequestTypes(response.data);
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
          <Text style={{ fontSize: 20, marginTop: "5%", textAlign: "center" }}>
            Please select request type
          </Text>
          <List.Accordion
            title="Request Types"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            {requestTypes.map((type) => {
              return (
                <List.Item
                  key={type.REQUEST_TYPE_ID}
                  title={type.REQUEST_TYPE_NAME}
                  onPress={() => {
                    props.navigation.navigate('ApplyForRequestsForm', {
                        request_id: type.REQUEST_TYPE_ID,
                        request_type:type.REQUEST_TYPE,
                        request_type_name: type.REQUEST_TYPE_NAME
                      });
                  }}
                />
              );
            })}
          </List.Accordion>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ApplyForRequestsHome;
