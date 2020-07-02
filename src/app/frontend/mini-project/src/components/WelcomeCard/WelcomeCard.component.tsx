import React from 'react';
import {Text, View, ScrollView, Image} from 'react-native';
import {Surface, Button, Card, Title, Paragraph, Divider} from 'react-native-paper';
import styles from './WelcomeCard.styles';

const welcomeBackground = '../../../assets/welcome-background.jpg';
const WelcomeCard = (props: any) => {
    const [dismissed, dismiss] = React.useState(false);
    if (!dismissed)
        return (
            <View style={{...styles.scrollView, ...props.style}}>
                <Surface style={styles.surface}>
                    <Image resizeMode={'cover'}
                           source={require(welcomeBackground)} style={styles.cardImage}/>
                    <Text style={styles.cardTitle}>Welcome</Text>
                    <View // TextView padding not handled well on Android https://github.com/facebook/react-native/issues/3233
                        style={{
                            padding: 15,
                            paddingTop: 25
                        }}>
                        <Text style={{padding: 0}}>
                            Let's take some good care of your plants! 🌿 Everything you need you will find in this
                            app.
                        </Text>
                        <Button compact={true} style={styles.getStartedButton} icon="rocket"
                                mode="contained" onPress={() => dismiss(true)}>
                            Let's get Started!
                        </Button>
                    </View>
                </Surface>
            </View>);
    else
        return null;
};
export default WelcomeCard;
