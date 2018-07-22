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
export default class HomeScreen extends Component<{}> {
    static navigationOptions = {
        title: 'Login',
    }
    constructor (props){
      super(props)
      this.state = ({
        uname: 'a',
        pass: 'a',
        connection: '',
        isLoading: false,
        dataSource: null,
        loggedIn: false,
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
    if (this.state.loggedIn){
      return(
            <View
            style={{flex:1,
            alignItems:'center',
          justifyContent:'center',
          backgroundColor: '#1e3799',

        }}
            >
            <View          
            style={styles.profileContainer} >
            <View
            style={{
              backgroundColor: 'white',
              height: 246,
              width:246,position: 'absolute',
              borderWidth:2,
              borderRadius: 10,
              borderColor: '#b8e994',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
            <Text>
            {this.state.dataSource[0].outMessage}
          </Text>
          <Text>
            out Code {this.state.dataSource[0].outCode}
          </Text>
        </View>
        </View>
        <TouchableOpacity
        onPress= {()=>{
          this.setState({loggedIn: false})
          console.log("Logged out")
        }}
        style={styles.button}
        >
        <Text>
        Log out
        </Text>
        </TouchableOpacity>
        </View>
      )
    }
    else{
      return (
        <View style={styles.container} >
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
        style={styles.input}
        />
        <TouchableOpacity
        onPress= {()=>{
          this.setState({isLoading: true,
          })
          let url='http://202.40.191.226:8084/DHSWEB/LoginS?userid='+this.state.uname+'&password='+this.state.pass+''
          return fetch(url)
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             isLoading: false,
             dataSource: responseJson.loginNodes,
             loggedIn: true,
           }, function() {
             console.log("url : -", url +"-")
             console.log(" Data Source ",this.state.dataSource)
           })
         })
         .catch((error) => {
           console.error("Error in datasource ",error);
         })
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
  