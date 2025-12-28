import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Text,
  Pressable,
  Image,
  ToastAndroid,
  Vibration
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,

  Surface,
  Switch,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Loading from './components/Loading';
import {API_URL} from '@env';
import RNFetchBlob from 'react-native-blob-util';
import * as Animatable from 'react-native-animatable';
import StudentTitle from './TileBar/StudentTitle';
import HeaderLogo from './components/HeaderLogo';
import Feather from 'react-native-vector-icons/Feather';
import RBSheet from "react-native-raw-bottom-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

export default function About() {
  const navigation = useNavigation();
  const [userdata, setUserdata] = useState({});


  const [pdfcache, setPdfcache] = React.useState();

  const [load, setLoad] = useState(false);

  const refRBSheetLogout = useRef();
  const refRBSheetDelete = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const std = await cache.get('userdata');
      setUserdata(std);

      const dirs = RNFetchBlob.fs.dirs;
      const folderPath = `${dirs.DocumentDir}`;

      const fileStat = await RNFetchBlob.fs.stat(folderPath);
      const sizeInMB = fileStat.size / (1024 * 1024);
      setPdfcache(sizeInMB.toFixed(3) + ' MB');
    };
    fetchData();
  }, []);

  function delUser() {
    setLoad(true);
    const axiosSend = async () => {
      try {
        const url = `http://192.168.150.104:5000/app/users/delete/${userdata._id}`;
        console.log("url:", url);
        await axios.delete(url).then(async (res)=> {
          if(res.data.status === 'success'){
            await cache.clearAll();
            ToastAndroid.show('Account deleted successfully', ToastAndroid.SHORT);
            Vibration.vibrate(100);
            setLoad(false);
            navigation.navigate('UserLogin');
            return;
          }
          else{
            ToastAndroid.show('Failed to delete account', ToastAndroid.SHORT);
            Vibration.vibrate(100);
            setLoad(false);
            return;
          }
        });
      } catch (error) {
        ToastAndroid.show("Something Issue", ToastAndroid.SHORT);
        console.log(error)
        setLoad(false);
      }
    };
    axiosSend();
  }



  if (load) {
    return <Loading/>;
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>

      <RBSheet
  ref={refRBSheetDelete}
  closeOnDragDown={true}
  closeOnPressMask={true}
  height={300}
  customStyles={{
    container: styles.sheetContainer,
    draggableIcon: styles.dragIcon,
  }}
>
  {/* Icon */}
  <View style={styles.iconContainer}>
    <Feather name="trash-2" color="#C40234" size={42} />
  </View>

  {/* Title */}
  <Text style={styles.rtitle}>Delete Account</Text>

  {/* Message */}
  <Text style={styles.message}>
  Are you sure you want to delete your account? This will permanently delete
  your profile, posts, likes, and all related data. This action cannot be undone.
</Text>


  {/* Buttons */}
  <View style={styles.buttonRow}>
    <TouchableOpacity
      style={[styles.rbutton, styles.cancelBtn]}
      onPress={() => refRBSheetDelete.current.close()}
    >
      <Text style={styles.cancelText}>Cancel</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.rbutton, styles.logoutBtn]}
      onPress={async () => {
        refRBSheetDelete.current.close();
        delUser();
      }}
    >
      <Feather name="trash" color="#fff" size={16} />
      <Text style={styles.logoutText}> Delete</Text>
    </TouchableOpacity>
  </View>
</RBSheet>


<RBSheet
  ref={refRBSheetLogout}
  closeOnDragDown={true}
  closeOnPressMask={true}
  height={250}
  customStyles={{
    container: styles.sheetContainer,
    draggableIcon: styles.dragIcon,
  }}
>
  {/* Icon */}
  <View style={styles.iconContainer}>
    <Feather name="log-out" color="#C40234" size={42} />
  </View>

  {/* Title */}
  <Text style={styles.rtitle}>Logout</Text>

  {/* Message */}
  <Text style={styles.message}>
    Are you sure you want to logout from this account?
  </Text>

  {/* Buttons */}
  <View style={styles.buttonRow}>
    <TouchableOpacity
      style={[styles.rbutton, styles.cancelBtn]}
      onPress={() => refRBSheetLogout.current.close()}
    >
      <Text style={styles.cancelText}>Cancel</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.rbutton, styles.logoutBtn]}
      onPress={async () => {
        refRBSheetLogout.current.close();
        await cache.remove("userdata");
        navigation.navigate('UserLogin')
      }}
    >
      <Feather name="power" color="#fff" size={16} />
      <Text style={styles.logoutText}> Logout</Text>
    </TouchableOpacity>
  </View>
</RBSheet>


      <ScrollView style={styles.scroll}>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Image
            source={{uri: userdata.profile}}
            style={{height: 100, width: 100, borderRadius: 100}}
          />
          <Text
            style={{
              fontFamily: 'Momo Trust Display',
              color: 'black',
              marginTop: 10,
              fontSize: 20,
            }}>
            {userdata.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Philosopher',
              color: '#8B8589',
              marginTop: 10,
              fontSize: 18,
            }}>
            {userdata.email}
          </Text>
          <Text
            style={{
              fontFamily: 'Philosopher',
              color: '#8B8589',
              marginTop: 10,
              fontSize: 18,
            }}>
            Version 1.10
          </Text>
        </View>

        <View style={{marginLeft: 10}}>
          <Text
            style={{
              color: '#808080',
              marginLeft: 5,
              fontFamily: 'Momo Trust Display',
              fontSize: 14,
              marginTop: 10,
            }}>
            Your Post
          </Text>
        </View>


        <View
          style={{
            backgroundColor: '#eeeeeeff',
            margin: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 15,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <MaterialCommunityIcons name="notebook-edit-outline" size={20} color="#008080" />
            <Text
              style={{
                color: '#008080',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Reference Notes
            </Text>
          </TouchableOpacity>
          <View style={{borderColor: '#C0C0C0', borderWidth: 0.5}}></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <MaterialCommunityIcons name="clipboard-edit-outline" size={20} color="#6F2DA8" />
            <Text
              style={{
                color: '#6F2DA8',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Semester Questions 
            </Text>
          </TouchableOpacity>
          <View style={{borderColor: '#C0C0C0', borderWidth: 0.5}}></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <MaterialCommunityIcons name="bookshelf" size={20} color="#c93702ff" />
            <Text
              style={{
                color: '#c93702ff',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Reference Material
            </Text>
          </TouchableOpacity>
          <View style={{borderColor: '#C0C0C0', borderWidth: 0.5}}></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={20} color="#8d4b89ff" />
            <Text
              style={{
                color: '#8d4b89ff',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Unit Test Questions
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginLeft: 10}}>
          <Text
            style={{
              color: '#808080',
              marginLeft: 5,
              fontFamily: 'Momo Trust Display',
              fontSize: 14,
              marginTop: 10,
            }}>
            Profile Edit
          </Text>
        </View>


        <View
          style={{
            backgroundColor: '#eeeeeeff',
            margin: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 15,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <MaterialCommunityIcons name="rename-box" size={20} color="#008080" />
            <Text
              style={{
                color: '#008080',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Change Username
            </Text>
          </TouchableOpacity>
          <View style={{borderColor: '#C0C0C0', borderWidth: 0.5}}></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }} onPress={()=>refRBSheetLogout.current.open()}>
            <MaterialCommunityIcons name="account-circle-outline" size={20} color="#246BCE" />
            <Text
              style={{
                color: '#246BCE',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Change Profile Picture
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginLeft: 10}}>
          <Text
            style={{
              color: '#808080',
              marginLeft: 5,
              fontFamily: 'Momo Trust Display',
              fontSize: 14,
              marginTop: 10,
            }}>
            Memory Usage
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#eeeeeeff',
            margin: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 8,
            }}>
            <Feather name="cpu" size={20} color="#808080" />
            <Text
              style={{
                color: '#808080',
                marginLeft: 5,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Privet Memory : {pdfcache}
            </Text>
          </View>
        </View>

        <View style={{marginLeft: 10}}>
          <Text
            style={{
              color: '#808080',
              marginLeft: 5,
              fontFamily: 'Momo Trust Display',
              fontSize: 14,
              marginTop: 10,
            }}>
            User Account
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#eeeeeeff',
            margin: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 15,
            marginBottom:70
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Feather name="cloud" size={20} color="#008080" />
            <Text
              style={{
                color: '#008080',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
          <View style={{borderColor: '#C0C0C0', borderWidth: 0.5}}></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }} onPress={()=>refRBSheetLogout.current.open()}>
            <Feather name="log-out" size={20} color="#246BCE" />
            <Text
              style={{
                color: '#246BCE',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Logout
            </Text>
          </TouchableOpacity>
          <View style={{borderColor: '#C0C0C0', borderWidth: 0.5}}></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }} onPress={()=>refRBSheetDelete.current.open()}>
            <Feather name="user-x" size={20} color="#B31B1B" />
            <Text
              style={{
                color: '#B31B1B',
                marginLeft: 10,
                fontFamily: 'Philosopher',
                fontSize: 18,
              }}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#ffffffff',
  },

  // RBSheet styles
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  dragIcon: {
    backgroundColor: "#ccc",
    width: 50,
  },

  iconContainer: {
    marginVertical: 10,
  },

  rtitle: {
    fontSize: 20,
    fontFamily: 'Momo Trust Display',
    color: "#C40234",
    marginTop: 5,
  },

  message: {
    textAlign: "center",
    fontFamily: 'Philosopher',
    fontSize: 16,
    color: "#333",
    marginVertical: 15,
  },

  buttonRow: {
    flexDirection: "row",
    width:'100%',
    marginTop: 10,
  },

  rbutton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginHorizontal: 10,
  },

  cancelBtn: {
    backgroundColor: "#E0E0E0",
  },

  logoutBtn: {
    backgroundColor: "#C40234",
  },

  cancelText: {
    color: "#333",
    fontSize: 16,
    fontFamily: 'Philosopher',
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'Philosopher',
  },
});
