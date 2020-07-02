import * as React from 'react';
import {Text, Modal} from 'react-native'

class UserSettings extends React.Component {
    componentDidMount() {
        console.log('Settings component mounted.');
        this.setState({ modalVisible: true })
    }

    showModal() {
        
    }

    render() {
        return (
            <Text>Test</Text>
        )
    }
}
export default UserSettings;