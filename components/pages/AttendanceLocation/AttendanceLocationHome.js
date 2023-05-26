import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Platform,
  Linking,
  PermissionsAndroid,
} from "react-native";
import {
  Button,
  ActivityIndicator,
  Card,
  IconButton,
} from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { useForm, Controller } from "react-hook-form";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AttendanceLocationHome = () => {
  const [locations, setLocations] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const openInGoogleMaps = async (latitude, longitude) => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission denied");
        return;
      }
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
      })
      .catch((err) => {
        console.error("An error occurred", err);
        alert("Can't open the location");
      });
  };

  const renderRow = (datum) => {
    return (
      <View
        key={datum.transaction_id}
        style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}
      >
        <View
          style={{
            flex: 1,
            alignSelf: "stretch",
            borderWidth: 1,
            borderColor: "black",
            width: 100,
          }}
        >
          <Text style={{ textAlign: "center" }}>{datum.transaction_type}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: "stretch",
            borderWidth: 1,
            borderColor: "black",
            width: 100,
          }}
        >
          <Text style={{ textAlign: "center" }}>{datum.transaction_date}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: "stretch",
            borderWidth: 1,
            borderColor: "black",
            width: 100,
          }}
        >
          <Text style={{ textAlign: "center" }}>{datum.latitude}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: "stretch",
            borderWidth: 1,
            borderColor: "black",
            width: 100,
          }}
        >
          <Text style={{ textAlign: "center" }}>{datum.longitude}</Text>
        </View>
      </View>
    );
  };
  async function getAttendanceReport() {
    const person_id = await AsyncStorage.getItem("person_id");
    axios
      .get(
        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/get_attendance_report",
        {
          params: {
            p_person_id: person_id,
            p_requester_id: null,
          },
        }
      )
      .then(function (response) {
        let arr = response.data.length === 0 ? [] : response.data;
        //sort depending on request date, the most recent first
        arr.sort((a, b) => {
          if (new Date(a.transaction_date) < new Date(b.transaction_date))
            return 1;
          if (new Date(a.transaction_date) > new Date(b.transaction_date))
            return -1;
          return 0;
        });
        const groupedData = {};
        arr.forEach((item) => {
          // Create a unique key based on date and location
          // const key = `${item.transaction_date.split("T")[0]}_${
          //   item.longitude
          // }_${item.latitude}`;

          const key = item.transaction_date.split("T")[0];

          // Check if the date exists in the groupedData object
          if (groupedData[key]) {
            groupedData[key].firstTimestamp =
              item.transaction_type === "CHECK-IN"
                ? item.transaction_date.split("T")[1]
                : groupedData[key].firstTimestamp;
            groupedData[key].firstLongitude =
              item.transaction_type === "CHECK-IN"
                ? item.longitude
                : groupedData[key].firstLongitude;
            groupedData[key].firstLatitude =
              item.transaction_type === "CHECK-IN"
                ? item.latitude
                : groupedData[key].firstLatitude;
          } else {
            // If it doesn't exist, create a new object with the first timestamp and data array
            groupedData[key] = {
              date: item.transaction_date.split("T")[0],
              firstTimestamp:
                item.transaction_type === "CHECK-IN"
                  ? item.transaction_date.split("T")[1]
                  : "",
              lastTimestamp:
                item.transaction_type === "CHECK-OUT"
                  ? item.transaction_date.split("T")[1]
                  : "",
              firstLongitude:
                item.transaction_type === "CHECK-IN" ? item.longitude : "",
              firstLatitude:
                item.transaction_type === "CHECK-IN" ? item.latitude : "",
              lastLongitude:
                item.transaction_type === "CHECK-OUT" ? item.longitude : "",
              lastLatitude:
                item.transaction_type === "CHECK-OUT" ? item.latitude : "",
            };
          }
        });
        const result = Object.values(groupedData);
        setAttendanceReport(result);
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });
  }
  useEffect(() => {
    axios
      .get(
        "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ssmb/get_locations",
        {
          params: {
            p_person_id: null,
            p_requester_id: null,
          },
        }
      )
      .then(function (response) {
        setLocations(response.data);
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });

    getAttendanceReport();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(
          "Permission to access location was denied. Please change it in the settings"
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  const onSubmit = async (submitData) => {
    const username = await AsyncStorage.getItem("username");
    submitData.username = username;
    submitData.latitude = latitude;
    submitData.longitude = longitude;
    submitData.person_id = null;
    axios({
      url: "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/employees/createTransaction_Location",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: submitData,
    })
      .then((res) => {
        alert(res.data.msg);
        getAttendanceReport();
      })
      .catch((err) => {
        alert(err);
      });
  };
  return latitude === null || longitude === null ? (
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
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Controller
            control={control}
            name="location_id"
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: "5%",
                    textAlign: "center",
                    marginBottom: "5%",
                  }}
                >
                  Please select a location
                </Text>
                <SelectDropdown
                  data={locations}
                  onSelect={(selectedItem, index) => {
                    onChange(selectedItem.location_id);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.location_name;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.location_name;
                  }}
                  search={true}
                  buttonStyle={{ width: "100%" }}
                />
              </>
            )}
            rules={{
              required: {
                value: true,
                message: "Field is required!",
              },
            }}
          />
          <Button
            style={{ marginTop: "5%" }}
            disabled={!isValid}
            mode="contained"
            onPress={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ marginTop: 10, fontSize: 20, marginBottom: 10 }}>
              Attendance Report
            </Text>
            {/* <ScrollView horizontal>
              <View
                style={{
                  flexDirection: "column",
                  borderWidth: 1,
                  borderColor: "black",
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignSelf: "stretch",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "stretch",
                      borderWidth: 1,
                      borderColor: "black",
                      width: 100,
                      backgroundColor: "lightgray",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>
                      Transaction Type
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "stretch",
                      borderWidth: 1,
                      borderColor: "black",
                      width: 100,
                      backgroundColor: "lightgray",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>
                      Transaction Date
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "stretch",
                      borderWidth: 1,
                      borderColor: "black",
                      width: 100,
                      backgroundColor: "lightgray",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Latitude</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "stretch",
                      borderWidth: 1,
                      borderColor: "black",
                      width: 100,
                      backgroundColor: "lightgray",
                    }}
                  >
                    <Text style={{ textAlign: "center" }}>Longitude</Text>
                  </View>
                </View>
                {attendanceReport.map((datum) => renderRow(datum))}
              </View>
            </ScrollView> */}
          </View>
          {attendanceReport.map((datum, i) => {
            return (
              <Card key={i} style={{ margin: 10 }}>
                <Card.Title title={datum.date} />
                <Card.Content>
                  {/* <View
                    key={i}
                    style={{
                      flexDirection: "column",
                      borderWidth: 1,
                      borderColor: "black",
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          alignSelf: "stretch",
                          borderWidth: 1,
                          borderColor: "black",
                          width: 100,
                          backgroundColor: "lightgray",
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>Check In</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: "stretch",
                          borderWidth: 1,
                          borderColor: "black",
                          width: 100,
                          backgroundColor: "lightgray",
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>Latitude</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: "stretch",
                          borderWidth: 1,
                          borderColor: "black",
                          width: 100,
                          backgroundColor: "lightgray",
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>Longitude</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: "stretch",
                          borderWidth: 1,
                          borderColor: "black",
                          width: 100,
                          backgroundColor: "lightgray",
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>Check Out</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          alignSelf: "stretch",
                          borderWidth: 1,
                          borderColor: "black",
                          width: 100,
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>
                          {datum.firstTimestamp}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: "stretch",
                          borderWidth: 1,
                          borderColor: "black",
                          width: 100,
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>
                          {datum.latitude}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: "stretch",
                          borderWidth: 1,
                          borderColor: "black",
                          width: 100,
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>
                          {datum.longitude}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: "stretch",
                          borderWidth: 1,
                          borderColor: "black",
                          width: 100,
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>
                          {datum.lastTimestamp}
                        </Text>
                      </View>
                    </View>
                  </View> */}
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "stretch",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#52B774",
                          fontSize: 20,
                        }}
                      >
                        {datum.firstTimestamp}
                      </Text>
                      {datum.firstTimestamp === ""
                        ? false
                        : true && (
                            <IconButton
                              icon="map-marker"
                              onPress={() =>
                                openInGoogleMaps(
                                  datum.firstLatitude,
                                  datum.firstLongitude
                                )
                              }
                              size={18}
                              color="#52B774"
                            ></IconButton>
                          )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#EF3330",
                          fontSize: 20,
                        }}
                      >
                        {datum.lastTimestamp}
                      </Text>
                      {datum.lastTimestamp === ""
                        ? false
                        : true && (
                            <IconButton
                              icon="map-marker"
                              onPress={() =>
                                openInGoogleMaps(
                                  datum.lastLatitude,
                                  datum.lastLongitude
                                )
                              }
                              size={18}
                              color="#EF3330"
                            ></IconButton>
                          )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AttendanceLocationHome;
