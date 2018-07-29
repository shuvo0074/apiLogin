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
export default class SignupScreen extends Component<{}> {
    static navigationOptions = {
        title: 'Signup',
        headerStyle: {
      backgroundColor: '#079992',
      height:0,
    }
    }
    constructor (props){
      super(props)
      this.state = ({
        name: '',
        rank: '',
        avail: '',
        connection: null,
        isLoading: false,
        dataSource: null,
        url:'',
      })
      this.conStatus()
    }
    _fetchData=async ()=>{
        console.log("inside fetchdata")
        if (this.state.connection)
        {this.setState({isLoading: true})
          let url='http://10.11.201.88:4000/api/ninjas'

          await fetch(url, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name: this.state.name,
              rank: this.state.rank,
              available: this.state.avail,
          }),
          })
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             isLoading: false,
             dataSource: responseJson,
           })
            ToastAndroid.show(this.state.dataSource.name+"is saved", ToastAndroid.SHORT)
            console.log("url : -", url +"-")
            Keyboard.dismiss()
              this.refs.ti1.clear()
              this.refs.ti2.clear()
              this.refs.ti3.clear()
         })
         .catch((error) => {
           console.log("Error in datasource ",error);
         })
        }
        else
        {
          ToastAndroid.show("You are not connected to internet.", ToastAndroid.SHORT)
        }  
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
          this.setState({name: txt})
        }}
        style={styles.input}
        />
        <TextInput
        placeholder= "    Rank"
        ref="ti2"
        onChangeText={(txt)=>{
          this.setState({rank: txt})
        }}
        secureTextEntry
        style={styles.input}
        />
        <TextInput
        placeholder= "    Available"
        ref="ti3"
        onChangeText={(txt)=>{
          this.setState({avail: txt})
        }}
        style={styles.input}
        />
        <TouchableOpacity
         onPress= {this._fetchData}
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
  