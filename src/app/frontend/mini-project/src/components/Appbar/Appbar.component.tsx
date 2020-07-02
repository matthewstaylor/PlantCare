import * as React from 'react';
import {Appbar, Headline} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

export default class MainAppbar extends React.Component {
    render() {
        return (
            <Appbar style={styles.bottom}>
                <Appbar.Content title="🌿 PlantCare"/>
                {/*<Appbar.Action icon="water" onPress={() => console.log('Add a new')}/>
                <Appbar.Action icon="cactus" onPress={() => console.log('Add a new')}/>
                <Appbar.Action icon="bell" onPress={() => console.log('Pressed label')}/>
                <Appbar.Action icon="account" onPress={() => console.log('Pressed delete')}/>*/}
            </Appbar>
        );
    }
}
const styles = StyleSheet.create({
    bottom: {
        backgroundColor: '#0a4f28',
        paddingTop: 35,
        height: 85,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        marginBottom: 200
    },
    appName: {
        marginLeft: 10,
        marginRight: 10,
        fontWeight: 'bold',
        color: '#fff'
    }
});
