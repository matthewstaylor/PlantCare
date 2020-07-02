import {StyleSheet} from 'react-native';
import {useTheme} from "react-native-paper";
const THEME_PRIMARY_COLOR = '#0a4f28';
const THEME_PRIMARY_FONT_COLOR = '#0e803f';

export default StyleSheet.create({
    scrollView: {
        flex: 1,
        alignItems: 'stretch',
        padding: 24,
    },
    surface: {
        elevation: 5,
        padding: 15,
        margin: 10
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    chart: {
        width: 10
    },
    headline1: {
        fontSize: 22,
        // color: THEME_PRIMARY_FONT_COLOR,
        fontWeight: 'bold'
    },
    headline2: {
        fontSize: 18,
        // color: THEME_PRIMARY_FONT_COLOR,
    },
    lastFivePumps: {
        fontSize: 16,
        // color: THEME_PRIMARY_FONT_COLOR,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    pumpTimes: {
        fontSize: 14
    },
    button: {
        marginTop: 20
    },
    icon: {
        margin: 0,
        marginLeft: -5,
        color: 'grey',
        padding: 0,
    },
    buttonLabel: {
        marginBottom: 8,
        marginTop: 15
    },
    buttonLabel1: {
        marginBottom: 8,
    },
    dividerStyle: {
        marginTop: 20,
        marginBottom: 20
    },
    halfButton: {
        width: '48%',
    },
    daysInput: {
        width: '48%',
        marginBottom: 10
    },
    dropDown: {
        width: '48%',
    },
    italic: {
        fontStyle: 'italic'
    },
    bold: {
        fontWeight: 'bold',
        marginBottom: 15
    },
    updateButton: {
        marginTop: 20
    },
    errorMessage: {
        color: 'red'
    }
});

