import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Text,
  Pressable,
  Image,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Icon,
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

  const [visible, setVisible] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);

  const [pdfcache, setPdfcache] = React.useState();

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [load, setLoad] = useState(false);

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
    const jsonData = {
      mail: userdata.mail,
    };

    const axiosSend = async () => {
      try {
        const url = API_URL + '/deluser';
        await axios.post(url, jsonData).then(() => {
          const rm = async () => {
            await cache.clearAll();
          };
          rm();
          setLoad(false);
          navigation.navigate('UserLogin');
        });
      } catch (error) {
        setLoad(false);
        // setMail('');
        // setLoad(false);
        // console.log(error)
      }
    };
    axiosSend();
  }

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  if (load) {
    return <Loading loadtext={'Connecting to Server'} />;
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{backgroundColor: '#F7F7F7'}}>
          <Animatable.View
            animation={'bounceIn'}
            duration={2000}
            useNativeDriver>
            <Dialog.Icon icon="alert" size={40} color="#C40234" />
            <Dialog.Title style={{textAlign: 'center', color: '#C40234'}}>
              Account Delete
            </Dialog.Title>
          </Animatable.View>
          <Dialog.Content>
            <Text style={{color: 'black', fontSize: 17, textAlign: 'center'}}>
              Are you sure you want to delete your account?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)} textColor="#6F2DA8">
              Cancel
            </Button>
            <Button
              onPress={() => {
                setVisible(false);
                delUser();
              }}
              textColor="#6F2DA8">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={visible1}
          onDismiss={() => setVisible1(false)}
          style={{backgroundColor: '#F7F7F7'}}>
          <Animatable.View
            animation={'bounceIn'}
            duration={2000}
            useNativeDriver>
            <Dialog.Icon icon="information" size={40} color="#FFBF00" />
            <Dialog.Title style={{textAlign: 'center', color: '#FFBF00'}}>
              Switch Account
            </Dialog.Title>
          </Animatable.View>
          <Dialog.Content>
            <Text style={{color: 'black', fontSize: 17, textAlign: 'center'}}>
              Are you sure you want to switch accounts?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible1(false)} textColor="#6F2DA8">
              Cancel
            </Button>
            <Button
              onPress={() => {
                setVisible1(false);
                navigation.navigate('UserLogin');
              }}
              textColor="#6F2DA8">
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView style={styles.scroll}>
        <View style={{alignItems: 'center', marginTop: 50}}>
          <Image
            source={{uri: userdata.photo}}
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
            }}>
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
            }}>
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

        {/* <Animatable.View animation={'slideInUp'} useNativeDriver style={styles.center}>
          <Text  style={styles.header}>{userdata.roll} Account</Text>
          <Text style={styles.subHeader}>Version 1.10</Text>
        </Animatable.View> */}

        {/* <Animatable.View animation={'slideInRight'} useNativeDriver style={styles.section}>
          <View  style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon source="memory" size={50} color="#007FFF" />
          </View>
          <Text style={styles.title}>Private Memory Usage</Text>
          <Text style={styles.text}>
            <Icon source="file-pdf-box" color="#007FFF" size={20} />{" "}PDF File : {pdfcache}
          </Text>
        </Animatable.View> */}

        {/* <Animatable.View animation={'slideInLeft'} useNativeDriver style={styles.section}>
          <View  style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon source="shield-account" size={50} color="#007FFF" />
          </View>
          <Text style={styles.title}>User Profile</Text>
          <Text style={styles.text}>
            <Icon source="account" color="#007FFF" size={20} /> {userdata.name}
          </Text>
          <Text style={styles.text}>
            <Icon source="email" color="#007FFF" size={20} /> {userdata.mail}
          </Text>
          <Text style={styles.text}>
            <Icon source="book-education" color="#007FFF" size={20} />{' '}
            {userdata.dept}
          </Text>

          <Text style={styles.text}>
            <Icon
              source={
                userdata.gender === 'Male' ? 'gender-male' : 'gender-female'
              }
              size={20}
              color={'#007FFF'}
            />
            {'  '}
            {userdata.gender}
          </Text>
        </Animatable.View> */}

        {/* <Animatable.View
          animation={'slideInRight'}
          useNativeDriver
          style={styles.section}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon source="account-circle" size={50} color="#007FFF" />
          </View>

          <Text style={styles.title}>Account Activity</Text>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 20,
            }}>
            <Pressable style={{width: '45%'}} onPress={() => setVisible1(true)}>
              {({pressed}) => (
                <Surface
                  elevation={4}
                  style={[
                    styles.surface,
                    pressed && {backgroundColor: '#6F2DA8'},
                  ]}>
                  <Text style={{color: 'white', fontSize: 16, fontWeight: 700}}>
                    <Icon source="account-switch" color={'white'} size={17} />{' '}
                    Switch
                  </Text>
                </Surface>
              )}
            </Pressable> */}

        {/* onPress={() => setVisible(true)} */}
        {/* <Pressable
              style={{width: '45%'}}
              onPress={() => navigation.navigate('CameraScreen')}>
              {({pressed}) => (
                <Surface
                  elevation={4}
                  style={[
                    styles.surface2,
                    pressed && {backgroundColor: '#E5E4E2'},
                  ]}>
                  <Text
                    style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
                    <Icon source="delete" color="white" size={20} /> Delete
                  </Text>
                </Surface>
              )}
            </Pressable>
          </View>
        </Animatable.View> */}

        {/* <View style={[styles.section, {marginBottom: 30}]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon source="android" size={50} color="#007FFF" />
          </View>
          <Text style={styles.title}>Developer Support</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.linkedin.com/in/ragavandevp/')
              }
              style={styles.iconCircle}>
              <Icon source="linkedin" size={50} color="#007FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://github.com/ragavanperarasu')
              }
              style={styles.iconCircle}>
              <Icon source="github" size={50} color="#000000ff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://ragavan.vercel.app/')}
              style={styles.iconCircle}>
              <Icon source="web" size={50} color="#189ea3ff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://wa.me/919487745405')}
              style={styles.iconCircle}>
              <Icon source="whatsapp" size={50} color="#4ad151ff" />
            </TouchableOpacity>
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#ffffffff',
  },
  center: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderRadius: 20,
    elevation: 15,
    marginTop: 10,
  },
  header: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'sans-serif-condensed',
    marginTop: 5,
  },
  subHeader: {
    fontSize: 15,
    fontFamily: 'sans-serif-condensed',
    color: '#8B8589',
  },
  section: {
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 20,
    elevation: 15,
  },
  title: {
    color: '#007FFF',
    fontSize: 20,
    fontFamily: 'sans-serif-condensed',
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 5,
  },
  text: {
    fontSize: 18,
    fontFamily: 'sans-serif-condensed',
    marginVertical: 10,
    color: '#8B8589',
  },
  button: {
    backgroundColor: '#00A550',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
  butlab: {
    color: 'white',
    fontSize: 18,
    padding: 5,
  },
  button1: {
    backgroundColor: '#E60026',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
  butlab1: {
    color: 'white',
    fontSize: 18,
    padding: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  iconCircle: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    padding: 8,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#00A550',
  },
  surface2: {
    padding: 8,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#E60026',
  },
});
