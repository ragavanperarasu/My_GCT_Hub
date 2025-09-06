import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  ToastAndroid,
  Pressable,
  Vibration,
} from 'react-native';
import {TextInput, Surface, Icon} from 'react-native-paper';
import {Cache} from 'react-native-cache';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import LottieView from 'lottie-react-native';
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useFirebaseNotification} from '../screens/functions/useFirebaseNotification';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import BootSplash from 'react-native-bootsplash';
import Loading from './components/Loading';
import useNetworkStatus from './functions/useNetworkStatus';

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

export default function UserLogin() {
  const navigation = useNavigation();
  const netc = useNetworkStatus();

  const [mail, setMail] = useState('');
  const [regno, setRegno] = useState('');
  const [loadtext, setLoadtext] = useState('Connecting to server');

  const [load, setLoad] = useState(false);

  const fcmToken = useFirebaseNotification();

  useEffect(() => {
    const timer = setTimeout(() => {
      BootSplash.hide({fade: true});
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       const onBackPress = () => {
  //         return true;
  //       };

  //       BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //       return () => {
  //   BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  // };

  //     }, []),
  //   );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  if (load) {
    return <Loading loadtext={loadtext} />;
  }

  function loginBackend() {
    const jsonData = {
      mail: mail,
      regno: regno,
    };

    const axiosSend = async () => {
      try {
        const url = API_URL + '/userdata';
        console.log(API_URL);
        await axios.post(url, jsonData).then(res => {
          const resData = res.data;
          setLoad(false);

          if (resData === 'faild') {
            setMail('');
            ToastAndroid.show('Access Denied', ToastAndroid.SHORT);
            Vibration.vibrate(100);
          } else {
            setLoad(true);
            sendToken(resData);
            setLoadtext('Fetching data...');
            const setcahe = async () => await cache.set('userdata', resData);
            setcahe();
            setLoad(false);

            navigation.navigate('StudentHome');
            sendLocalNotification(resData.name);
          }
        });
      } catch (error) {
        setMail('');
        setLoad(false);
        ToastAndroid.show('Server Connection Problem', ToastAndroid.SHORT);
        Vibration.vibrate(100);
      }
    };
    axiosSend();
  }

  function sendToken(rdata) {
    const jsonData = {
      mail: mail,
      token: fcmToken,
      dept: rdata.dept,
      gender: rdata.gender,
    };

    const axiosSend = async () => {
      try {
        const url = API_URL + '/nottoken';

        await axios.post(url, jsonData);
      } catch (error) {
        setMail('');
        setLoad(false);
      }
    };
    axiosSend();
  }

  function handleClick() {
    if (mail === '' || regno === '') {
      ToastAndroid.show('Please, Complete all fields', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else if (!mail.includes('@')) {
      ToastAndroid.show('Enter Mail Id', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else if (netc === true) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else {
      setLoad(true);
      loginBackend();
    }
  }

  async function sendLocalNotification(name) {
    await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: 'Hello, ' + name,
      body: 'Welcome to MyGCT App',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        largeIcon: 'ic_launcher',
        pressAction: {id: 'default'},
      },
    });
  }

  return (
    <View style={{backgroundColor: '#F5F5F5'}}>
      <StatusBar
        backgroundColor="#F5F5F5" // for Android
        barStyle="dark-content" // for iOS and Android
      />
      <ScrollView style={styles.logincon2} keyboardShouldPersistTaps="handled">
        <Text
          style={{
            fontSize: 30,
            textAlign: 'center',
            fontWeight: '700',
            color: '#4B0082',
          }}>
          Welcome Back!
        </Text>
        <LottieView
          style={{width: '100%', height: 300}}
          source={require('../assets/animations/anm1.json')}
          autoPlay
          loop
        />

        <TextInput
          mode="outlined"
          placeholder="Mail Id"
          onChangeText={text => {
            setMail(text);
          }}
          style={styles.input}
          activeOutlineColor="#6082B6"
          textColor="black"
          placeholderTextColor={'#C0C0C0'}
          outlineStyle={{borderWidth: 1.5, elevation: 10}}
          outlineColor="white"
          theme={{
            roundness: 10,
          }}
          left={<TextInput.Icon icon="gmail" />}
        />
        <TextInput
          mode="outlined"
          placeholder="Password"
          onChangeText={text => {
            setRegno(text);
          }}
          style={styles.input}
          activeOutlineColor="#6082B6"
          outlineColor="white"
          placeholderTextColor={'#C0C0C0'}
          outlineStyle={{borderWidth: 1.5, elevation: 10}}
          secureTextEntry
          textColor="black"
          theme={{
            roundness: 10,
          }}
          left={<TextInput.Icon icon="lastpass" />}
        />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <Pressable style={{width: '45%'}} onPress={handleClick}>
            {({pressed}) => (
              <Surface
                elevation={4}
                style={[
                  styles.surface,
                  pressed && {backgroundColor: '#6F2DA8'},
                ]}>
                <Text style={{color: 'white', fontSize: 16, fontWeight: 700}}>
                  <Icon source="login" color={'white'} size={17} /> Login
                </Text>
              </Surface>
            )}
          </Pressable>

          <Pressable
            style={{width: '45%'}}
            onPress={() => navigation.navigate('CreateNewAccount')}>
            {({pressed}) => (
              <Surface
                elevation={4}
                style={[
                  styles.surface2,
                  pressed && {backgroundColor: '#E5E4E2'},
                ]}>
                <Text
                  style={{color: '#4B0082', fontSize: 16, fontWeight: '700'}}>
                  <Icon source="account-plus" color="#4B0082" size={20} /> New
                  User
                </Text>
              </Surface>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: '90%',
  },
  logincon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    margin: 20,
  },
  logincon2: {
    height: '100%',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  but: {
    backgroundColor: '#007FFF',
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 10,
    width: '45%',
    height: 45,
    elevation: 10,
  },
  but2: {
    backgroundColor: '#DE3163',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height: 45,
  },
  butlab: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    marginVertical: 20,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    height: 45,
  },
  surface: {
    padding: 8,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#4B0082',
  },
  surface2: {
    padding: 8,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
  },
});
