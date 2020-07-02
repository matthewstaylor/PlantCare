import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Button, Alert, ScrollView} from 'react-native';
import MainAppbar from "./src/components/Appbar/Appbar.component";
import WelcomeCard from "./src/components/WelcomeCard/WelcomeCard.component";
import {Provider as PaperProvider} from 'react-native-paper';
import theme from "./style.config";
import Dashboard from "./src/components/Dashboard/Dashboard.component";
import Temperature from './src/components/Temperature/Temperature.component';
import Humidity from './src/components/Humidity/Humidity.component';
import WateringSchedule from "./src/components/WateringSchedule/WateringSchedule.component";

export default function App() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#EEEEEE',
            // alignItems: 'center',
            // justifyContent: 'center',
        },
        image: {
            width: 350,
            height: 300,
            resizeMode: 'contain',
        },
        button: {
            flexDirection: 'row',
        },
        buttonSplit: {
            padding: 10,
        },
        mainScrollView: {
            marginTop: 85
        }
    });
    return (
        <PaperProvider theme={theme}>
            <View style={styles.container}>
                <MainAppbar/>
                <ScrollView style={styles.mainScrollView}>
                    <WelcomeCard/>
                    <WateringSchedule/>
                    <Dashboard/>
                    <Temperature/>
                    <Humidity/>
                </ScrollView>
            </View>
        </PaperProvider>
    );
}
