import React from 'react';
import {
    Headline,
    Surface,
    Button,
    Paragraph,
    IconButton,
    useTheme,
    Divider,
    Subheading,
    List,
    TextInput,
    Dialog, Portal
} from 'react-native-paper';
import styles from './WateringSchedule.styles';
import {View, Text, Alert} from "react-native";
import {formatAMPM} from "../Dashboard/Dashboard.component";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// @ts-ignore
import {Dropdown} from 'react-native-material-dropdown';
import {Textfield, MKColor} from 'react-native-material-kit';

const API_ENDPOINT = 'http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com';

const WateringSchedule = (props: any) => {
    const {colors} = useTheme();
    const [nextWateringTime, setNextWateringTime] = React.useState(new Date());
    const [modificationState, setModificationState] = React.useState(false);
    const [lastFiveWatering, setlastFiveWatering] = React.useState([{
        id: 0,
        notes: '',
        success: false,
        time_posted: '',
        color: ''
    }]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const isNumber = /^\d+$/;
    const frequencyOptions = [{
        value: 'Day',
    }, {
        value: 'Week',
    }, {
        value: 'Month',
    }];
    let timer: any;
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const [formContents, setFormContents] = React.useState({
        frequencyNumber: '1',
        date: new Date()
    });
    const [dialog, setDialog] = React.useState({
        visible: false,
        title: '',
        message: '',
        actionMessage: ''
    });
    React.useEffect(() => {
        getLastFive();
        getNextWatering();
        // returned function will be called on component unmount
        timer = setInterval(
            () => getNextWatering(), // call updated latest 5 posts every 5 seconds
            10000
        );
        return () => {
            clearInterval(timer);
        }
    }, []);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (date: Date) => {
        console.warn("A date has been picked: ", date);
        setFormContents({...formContents, date: date});
        hideDatePicker();
    };

    function getLastFive(): any {
        let url = API_ENDPOINT + '/watering/recent';
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                setlastFiveWatering(responseJson);
                getWateringFailInfo(responseJson);
            });
    }

    function getWateringFailInfo(wateringData: any) {
        wateringData.forEach((post: { color: string; time_posted: string; notes: string; }) => {
            console.log(wateringData);
            if (post.color == 'red') {
                Alert.alert(
                    "Scheduled watering not completed.",
                    "Pump failed to run at " + post.time_posted + " due to " + post.notes + ".",
                    [
                        {
                            text: "Acknowledge"
                        }
                    ] 
                )
            }
        })
    }

    function getNextWatering() {
        let timestamp = Math.floor(new Date().getTime() / 1000);
        console.log('time now is ', timestamp);
        let url = API_ENDPOINT + '/get-next-watering?timestamp=' + timestamp;
        console.log('url is ', url)
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('response is ', responseJson);
                handleNewWateringDate(responseJson.timestamp);
            });
    }

    const handleNewWateringDate = (timestamp: number) => {
        console.log('date is ', new Date(timestamp * 1000));
        setNextWateringTime(new Date(timestamp * 1000));
    };
    const getFormattedWateringTime = () => {
        let d = nextWateringTime;
        return monthNames[d.getMonth()] + ' ' + d.getDate() + nth(d.getDate()) +
            ', ' + d.getFullYear() + ' at ' + formatAMPM(d);
    };
    const getFormattedDate = (d: Date) => {
        return monthNames[d.getMonth()] + ' ' + d.getDate() + nth(d.getDate()) +
            ', ' + d.getFullYear() + ' at ' + formatAMPM(d);
    };
    const nth = function (d: number) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };
    const handleModifySchedule = () => {
        setModificationState(!modificationState);
    };

    const updateSchedule = () => {
        if (!isNumber.test(formContents.frequencyNumber)) {
            return;
        }
        let start = Math.floor(formContents.date.getTime()/1000);
        let period = parseInt(formContents.frequencyNumber)*24/*hours*/*60/*minutes*/*60/*seconds*/;
        fetch(API_ENDPOINT + '/schedule', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startTimestamp: start,
                period: period
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('post request response is ', responseJson);
                getNextWatering();
                setModificationState(false);
                if ('resultCode' in responseJson && responseJson.resultCode === 200) {
                    setDialog({
                        title: '✅ Success',
                        message: 'Successfully updated the watering schedule.',
                        actionMessage: 'OK',
                        visible: true
                    })
                } else {
                    setDialog({
                        title: '❌ Error',
                        message: 'Something went wrong, please try again.',
                        actionMessage: 'OK',
                        visible: true
                    })
                }
            });
    };


    const hideDialog = () => setDialog({ ...dialog, visible: false });

    return (
        <React.Fragment>
            <Surface style={styles.surface}>
                {
                    !modificationState ?
                        <React.Fragment>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Headline style={styles.headline1}>Watering Schedule</Headline>
                                <IconButton
                                    icon="calendar-edit"
                                    color={colors.accent}
                                    onPress={() => handleModifySchedule()}
                                />
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap', paddingBottom: 10}}>
                                <List.Icon icon="clock" style={styles.icon}/>
                                <Subheading>Next is on {getFormattedWateringTime()}</Subheading>
                            </View>
                            <Text style={styles.lastFivePumps}>Last Five Pumps</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap'}}>
                                {
                                    lastFiveWatering.map((post, i) => (
                                        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap', borderWidth: 1, padding: 5, backgroundColor: post.color}}>
                                            <Text style={styles.pumpTimes}>{post.time_posted.substring(5, 10)}</Text>
                                        </View>
                                    ))
                                }                              
                            </View>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <IconButton
                                    icon="keyboard-backspace"
                                    color={colors.accent}
                                    onPress={() => handleModifySchedule()}
                                />
                                <Headline style={styles.headline1}>Modify Watering Schedule</Headline>
                            </View>
                            <Subheading style={styles.buttonLabel}>When to do the first watering?</Subheading>
                            <Paragraph style={styles.bold}>{getFormattedDate(formContents.date)}</Paragraph>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around',}}>
                                <Button icon="calendar" mode="contained" dark color={colors.accent}
                                        onPress={() => showDatePicker()}>
                                    First Watering Date
                                </Button>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="datetime"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </View>
                            <Divider style={styles.dividerStyle}/>
                            <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                                <Subheading style={styles.buttonLabel1}>How often?</Subheading>
                                <Paragraph style={styles.italic}>(In days)</Paragraph>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                <TextInput
                                    style={styles.daysInput}
                                    label='Days'
                                    mode='outlined'
                                    error={!(isNumber.test(formContents.frequencyNumber))}
                                    value={formContents.frequencyNumber}
                                    onChangeText={text => setFormContents({...formContents, frequencyNumber: text})}
                                    theme={{
                                        colors: {
                                            primary: colors.accent,
                                        }
                                    }}
                                />
                            </View>
                            {
                                !isNumber.test(formContents.frequencyNumber) &&
                                    <Paragraph style={styles.errorMessage}>Frequency must be a number.</Paragraph>
                            }
                            <Button style={styles.updateButton} icon="calendar-edit" mode="contained" dark color={colors.primary}
                                    disabled={!isNumber.test(formContents.frequencyNumber)}
                                    onPress={() => updateSchedule()}>
                                Update
                            </Button>

                        </React.Fragment>
                }
                <Portal>
                    <Dialog
                        visible={dialog.visible}
                        onDismiss={hideDialog}>
                        <Dialog.Title>{dialog.title}</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{dialog.message}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>{dialog.actionMessage}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </Surface>
        </React.Fragment>
    );
};
export default WateringSchedule;
