import React, { Component } from "react";
import { View, Text, SafeAreaView, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { Icon } from 'react-native-elements'
import axios from "axios";
import { Buffer } from "buffer";
import qs from "qs";
import * as Crypto from "expo-crypto";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      userError: false,
      passwordError: false,
      userText: "",
      passwordText: "",
      wrongInfo: "",
    };
  }
  componentDidMount() {}

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event,
    });
  };

  onLogin =  () => {
    let flag = false;
    if (this.state.username.length === 0) {
      flag = true;
      this.setState({
        userError: true,
        userText: "Please enter an email!",
      });
    }
    if (this.state.password.length === 0) {
      flag = true;
      this.setState({
        passwordError: true,
        passwordText: "Please enter a password!",
      });
    }
    if (!flag) {
      //let client_id = "vsNsWrbgn7FnL0dfPlmx9Q..";
      let client_id = "_30Ow1Sa9ZPedyVa-YQNsg..";
      //let client_secret = "Ft0XBHDTEf29kd2uNxAJyw..";
      let client_secret = "-MZmW5JnTExHMnNSi1uwyw.."
      let bufferObj = Buffer.from(client_id + ":" + client_secret, "utf8");
      let base64String = bufferObj.toString("base64");
      axios({
        method: "post",
        //url: "https://eg32mvlk9thcnja-prod.adb.uk-london-1.oraclecloudapps.com/ords/hits_prod/oauth/token",
        url: "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/oauth/token",
        data: qs.stringify({
          grant_type: "client_credentials",
          client_id: client_id,
          client_secret: client_secret,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: "Basic " + base64String,
        },
      })
        .then(async (res) => {
          console.log(res.data)
          const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            this.state.password
          );
          axios({
            //url: "https://eg32mvlk9thcnja-prod.adb.uk-london-1.oraclecloudapps.com/ords/hits_prod/ACS/CHECKLOGIN",
            url: "https://eg32mvlk9thcnja-dev.adb.uk-london-1.oraclecloudapps.com/ords/hits_dev/ACS/CHECKLOGIN",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + res.data.access_token,
            },
            data: {
              username: this.state.username,
              password: hashedPassword,
            },
          })
            .then(async (res) => {
              console.log(res.data);
              if (res.data.Authentication === "success") {
                await AsyncStorage.setItem("username", this.state.username);
                await AsyncStorage.setItem("person_id", res.data.Person_id);
                // this.props.navigation.navigate("Drawer")
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: "Drawer" }],
                });
              } else {
                Alert.alert("Wrong email or password");
              }
            })
            .catch((err) => {
              console.log(err);
              Alert.alert("Something went wrong");
            });
        })
        .catch((err) => {
          console.log(err);
          Alert.alert("Something went wrong");
        });
    }
  };
  render() {
    return (
      <View>
        <Appbar.Header
          style={{
            //backgroundColor: "#0C0D16"
            backgroundColor: "#2E3B55",
          }}
        >
          <Appbar.Content
            style={{ justifyContent: "center", alignItems: "center" }}
            title="Welcome"
          />
        </Appbar.Header>

        <SafeAreaView style={{ marginTop: "40%" }}>
          <View
            style={{
              marginLeft: "38%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#000000", fontSize: 40 }}>Login</Text>
          </View>

          <TextInput
            mode="flat"
            placeholder="Email"
            onChangeText={this.handleChange("username")}
            style={{ width: "80%", marginTop: "10%", marginLeft: "10%" }}
            error={this.state.userError}
          ></TextInput>
          <Text style={{ color: "#ff0000", marginLeft: "10%" }}>
            {this.state.userText}
          </Text>
          <TextInput
            mode="flat"
            placeholder="Password"
            onChangeText={this.handleChange("password")}
            style={{ width: "80%", marginLeft: "10%" }}
            secureTextEntry={true}
            password={true}
            error={this.state.passwordError}
          ></TextInput>
          <Text style={{ color: "#ff0000", marginLeft: "10%" }}>
            {this.state.passwordText}
          </Text>
          <Button
            mode="contained"
            icon="arrow-right-circle"
            style={{
              width: "80%",
              marginLeft: "10%",
              backgroundColor: "#2E3B55",
            }}
            onPress={this.onLogin}
          >
            Sign in
          </Button>
          <Text
            style={{ color: "#ff0000", marginLeft: "10%", marginTop: "3%" }}
          >
            {this.state.wrongInfo}
          </Text>
        </SafeAreaView>
      </View>
    );
  }
}
