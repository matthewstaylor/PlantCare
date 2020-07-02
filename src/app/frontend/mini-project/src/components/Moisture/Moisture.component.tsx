import React, {Component, useState} from 'react';
import { Text, Alert, View, FlatList, StyleSheet } from 'react-native';

export default class Moisture extends Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    timer: any;
 
    state = {
        data: [{
            id: -1,
            moisture_content: -1,
            time_posted: ''
        }],
    }

    styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#EEEEEE',
          alignItems: 'center',
          justifyContent: 'center',
        },
    
        postView: {
          borderWidth: 1,
          borderColor: '#8ba764',
          backgroundColor: '#f5f5f0'

        },
    
        heading: {
          fontSize: 25,
          color: '#286e23',
          padding: 15,
          borderWidth: 2,
          borderColor: '#8ba764',
        },

        postInfo: {
          color: '#286e23',
        },
    
        postSplit: {
          padding: 10,
          borderWidth: 1,
          borderColor: '#8ba764'
        }
      });

    render() {
        return (
            <View style={this.styles.postView}>
                <Text style={this.styles.heading}>Last 5 Moisture Readings</Text>
                {
                    this.state.data.map(post => (
                    <View style={this.styles.postSplit}>
                        <Text style={this.styles.postInfo}>- {'\t'}Moisture Content: {post.moisture_content}%</Text>
                        <Text style={this.styles.postInfo}>- {'\t'}Time: {post.time_posted}</Text>
                    </View>
                    ))
                }
            </View>
        )   
    }

    componentDidMount() {
      console.log('I mount');
      this.getMoistureData();
      this.timer = setInterval(
        () => this.getMoistureData(), //call updated latest 5 posts every 5 seconds
        5000
      );
    }

    componentWillUnmount() {
      clearInterval(this.timer);
    }

    getMoistureData() {
      fetch('http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/moisture')
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState({ data: responseJson });
      });
    }

}