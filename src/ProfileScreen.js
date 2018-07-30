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
Easing,Alert,
Dimensions,
} from 'react-native';
import Drawer from 'react-native-drawer-menu';
import ActionBar from 'react-native-action-bar'
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
        dataSource: [],
        dbDataSource: [],
        drawer: false,
        W: Dimensions.get('window').width,
        H: Dimensions.get('window').height,
      })
      Dimensions.addEventListener('change', () => {
        this.setState({
        W: Dimensions.get('window').width,
        H: Dimensions.get('window').height,
      })
      })  
      this._syncDb()
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
        
      },1500)
    }
    _syncDb=()=>{
      console.log("Syncing contacts from database")
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM contacts', [], (tx, results) => {
            var len = results.rows.length;
            console.log("array len "+ len)
            if (len>0){
              for (x=0;x<len;x++){
                var rec={id:'',
                name:'',
                email:'',
                address:'',
                gender:'',
                phone:{
                  mobile:'',
                  home: '',
                  office:''}
                }
                rec.id= results.rows.item(x).id
                rec.name= results.rows.item(x).name
                rec.email= results.rows.item(x).email
                rec.address= results.rows.item(x).address
                rec.gender= results.rows.item(x).gender
                console.log(results.rows.item(x).phoneMobile)
                rec.phone.mobile= results.rows.item(x).phoneMobile
                console.log(rec.phone.mobile)
                console.log(results.rows.item(x).phoneHome)
                rec.phone.home= results.rows.item(x).phoneHome
                console.log(rec.phone.home)
                console.log(results.rows.item(x).phoneOffice)
                rec.phone.office= results.rows.item(x).phoneOffice
                console.log(rec.phone.office)
                var arr=this.state.dbDataSource
                arr.push(rec)
                console.log("data array --",arr)
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
  
  
    render() {
      var drawerContent = (<View style={styles.drawerContainer}>
            <TouchableOpacity
            onPress={()=>{
              this.setState({isLoading: true})
              this.refs.myDrawer.closeDrawer()
              this._sync()
            }}
            style={styles.button}
            >
              <Text
              style={{
                fontSize: 20,
                fontFamily: "bold"
              }}
              >
                Sync
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress= {()=>{
              Alert.alert(
                'Confirm',
                'Are you sure?',
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => navigate('Login')},
                ],
                { cancelable: false }
              )
            }}
            style={styles.button}
            >
            <Text
            style={{
              fontSize: 20,
              fontFamily: "bold"
            }}
            >
            Logout
            </Text>
            </TouchableOpacity>
      </View>)
      var customStyles = {
        drawer: {
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowRadius: 10
        },
      }
      const {navigate}=this.props.navigation
      return (
        <Drawer
        ref='myDrawer'
      style={styles.container}
      drawerWidth={250}
      drawerContent={drawerContent}
      disabled={this.state.drawer}
      type={Drawer.types.Overlay}
      customStyles={{drawer: styles.drawer}}
      drawerPosition={Drawer.positions.Left}
      easingFunc={Easing.ease}
    >
        <View style={styles.container} >
        <ActionBar
    containerStyle={{position: 'absolute',top: 0,left:0,width: this.state.W}}
    title={'Your conacts'}
    leftIconName={'menu'}
    onLeftPress={() => {
    this.refs.myDrawer.openDrawer()}
  }
    />
            
            <View
            
            style={{
              backgroundColor: 'white',
              width:this.state.W-60,
              height:this.state.H-130,
              borderWidth:2,
              borderRadius: 10,
              borderColor: '#60a3bc',
              alignItems: 'center',
              justifyContent: 'center'
            }} >
            <View
            style={{
              flex:1,
              backgroundColor: 'white',
              borderWidth:2,
              width:this.state.W-66,
              borderRadius: 10,
              borderColor: '#b8e994',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
            {this.state.isLoading?
            <ActivityIndicator />
            :
            <FlatList
       
            data={ this.state.dbDataSource }
            style={{width: "95%"}}
            ItemSeparatorComponent = {this.FlatListItemSeparator}

            renderItem={({item}) => 
            <View>
              <Text style={styles.FlatListItemStyle} > {item.name} </Text>
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
            }
            
            </View>
            </View>
            
        </View>
      </Drawer>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e3799',
      padding: 15,
    },
    drawerContainer:{
      flex: 1,
      backgroundColor: '#b8e994',
      borderColor: '#4a69bd',
    },
    button: {
      height: 40,
      width: 120,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical : 15,
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
      FlatListItemStyle: {
          padding: 10,
          fontSize: 18,
          height: 44,
        },
  });
  