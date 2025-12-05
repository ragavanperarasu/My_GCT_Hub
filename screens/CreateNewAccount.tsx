import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  Pressable,
  Vibration,
  ToastAndroid,
} from 'react-native';
import {
  TextInput,
  Dialog,
  Portal,
  Snackbar,
  Surface,
  Icon,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import {SelectList} from 'react-native-dropdown-select-list';

import axios from 'axios';
import Loading from './components/Loading';
import useNetworkStatus from './functions/useNetworkStatus';

const API_URL="http://192.168.150.104:5000"

const deptdata = [
  {key: '1', value: 'Civil Engineering'},
  {key: '2', value: 'Computer Science Engineering'},
  {key: '3', value: 'Electronics And Communication Engineering'},
  {key: '4', value: 'Electrical And Electronics Engineering'},
  {key: '5', value: 'Electronics And Instrumentation Engineering'},
  {key: '6', value: 'Industrial Bio Technology'},
  {key: '7', value: 'Information Technology'},
  {key: '8', value: 'Mechanical Engineering'},
  {key: '9', value: 'Production Engineering'},
];

const gendata = [
  {key: '1', value: 'Male'},
  {key: '2', value: 'Female'},
  {key: '3', value: 'Transgender'},
];

export default function CreateNewAccount() {
  const navigation = useNavigation();
  const netc = useNetworkStatus();

  const [load, setLoad] = useState(false);
  const [loadtext, setLoadtext] = useState('Connecting to Server');

  const [username, setUsername] = useState('');
  const [regno, setRegno] = useState('');
  const [regnor, setRegnor] = useState('');
  const [mail, setMail] = useState('');
  const [gender, setGender] = useState('');
  const [dept, setDept] = useState('');

  const [enterotp, setEnterotp] = useState(0);
  const [genotp, setGenotp] = useState(0);

  const [visible, setVisible] = useState(false);

  if (load) {
    return <Loading loadtext={loadtext} />;
  }

  const formatName = name => {
    const trimmed = name.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  async function sendUserData() {
    const jsonData = {
      name: formatName(username),
      regno: regno.trim(),
      gender: gender.trim(),
      dept: dept.trim(),
      nmail: mail.trim(),
    };

    try {
      const url = API_URL + '/newuser';

      await axios.post(url, jsonData).then(res => {
        const resData = res.data;

        if (resData === 'success') {
          setVisible(false);
          setLoadtext('Fetching data...');
          setLoad(false);
          navigation.goBack();
        } else {
          setLoad(false);
          ToastAndroid.show('Some Problem Occur', ToastAndroid.SHORT);
          Vibration.vibrate(100);
        }
      });
    } catch (error) {
      setLoad(false);
      ToastAndroid.show('Server Connection Problem', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    }
  }

  async function sendOTP(o: number) {
    const jsonData = {
      mail: mail,
      otp: o,
    };

    try {
      const url = API_URL + '/emailotp';
console.log("otp json: ", jsonData)
      await axios.post(url, jsonData).then(res => {
        const resData = res.data;
        console.log("otp response: ", resData)
        if (resData === 'send Successfully') {
          setLoad(false);
          setVisible(true);
        }
      });
    } catch (error) {
      setLoad(false);
      ToastAndroid.show('Server Connection Problem', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    }
  }

  function mailvalid() {
    const jsonData = {
      mail: mail,
    };

    const axiosSend = async () => {
      try {
        const url = API_URL + '/uservalidate';
        await axios.post(url, jsonData).then(res => {
          const resData = res.data;
          setLoad(false);
          if (resData === 'present') {
            setMail('');
            ToastAndroid.show('Mail Id Already Exist', ToastAndroid.SHORT);
            Vibration.vibrate(100);
          } else {
            setLoad(true);
            const o = Math.floor(100000 + Math.random() * 900000);
            setGenotp(o);
            sendOTP(o);
          }
        });
      } catch (error) {
        setMail('');
        setLoad(false);
      }
    };
    axiosSend();
  }

  function handleOtpcheck() {
    if (enterotp != genotp) {
      ToastAndroid.show('Invalid OTP', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else {
      setLoadtext('Connecting to server');
      setLoad(true);
      sendUserData();
    }
  }

  function handleClick() {
    if (
      username === '' ||
      regno === '' ||
      mail === '' ||
      dept === '' ||
      gender === '' ||
      regnor === ''
    ) {
      ToastAndroid.show('Please, Complete all fields', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else if (!mail.includes('@')) {
      ToastAndroid.show('Enter Mail Id', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else if (regno !== regnor) {
      ToastAndroid.show('Check you Password', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else if (netc === true) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else {
      setLoadtext('Connecting to server');
      setLoad(true);
      mailvalid();
    }
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
          New Account
        </Text>
        <LottieView
          style={{width: '100%', height: 350}}
          source={require('../assets/animations/reading.json')}
          autoPlay
          loop
        />

        <Portal>
          <Dialog visible={visible} style={{backgroundColor: '#F5F5F5'}}>
            <Dialog.Title
              style={{
                color: '#DE3163',
                textAlign: 'center',
                fontWeight: '700',
                marginBottom: 0,
              }}>
              OTP Verification
            </Dialog.Title>
            <LottieView
              style={{width: '100%', height: 150}}
              source={require('../assets/animations/otp.json')}
              autoPlay
              loop
            />
            <Dialog.Content>
              <Text
                style={{
                  color: '#007FFF',
                  textAlign: 'center',
                  fontWeight: 700,
                }}>
                An OTP was sent to your email. Kindly check your inbox and spam
                folder.
              </Text>

              {/* <TextInput
                mode="outlined"
                placeholder="OTP Number"
                onChangeText={text => {
                  const otp = parseInt(text);
                  setEnterotp(otp);
                }}
                style={styles.input}
                activeOutlineColor="#6082B6"
                textColor="black"
              /> */}

              <TextInput
                mode="outlined"
                placeholder="OTP Number"
                onChangeText={text => {
                  const otp = parseInt(text);
                  setEnterotp(otp);
                }}
                style={styles.input}
                activeOutlineColor="#6082B6"
                outlineColor="white"
                outlineStyle={{elevation: 10}}
                placeholderTextColor={'#C0C0C0'}
                textColor="black"
                secureTextEntry
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
                <Pressable style={{width: '45%'}} onPress={()=>setVisible(false)}>
                  {({pressed}) => (
                    <Surface
                      elevation={4}
                      style={[
                        styles.surface,
                        pressed && {backgroundColor: '#6F2DA8'},
                      ]}>
                      <Text
                        style={{color: 'white', fontSize: 16, fontWeight: 700}}>
                        <Icon
                          source="progress-close"
                          color={'white'}
                          size={17}
                        />{' '}
                        Cancel
                      </Text>
                    </Surface>
                  )}
                </Pressable>

                <Pressable style={{width: '45%'}} onPress={handleOtpcheck}>
                  {({pressed}) => (
                    <Surface
                      elevation={4}
                      style={[
                        styles.surface2,
                        pressed && {backgroundColor: '#E5E4E2'},
                      ]}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '700',
                        }}>
                        <Icon source="account-plus" color="white" size={20} />{' '}
                        Submit
                      </Text>
                    </Surface>
                  )}
                </Pressable>
              </View>

              {/* <Button
                mode="contained"
                style={styles.butn}
                labelStyle={styles.butlab}
                onPress={handleOtpcheck}>
                Check OTP
              </Button>

              <Button
                mode="contained"
                style={styles.but3}
                labelStyle={styles.butlab}
                onPress={() => setVisible(false)}>
                Change Mail ID
              </Button> */}
            </Dialog.Content>
          </Dialog>
        </Portal>

        {/* 
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '700',
            color: '#1E90FF',
          }}>
          Create Account
        </Text>

        <Text
          style={{
            fontSize: 15,
            textAlign: 'center',
            color: '#DE3163',
          }}>
          (If you use GCT Mail id Get More Access)
        </Text> */}

        <TextInput
          mode="outlined"
          placeholder="User Name"
          onChangeText={text => {
            setUsername(text);
          }}
          style={styles.input}
          activeOutlineColor="#6082B6"
          outlineColor="white"
          outlineStyle={{elevation: 10}}
          placeholderTextColor={'#C0C0C0'}
          textColor="black"
          theme={{
            roundness: 10,
          }}
          left={<TextInput.Icon icon="account" />}
        />

        <TextInput
          mode="outlined"
          placeholder="New Password"
          onChangeText={text => {
            setRegno(text);
          }}
          style={styles.input}
          activeOutlineColor="#6082B6"
          placeholderTextColor={'#C0C0C0'}
          outlineColor="white"
          outlineStyle={{elevation: 10}}
          textColor="black"
          secureTextEntry
          theme={{
            roundness: 10,
          }}
          left={<TextInput.Icon icon="lastpass" />}
        />

        <TextInput
          mode="outlined"
          placeholder="Re-Enter Password"
          onChangeText={text => {
            setRegnor(text);
          }}
          style={styles.input}
          activeOutlineColor="#6082B6"
          placeholderTextColor={'#C0C0C0'}
          outlineColor="white"
          outlineStyle={{elevation: 10}}
          textColor="black"
          secureTextEntry
          theme={{
            roundness: 10,
          }}
          left={<TextInput.Icon icon="lastpass" />}
        />

        <TextInput
          mode="outlined"
          placeholder="Prefer GCT Mail @gct.act.in"
          onChangeText={text => {
            setMail(text);
          }}
          style={styles.input}
          activeOutlineColor="#6082B6"
          placeholderTextColor={'#C0C0C0'}
          outlineColor="white"
          outlineStyle={{elevation: 10}}
          textColor="black"
          theme={{
            roundness: 10,
          }}
          left={<TextInput.Icon icon="gmail" />}
        />

        <SelectList
          setSelected={setGender}
          data={gendata}
          save="value"
          boxStyles={styles.box}
          dropdownStyles={styles.dropdown}
          placeholder="Gender"
          inputStyles={{
            color: gender === '' ? '#BEBFC5' : 'black',
          }}
        />

        <SelectList
          setSelected={setDept}
          data={deptdata}
          save="value"
          boxStyles={styles.box}
          dropdownStyles={styles.dropdown}
          placeholder="Select Department"
          inputStyles={{
            color: dept === '' ? '#BEBFC5' : 'black',
          }}
        />

        <Pressable
          style={{width: '100%', marginTop: 15, marginBottom: 60}}
          onPress={handleClick}>
          {({pressed}) => (
            <Surface
              elevation={4}
              style={[
                styles.surface2,
                pressed && {backgroundColor: '#E5E4E2'},
              ]}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
                <Icon source="account-plus" color="white" size={20} /> Create
                Account
              </Text>
            </Surface>
          )}
        </Pressable>

        {/* <Button
          mode="contained"
          style={styles.but}
          labelStyle={styles.butlab}
          onPress={handleClick}>
          Create Account
        </Button> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: '100%',
  },
  logincon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    margin: 20,
  },
  logincon2: {
    borderRadius: 10,
    height: '100%',
    padding: 20,
    width: '100%',
  },
  but3: {
    backgroundColor: '#007FFF',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  but: {
    backgroundColor: '#007FFF',
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 60,
    width: '100%',
  },
  butn: {
    backgroundColor: '#DE3163',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
  },
  butlab: {
    color: 'white',
    fontSize: 20,
    padding: 5,
  },

  input: {
    marginVertical: 15,
    backgroundColor: 'white',
    color: 'black',
    height: 45,
  },

  box: {
    borderColor: 'white',
    backgroundColor: 'white',
    marginVertical: 15,
    borderRadius: 10,
    elevation: 10,
  },

  dropdown: {
    borderColor: '#007bff',
    backgroundColor: 'white',
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
    backgroundColor: '#1E90FF',
  },
});
