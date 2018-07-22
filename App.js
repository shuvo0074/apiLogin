import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import HomeScreen from './src/HomeScreen'

const Nav=StackNavigator({
  Login: {screen: HomeScreen},
},{
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#079992',
      height:45,
    }
  }
}
)

export default class App extends Component<{}> {
  render() {
    return (
      <Nav/>
    );
  }
}
