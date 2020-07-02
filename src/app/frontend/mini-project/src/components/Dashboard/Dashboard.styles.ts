import { StyleSheet } from 'react-native';
import { MKColor } from 'react-native-material-kit';

const THEME_PRIMARY_COLOR = '#0a4f28';

export default StyleSheet.create({
    scrollView: {
        flex: 1,
        alignItems: 'stretch',
        padding: 24,
    },
    surface: {
        elevation: 5,
        padding: 10,
        margin: 10
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    chart: {
        width: 10
    }
});

