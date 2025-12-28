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
  Image,
  Touchable,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {TextInput, Surface, Icon, Button} from 'react-native-paper';
import axios from 'axios';
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

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Googlesvg from '../assets/images/g2.svg';
import {fetchUserAndUpdateCache} from './functions/userCacheService';



export default function UserLogin() {
  const navigation = useNavigation();
  const netc = useNetworkStatus();

  const [load, setLoad] = useState(false);

  const fcmToken = useFirebaseNotification();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      setTimeout(() => {
        BootSplash.hide({fade: true});
      }, 200);

      return () => subscription.remove();
    }, []),
  );

  if (load) {
    return <Loading />;
  }

  function loginBackend(jsonData) {
    const axiosSend = async () => {
      try {
        const url = 'http://192.168.150.104:5000' + '/app/users/login';

        await axios.post(url, jsonData).then(async res => {
          const resData = res.data;
          
          if (resData.status === 'success') {

            const namef = await fetchUserAndUpdateCache(resData.useruid);
            
            if (namef === 'error') {
              ToastAndroid.show('Something Issue', ToastAndroid.SHORT);
              Vibration.vibrate(100);
              setLoad(false);
              return;
            }
            sendLocalNotification(namef);
            setLoad(false);
            navigation.navigate('PageOne');
          } else {
            ToastAndroid.show('Something Issue', ToastAndroid.SHORT);
            Vibration.vibrate(100);
            return;
          }
        });
      } catch (error) {
        setLoad(false);
        ToastAndroid.show('Server Connection Problem', ToastAndroid.SHORT);
        Vibration.vibrate(100);
      }
    };
    axiosSend();
  }

  function sendToken(rdata) {
    const jsonData = {
      token: fcmToken,
      dept: rdata.dept,
      gender: rdata.gender,
    };

    const axiosSend = async () => {
      try {
        const url = API_URL + '/nottoken';

        await axios.post(url, jsonData);
      } catch (error) {
        setLoad(false);
      }
    };
    axiosSend();
  }

  async function sendLocalNotification(name) {
    await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: 'Hello, ' + name,
      body: 'Designed for GCT students to easily access notes, syllabi, question papers, and campus updates',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        largeIcon: 'ic_launcher',
        pressAction: {id: 'default'},
      },
    });
  }

  const handleGoogleLogin = async () => {
    if (netc === true) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
      Vibration.vibrate(100);
      return;
    }
    setLoad(true);
    GoogleSignin.configure({
      webClientId:
        '324573151372-4pvjpehlgup6f8uvr3rfroc05fjk1ma9.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      if (userInfo.data === null) {
        ToastAndroid.show('Google Sign-In cancelled', ToastAndroid.SHORT);
        Vibration.vibrate(100);
        setLoad(false);
        return;
      }
      loginBackend(userInfo.data?.user);
      return {
        user: userInfo,
        tokens: tokens,
      };
    } catch (error) {
      setLoad(false);
      console.error('Google Sign-In Error: ', error);
    }
  };

  return (
    <View style={styles.view2}>
      <StatusBar
        backgroundColor="#ffffffff" // for Android
        barStyle="dark-content" // for iOS and Android
      />
      <ScrollView style={styles.logincon2} keyboardShouldPersistTaps="handled">
        <View style={styles.view1}>
          <Image
            source={require('../assets/images/mygcti.png')}
            style={styles.img1}
          />
          <Text style={styles.text7}>My GCT Hub</Text>
        </View>
        <Text style={styles.text6}>Welcome Back</Text>
        <Text style={styles.text8}>Sign in</Text>
        <LottieView
          style={{width: '100%', height: 250, marginTop: 30}}
          source={require('../assets/animations/gl.json')}
          autoPlay
          loop
        />
        <Text style={styles.text5}>Continue with Google</Text>
        <Text style={styles.text4}>My GCT Hub</Text>
        <Text style={styles.text3}>Powered by Nexus Technology</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://mygct.org/app/privacypolicy')
          }>
          <Text style={styles.text2}>View Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>
      <Pressable style={styles.pressable1} onPress={handleGoogleLogin}>
        {({pressed}) => (
          <Surface
            elevation={4}
            style={[styles.surface2, pressed && {backgroundColor: '#6CB4EE'}]}>
            <Googlesvg width={25} height={25} style={{marginRight: 10}} />
            <Text style={styles.text1}>Continue with Google</Text>
          </Surface>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  logincon2: {
    height: '100%',
    width: '100%',
  },
  surface2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#318CE7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    margin: 20,
  },
  img1: {
    width: 40,
    height: 40,
    marginRight: 10, // space between logo and text
  },
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  view2: {backgroundColor: '#ffffffff', flex: 1},
  text1: {
    color: '#ffffffff',
    fontSize: 14,
    fontFamily: 'Momo Trust Display',
  },
  text2: {
    fontSize: 13,
    textAlign: 'center',
    color: '#003262',
    fontFamily: 'DM Serif Text',
    marginTop: 10,
  },
  text3: {
    fontSize: 13,
    textAlign: 'center',
    color: '#BEBFC5',
    fontFamily: 'DM Serif Text',
    marginTop: 30,
  },
  text4: {
    fontSize: 20,
    textAlign: 'center',
    color: '#1560BD',
    fontFamily: 'Momo Trust Display',
  },

  text5: {
    fontSize: 18,
    textAlign: 'center',

    color: '#1560BD',
    marginTop: -50,
    fontFamily: 'Momo Trust Display',
  },
  text6: {
    fontSize: 30,
    textAlign: 'center',
    color: '#1560BD',
    marginTop: 30,
    fontFamily: 'Momo Trust Display',
  },
  text7: {
    fontSize: 18,
    color: '#1560BD',
    fontFamily: 'Momo Trust Display',
  },
  text8: {
    fontSize: 25,
    textAlign: 'center',
    color: '#1560BD',
    fontFamily: 'Momo Trust Display',
  },
  pressable1: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 30,
  },
});
