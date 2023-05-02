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
} from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { useForm, Controller } from "react-hook-form";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AttendanceLocationHome = () => {
  const [locations, setLocations] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

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
        "Content-Type": "application/json"
      },
      data: submitData
    })
    .then((res) => {
      alert(res.data.msg)
    })
    .catch((err) => {
      alert(err)
    })
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
    <View>
      <SafeAreaView>
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
      </SafeAreaView>
    </View>
  );
};

export default AttendanceLocationHome;
