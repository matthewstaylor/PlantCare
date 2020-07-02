import React from 'react';
import {Text, Dimensions, View, ScrollView, Image} from 'react-native';
import {Headline, Surface, Button, Card, Title, Paragraph, Divider} from 'react-native-paper';
import styles from './Dashboard.styles';
import _ from 'lodash';
import {
    LineChart,
} from 'react-native-chart-kit';
import WateringSchedule from "../WateringSchedule/WateringSchedule.component";

interface MoistureData {
    id: number;
    moisture_content: 0;
    time_posted: string;
}

const Dashboard = (props: any) => {
    const [moistureData, setMoistureData] = React.useState({
        labels: [],
        values: []
    });
    let timer: any;
    React.useEffect(() => {
        getMoistureData();
        // returned function will be called on component unmount
        timer = setInterval(
            () => getMoistureData(), // call updated latest 5 posts every 5 seconds
            5000
        );
        return () => {
            clearInterval(timer);
        }
    }, []);

    const formatMoistureData = (data: Array<MoistureData>) => {
        if (data.length) {
            let labels = data.map(el => formatAMPM(new Date(el.time_posted)));
            let values = data.map(el => el.moisture_content);
            // @ts-ignore
            setMoistureData({labels: labels, values: values});
        }
    };

    function getMoistureData() {
        fetch('http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/moisture')
            .then((response) => response.json())
            .then((responseJson) => {
                formatMoistureData(responseJson);
                // setMoistureData(responseJson);
            });
    }

    return (
        <React.Fragment>
            <Surface style={styles.surface}>
                <Chart title={'Moisture'} data={moistureData}/>
            </Surface>
        </React.Fragment>
    );
};
export default Dashboard;

export function formatAMPM(date: Date) {
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

const Chart = (props: any) => {
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
};
