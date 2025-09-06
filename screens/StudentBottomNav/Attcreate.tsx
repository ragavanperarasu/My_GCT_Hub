import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ToastAndroid, Vibration
} from 'react-native';
import {
  Appbar,
  Snackbar,
  Text,
  Icon,
  TextInput,
  Surface,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {SelectList} from 'react-native-dropdown-select-list';
import Octicons from 'react-native-vector-icons/Octicons';
import NetInfo from '@react-native-community/netinfo';
import {API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import Loading from '../components/Loading';
import useNetworkStatus from '../functions/useNetworkStatus';

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

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

const semdata = [
  {key: '1', value: 'Semester 1'},
  {key: '2', value: 'Semester 2'},
  {key: '3', value: 'Semester 3'},
  {key: '4', value: 'Semester 4'},
  {key: '5', value: 'Semester 5'},
  {key: '6', value: 'Semester 6'},
  {key: '7', value: 'Semester 7'},
  {key: '8', value: 'Semester 8'},
];

const Attcreate = () => {
  const navigation = useNavigation();
const netc = useNetworkStatus();
  const [load, setLoad] = useState(false);
  const [loadtext, setLoadtext] = useState('Connecting to server');

  const [sem, setSem] = useState('');
  const [dept, setDept] = useState('');
  const [userdata, setUserdata] = useState({});

  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const scrollViewRef = useRef(null);

  const [sname, setSname] = useState('');
  const [snames, setSnames] = useState<string[]>([]);
  const scrollViewRef2 = useRef(null);
  const [apin, setApin] = useState('');




  useEffect(() => {
    const fetchData = async () => {
      const std = await cache.get('userdata');
      setUserdata(std);
    };
    fetchData();
  }, []);

  if (load) {
    return <Loading loadtext={loadtext} />;
  }

  const handleAddSubject = () => {
    if (subject.trim() !== '') {
      setSubjects([...subjects, subject.trim()]);
      setSubject('');

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  };

  const handleDeleteSubject = indexToRemove => {
    setSubjects(subjects.filter((_, i) => i !== indexToRemove));
  };

  const handleAddSubject2 = () => {
    if (sname.trim() !== '') {
      setSnames([...snames, sname.trim()]);
      setSname('');

      setTimeout(() => {
        scrollViewRef2.current?.scrollToEnd({animated: true});
      }, 100);
    }
  };

  const handleDeleteSubject2 = indexToRemove2 => {
    setSnames(snames.filter((_, i) => i !== indexToRemove2));
  };

  async function sendUserData() {
    setLoad(true);
    const jsonData = {
      name: userdata.name,
      pass: apin,
      mail: userdata.mail,
      sem: sem,
      dept: dept,
      sub: subjects.map((item, index) => ({key: index + 1, value: item})),
      sname: snames.map((item, index) => ({key: index + 1, value: item})),
    };

    try {
      const url = API_URL + '/newatt';

      await axios.post(url, jsonData).then(res => {
        const resData = res.data;
        setLoad(false);
        if (resData === 'success') {
          ToastAndroid.show(`Created Successfully`, ToastAndroid.LONG);
          Vibration.vibrate(100);
          navigation.navigate('StudentHome');
        } else {
          ToastAndroid.show('Some Network Problem', ToastAndroid.SHORT);
          Vibration.vibrate(100);
        }
      });
    } catch (error) {
      setLoad(false);
      ToastAndroid.show('Server Connection Problem', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    }
  }

  function handleClick() {
    if (
      subjects.length === 0 ||
      snames.length === 0 ||
      sem === '' ||
      dept === '' ||
      apin === ''
    ) {
      ToastAndroid.show('Please Complete All Data', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else if (apin.length !== 4) {
      ToastAndroid.show('Enter 4 - Digit PIN', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else if (netc === true) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else {
      setLoadtext('Connecting to Server');
      setLoad(true);
      sendUserData();
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Appbar.Header
        style={{
          backgroundColor: '#ffffffff',
          elevation: 20,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}>
        <Appbar.Content
          title="New Attendance"
          color="#1CA9C9"
          titleStyle={{fontWeight: '700', fontSize: 20, textAlign: 'center'}}
        />
      </Appbar.Header>
      <ScrollView>
        <View style={{marginHorizontal: 5}}>
          <TextInput
            mode="outlined"
            placeholder="Enter 4 - Digit PIN"
            onChangeText={setApin}
            style={styles.input}
            activeOutlineColor="#6082B6"
            outlineColor="white"
            outlineStyle={{elevation: 10}}
            textColor="black"
            value={apin}
            theme={{
              roundness: 10,
            }}
            placeholderTextColor={'#C0C0C0'}
            keyboardType="number-pad"
            maxLength={4}
            right={
              <TextInput.Icon
                icon="dialpad"
                color={'#1CA9C9'}
                forceTextInputFocus={false}
              />
            }
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

          <SelectList
            setSelected={setSem}
            data={semdata}
            save="value"
            boxStyles={styles.box}
            dropdownStyles={styles.dropdown}
            placeholder="Select Semester"
            inputStyles={{
              color: dept === '' ? '#BEBFC5' : 'black',
            }}
          />

          <TextInput
            mode="outlined"
            placeholder="Enter Subject Name List"
            onChangeText={setSubject}
            style={styles.input}
            activeOutlineColor="#6082B6"
            outlineColor="white"
            outlineStyle={{elevation: 10}}
            placeholderTextColor={'#C0C0C0'}
            textColor="black"
            value={subject}
            theme={{
              roundness: 10,
            }}
            right={
              <TextInput.Icon
                icon="book-plus"
                onPress={handleAddSubject}
                color={'#1CA9C9'}
                forceTextInputFocus={false}
              />
            }
          />

          {subjects.length > 0 && (
            <View
              style={{
                marginBottom: 20,
                maxHeight: 210,
                backgroundColor: 'white',
                borderRadius: 10,
                elevation: 10,
                overflow: 'hidden',
              }}>
              <ScrollView
                nestedScrollEnabled={true}
                style={{padding: 8}}
                contentContainerStyle={{paddingBottom: 20}}
                keyboardShouldPersistTaps="handled"
                ref={scrollViewRef}>
                <Text style={styles.title}>Added Subjects</Text>

                {subjects.map((subj, index) => (
                  <View key={index} style={styles.subjectItemRow}>
                    <Text style={styles.subjectText}>
                      {index + 1}. {subj}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleDeleteSubject(index)}>
                      <Octicons
                        name="trash"
                        size={25}
                        color="#808080"
                        style={{marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <TextInput
            mode="outlined"
            placeholder="Enter Student Register No"
            onChangeText={setSname}
            style={styles.input}
            activeOutlineColor="#6082B6"
            outlineColor="white"
            outlineStyle={{elevation: 10}}
            placeholderTextColor={'#C0C0C0'}
            textColor="black"
            value={sname}
            theme={{
              roundness: 10,
            }}
            right={
              <TextInput.Icon
                icon="account-plus"
                onPress={handleAddSubject2}
                color={'#1CA9C9'}
                forceTextInputFocus={false}
              />
            }
          />

          {snames.length > 0 && (
            <View
              style={{
                marginBottom: 20,
                maxHeight: 510,
                backgroundColor: 'white',
                borderRadius: 10,
                elevation: 10,
                overflow: 'hidden',
              }}>
              <ScrollView
                style={{padding: 8}}
                contentContainerStyle={{paddingBottom: 20}}
                keyboardShouldPersistTaps="handled"
                ref={scrollViewRef2}
                nestedScrollEnabled={true}>
                <Text style={styles.title}>Added Students</Text>

                {snames.map((subj2, index2) => (
                  <View key={index2} style={styles.subjectItemRow2}>
                    <Text style={styles.subjectText}>
                      {index2 + 1}. {subj2}
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleDeleteSubject2(index2)}>
                      <Octicons
                        name="trash"
                        size={25}
                        color="#808080"
                        style={{marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

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
                  Attendance
                </Text>
              </Surface>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  surface2: {
    padding: 8,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#1E90FF',
  },

  subjectItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#73CECE',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 8,
  },

  subjectItemRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#55D6A3',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 8,
  },

  subjectItem: {
    backgroundColor: '#FFF8DC',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 8,
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
  input: {
    marginVertical: 15,
    backgroundColor: 'white',
    color: 'black',
    height: 45,
  },
  title: {
    color: '#007FFF',
    fontSize: 20,
    fontFamily: 'sans-serif-condensed',
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconCircle: {
    marginVertical: 20,
    marginLeft: 10,
    height: 65,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '#0000003D 0 3 8',
  },

  outerContainer: {
    marginHorizontal: 8,
  },
  subjectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    padding: 12,
    borderRadius: 15,
    elevation: 10,
    marginTop: 10,
    marginHorizontal: 5,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
    flex: 1,
    marginHorizontal: 10,
  },
});

export default Attcreate;
