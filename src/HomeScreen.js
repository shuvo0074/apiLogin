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
  Keyboard
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
        connection: null,
        isLoading: false,
        dataSource: null,
        url:'',
      })
      this.conStatus()
    }
    conStatus=()=>{
      NetInfo.isConnected.fetch().then(isConnected => {
        console.log("---",isConnected)
        this.setState({connection: isConnected})
      });
       handleFirstConnectivityChange=(isConnected)=> {
        console.log("***",isConnected)
        this.setState({connection: isConnected})
      }
      NetInfo.isConnected.addEventListener(
        'change',
        handleFirstConnectivityChange
      );
    }

    render() {
    const {navigate}=this.props.navigation
      return (
        <View style={styles.container} >
        <ActionBar
    containerStyle={{position: 'absolute',top: 0,left:0,width: '100%'}}
    title={'Home'}
        />
      {this.state.isLoading?
        <ActivityIndicator />
        :
        <View/>
      }
        <TextInput
        placeholder= "    User Name"
        ref="ti1"
        onChangeText={(txt)=>{
          this.setState({uname: txt.toLowerCase()})
        }}
        style={styles.input}
        />
        <TextInput
        placeholder= "    Password"
        ref="ti2"
        onChangeText={(txt)=>{
          this.setState({pass: txt})
        }}
        secureTextEntry
        style={styles.input}
        />
        <TouchableOpacity
        onPress= {()=>{
          if (this.state.connection)
          {
            if(this.state.uname===''&&this.state.pass==='')
            {ToastAndroid.show("Insert username and password", ToastAndroid.SHORT)}
            else
          {this.setState({isLoading: true})
          setTimeout(()=>{
            let url='http://202.40.191.226:8084/DHSWEB/LoginS?userid='+this.state.uname.toLowerCase()+'&password='+this.state.pass+''
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
              Keyboard.dismiss()
              navigate('Profile')
                this.refs.ti1.clear()
                this.refs.ti2.clear()
                this.setState({uname: '', pass: ''})
            }
             })
           })
           .catch((error) => {
             console.error("Error in datasource ",error);
           })
            
          },2000)}
          }
          else
          {
            ToastAndroid.show("You are not connected to internet.", ToastAndroid.SHORT)
          }  
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
  