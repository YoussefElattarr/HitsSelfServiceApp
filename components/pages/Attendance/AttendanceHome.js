import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function AttendanceHome(props) {
  const nav = useNavigation();
  const { height } = useWindowDimensions();

  return (
  
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
          <Button
            mode="contained"
            style={{
              width: "80%",
              
              backgroundColor: "#2E3B55",
            }}
            icon="barcode-scan"
            onPress={() =>
              // props.navigation.navigate("Drawer", { screen: "Barcode" })
              nav.navigate("Barcode")
            }
          >
            Scan Barcode
          </Button>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "columnn",
    justifyContent: "center",
  },
});
