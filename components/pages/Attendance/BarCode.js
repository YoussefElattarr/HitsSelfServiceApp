import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

//import DeviceInfo from 'react-native-device-info';

export default function BarCode(props){
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
        
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                
                alert('Permission to access location was denied. Please change it in the settings');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude)
            setLongitude(location.coords.longitude);
            setLocation(location.coords);
            //var uniqueId = DeviceInfo.getUniqueId();
            //console.log(uniqueId);
        })()
    }, []);
    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        const username = await AsyncStorage.getItem('username')
        await axios({
            url: "https://eg32mvlk9thcnja-prod.adb.uk-london-1.oraclecloudapps.com/ords/hits_prod/employees/createTransaction",
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            data: {
              username: username,
              token: data,
              latitude: latitude,
              longitude: longitude
            }
          })
          .then((res) => {
            alert(res.data.msg)
            props.navigation.navigate("AttendanceHome"); 
            //props.navigation.navigate('Drawer', { screen: 'Home' })
            // if(res.data.msg.includes("Err")){
            //     setScanned(false)
            // }
            // else{
            //     props.navigation.navigate("Home");
            // }
            
          })
          .catch((err) => {
            alert(err)
            props.navigation.navigate("AttendanceHome"); 
            // props.navigation.navigate('Drawer', { screen: 'Home' });
            //setScanned(false)
          })
        // alert(`Bar code with type ${type} and data ${data} has been scanned! Latitude = ${latitude} amd Longitude = ${longitude}`);
        // props.navigation.navigate("Home");
    };
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        alert('Permission to access camera was denied. Please change it in the settings');
        return;
    }

    return (
        <View style={styles.container}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />
        {/* {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        justifyContent:'center'
    }
})