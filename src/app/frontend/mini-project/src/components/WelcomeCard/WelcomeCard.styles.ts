import { StyleSheet } from 'react-native';
import { MKColor } from 'react-native-material-kit';

const THEME_PRIMARY_COLOR = '#0a4f28';

export default StyleSheet.create({
    scrollView: {
        flex: 1,
        alignItems: 'stretch',
        margin: 10
        // padding: 24,
    },
    cardTitle: {
        fontSize: 40,
        fontWeight: "bold",
        marginTop: -60,
        paddingLeft: 15,
        color: THEME_PRIMARY_COLOR
    },
    startButton: {
        color: THEME_PRIMARY_COLOR
    },
    cardImage: {
        width: '100%',
        height: 200
    },
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 7,
        marginRight: 7,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginTop: 10,
        marginBottom: 20,
    },
    legendLabel: {
        textAlign: 'center',
        color: '#666666',
        marginTop: 10,
        marginBottom: 20,
        fontSize: 12,
        fontWeight: '300',
    },
    toggleTextOn: {
        fontSize: 18,
        color: MKColor.Lime,
    },
    toggleTextOff: {
        fontSize: 18,
        color: MKColor.BlueGrey,
    },
    getStartedButton: {
        marginTop: 20
    },
    surface: {
        elevation: 10,
    },
});
