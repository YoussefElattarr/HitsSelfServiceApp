import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

export default function AttendanceHome(props) {
  
  const nav = useNavigation();

  return (
    <View>
      <ScrollView>

        <SafeAreaView style={{ marginTop: "75%" }}>
          <Button
            mode="contained"
            style={{
              width: "80%",
              marginLeft: "10%",
              backgroundColor: "#2E3B55",
            }}
            onPress={() =>
              // props.navigation.navigate("Drawer", { screen: "Barcode" })
              nav.navigate("Barcode")
            }
          >
            Scan Barcode
          </Button>
          
        </SafeAreaView>
      </ScrollView>
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
