import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
FlatList,
} from 'react-native';
export default class ProfileScreen extends Component<{}> {
    static navigationOptions = {
        title: 'Profile',
    }
    constructor (props){
      super(props)
      this.state = ({
        isLoading: false,
        dataSource: null,
      })
    }
    componentDidMount() {
    
      return fetch('https://api.androidhive.info/contacts/')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            dataSource: responseJson.contacts
          }, function() {
            console.log(" Data Source ",this.state.dataSource)
          });
        })
        .catch((error) => {
          console.error("Error in datasource ",error);
        });
    }

    FlatListItemSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#607D8B",
          }}
        />
      );
    }
  
    GetFlatListItem= (fruit_name)=> {
     
    Alert.alert(fruit_name);
  
    }
  
  
    render() {
  
      if (this.state.isLoading) {
        return (
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        );
      }
      const {navigate}=this.props.navigation
      return (
        <View style={styles.container} >
            <View
            
            style={styles.profileContainer} >
            <View
            style={{
              flex:1,
              backgroundColor: 'white',
              borderWidth:2,
              width:295,
              borderRadius: 10,
              borderColor: '#b8e994',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
            <FlatList
       
            data={ this.state.dataSource }
            style={{width: "95%"}}
            ItemSeparatorComponent = {this.FlatListItemSeparator}

            renderItem={({item}) => 
            <View>
              <Text style={styles.FlatListItemStyle} onPress={()=>{
              this.GetFlatListItem
            }} > {item.name} </Text>
            <Text>
              {item.email}
            </Text>
            <Text>
              {item.address}
            </Text>
            <Text>
              {item.gender}
            </Text>
            <Text>
              {item.phone.mobile}
            </Text>
            <Text>
              {item.phone.home}
            </Text>
            <Text>
              {item.phone.office}
            </Text>
              </View>
          }

            keyExtractor={(item, index) => index.toString()}
            
      />
            </View>
            </View>
            <TouchableOpacity
            onPress= {()=>{
              navigate('Login')
            }}
            style={styles.button}
            >
            <Text>
            Logout
            </Text>
            </TouchableOpacity>
        </View>
      );
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
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    profileContainer: {
      backgroundColor: 'white',
      width:300,
      height:450,
      borderWidth:2,
      borderRadius: 10,
      borderColor: '#60a3bc',
      alignItems: 'center',
      justifyContent: 'center'
    },
    MainContainer :{

      justifyContent: 'center',
      flex:1,
      margin: 10,
      paddingTop: (Platform.OS === 'ios') ? 20 : 0,
      
      },
      
      FlatListItemStyle: {
          padding: 10,
          fontSize: 18,
          height: 44,
        },
  });
  