import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  NetInfo,
  ActivityIndicator,
} from 'react-native';
import ActionBar from 'react-native-action-bar'
var SQLite = require('react-native-sqlite-storage')
export default class HomeScreen extends Component<{}> {
    static navigationOptions = {
        title: 'Login',
        headerStyle: {
      backgroundColor: '#079992',
      height:0,
    }
    }
    constructor (props){
      super(props)
      this.state = ({
        uname: '',
        pass: '',
        connection: '',
        isLoading: false,
        dataSource: null,
        url:'',
      })
      this.conStatus()
    }
    conStatus=()=>{
      NetInfo.isConnected.fetch().then(isConnected => {
        if(isConnected)  
         {this.setState ({connection: 'online'})
         //ToastAndroid.show('You are connected to the internet.', ToastAndroid.SHORT);
        }
         else {this.setState ({connection: 'offline'})
         //ToastAndroid.show('You are not connected to the internet !', ToastAndroid.SHORT);
        }
      })
    }

    render() {
    const {navigate}=this.props.navigation
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    else{
      return (
        <View style={styles.container} >
        <ActionBar
    containerStyle={{position: 'absolute',top: 0,left:0,width: '100%'}}
    title={'Home'}
/>
        <TextInput
        placeholder= "    User Name"
        onChangeText={(txt)=>{
          this.setState({uname: txt})
        }}
        style={styles.input}
        />
        <TextInput
        placeholder= "    Password"
        onChangeText={(txt)=>{
          this.setState({pass: txt})
        }}
        secureTextEntry
        style={styles.input}
        />
        <TouchableOpacity
        onPress= {()=>{
          if(this.state.uname===''&&this.state.pass==='')
            {ToastAndroid.show("Insert username and password", ToastAndroid.SHORT)}
            else
          {this.setState({isLoading: true})
          setTimeout(()=>{
            let url='http://202.40.191.226:8084/DHSWEB/LoginS?userid='+this.state.uname+'&password='+this.state.pass+''
            return fetch(url)
           .then((response) => response.json())
           .then((responseJson) => {
             this.setState({
               isLoading: false,
               dataSource: responseJson.loginNodes,
             }, function() {
              if(this.state.dataSource[0].outCode==='1')
              {ToastAndroid.show(this.state.dataSource[0].outMessage+" Error code: "+this.state.dataSource[0].outCode, ToastAndroid.SHORT)}
              else{
              ToastAndroid.show(this.state.dataSource[0].outMessage, ToastAndroid.SHORT)
              console.log("url : -", url +"-")
              console.log(" Data Source ",this.state.dataSource[0])
              console.log("outCode type"+typeof(this.state.dataSource[0].outCode))
              navigate('Profile')}
             })
           })
           .catch((error) => {
             console.error("Error in datasource ",error);
           })
            
          },2000)}
          
        }}
        style={styles.button}
        >
        <Text>
        Log in
        </Text>
        </TouchableOpacity>
        </View>
          )
    }
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e3799',
    },
    button: {
      borderRadius: 7,
      borderWidth:1,
      borderColor: '#4a69bd',
      backgroundColor: '#079992',
      height: 40,
      width: 60,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
    },
    buttonText: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    input: {
      height:50,
      width: 300,
      borderWidth: 2,
      borderRadius:15,
      margin: 15,
      alignItems: 'center',
      backgroundColor: 'white',
      justifyContent: 'center'
  
    },
    profileContainer: {
      backgroundColor: 'white',
      height: 250,
      width:250,
      borderWidth:2,
      borderRadius: 10,
      borderColor: '#60a3bc',
      alignItems: 'center',
      justifyContent: 'center'
    },
  });
  