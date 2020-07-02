import * as React from 'react';
import { Text, Dimensions } from 'react-native';
import { Surface } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { MKColor } from 'react-native-material-kit';
import { Component } from 'react';
import styles from '../Dashboard/Dashboard.styles'

interface TemperatureData {
    'tempF': number;
    'time_posted': string;
}

class Temperature extends Component<any, any> {

    THEME_PRIMARY_COLOR = '#0a4f28';
    
    constructor(props: any) {
        super(props);
    }

    state = {
        data: [{
            id: -1,
            tempF: -1,
            time_posted: ''
        }],
        formattedData: {
            labels: [],
            values: []
        }
    }

    timer: any;

    render () {
        return (
            <React.Fragment>
                <Surface style={styles.surface}>
                    <this.Chart title={'Temperature'} data={this.state.formattedData}/>
                </Surface>
            </React.Fragment>
        );
    }
    
    componentDidMount() {
        console.log('Temperature component mounted.');
        this.getTemperatureData();
        this.timer = setInterval(
          () => this.getTemperatureData(), //call latest 10 posts every 5 seconds
          5000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    formatAMPM(date: Date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        // @ts-ignore
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    getTemperatureData() {
        fetch('http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/temperature')
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({ data: responseJson });
            this.formatTemperatureData(this.state.data);
        });
    }

    formatTemperatureData = (data: Array<TemperatureData>) => {
        let labels = data.map(el => this.formatAMPM(new Date(el.time_posted)));
        let values = data.map(el => el.tempF);
        // @ts-ignore
        this.setState({ formattedData: {labels, values} });
    };

    Chart = (props: any) => {
        return <React.Fragment>
            <Text
                style={{
                    textAlign: 'center',
                    fontSize: 18,
                    padding: 16,
                    marginTop: 16,
                }}>
                {props.title}
            </Text>
            <LineChart
                data={{
                    labels: props.data.labels.length ? props.data.labels : [0],
                    datasets: [
                        {
                            data: props.data.values.length ? props.data.values : [0],
                        },
                    ],
                }}
                width={Dimensions.get('window').width - 50} // from react-native
                height={220}
                yAxisLabel={''}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 0) => `rgba(131, 167, 234, 1)`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </React.Fragment>
    }
}
export default Temperature;