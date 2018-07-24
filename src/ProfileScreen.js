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
var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'contactsDB', createFromLocation : "~contacts.db", location: 'Library'});
export default class ProfileScreen extends Component<{}> {
    static navigationOptions = {
        title: 'Your Contacts',
    }
    constructor (props){
      super(props)
      this.state = ({
        isLoading: false,
        dataSource: null,
        dbDataSource: null,
      })
      this._sync()
    }
    _sync=()=>{
      this.setState({isLoading: true})
      setTimeout(()=>{
      console.log("Syncing contacts")
      return fetch('https://api.androidhive.info/contacts/')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            dataSource: responseJson.contacts,
            dbDataSource: responseJson.contacts,
          }, ()=> {
            console.log(" Contact Source ",this.state.dataSource)
            console.log("Database")
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM contacts', [], (tx, results) => {});
        })
        db.transaction((tx) => {
          for (let x=0;x<this.state.dataSource.length;x++){
            tx.executeSql('INSERT INTO contacts ( id , name , email , address , gender , phoneMobile , phoneHome , phoneOffice ) VALUES ( \'' + this.state.dataSource[x].id +'\' , \''+ this.state.dataSource[x].name +'\' , \''+this.state.dataSource[x].email+'\' , \''+this.state.dataSource[x].address+'\' , \''+this.state.dataSource[x].gender+'\' , \''+this.state.dataSource[x].phone.mobile+'\' , \''+this.state.dataSource[x].phone.home+'\' , \''+this.state.dataSource[x].phone.office+'\' )', [], (tx, results) => {
              console.log("Query completed",x);
            })}
        })
        this._syncDb()
          });
        })
        .catch(() => {
          console.log("Error in datasource ");
        });
        
      },2000)
    }
    _syncDb=()=>{
      console.log("Syncing contacts from database")
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM contacts', [], (tx, results) => {
            var len = results.rows.length;
            console.log("array len "+ len)
            if (len>0){
              for (x=0;x<len;x++){
                var rec
                rec.id= results.rows.item(x).id
                rec.name= results.rows.item(x).name
                rec.email= results.rows.item(x).email
                rec.address= results.rows.item(x).address
                rec.gender= results.rows.item(x).gender
                rec.phone.mobile= results.rows.item(x).phone.mobile
                rec.phone.home= results.rows.item(x).phone.home
                rec.phone.office= results.rows.item(x).phone.office
                var arr=this.state.dbDataSource
                arr.push(rec)
                this.setState({dbDataSource: arr})
              }
            }
          });
      })
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
            <TouchableOpacity
            onPress={()=>{
              this.setState({isLoading: true})
              this._sync()
            }}
            style={styles.button}
            >
              <Text>
                Sync
              </Text>
            </TouchableOpacity>
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
       
            data={ this.state.dbDataSource }
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
  