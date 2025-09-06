import React, {useCallback, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid, Vibration
} from 'react-native';
import {Dialog, Portal, Button, Text, Icon} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import StudentTitle from './../TileBar/StudentTitle';
import Logo from '../../assets/images/ti.svg';
import Note from '../../assets/images/note.svg';

import Books from '../../assets/images/books.svg';
import Ut from '../../assets/images/ut.svg';
import Sem from '../../assets/images/sem.svg';
import Syl from '../../assets/images/syl.svg';
import Alu from '../../assets/images/alu.svg';
import Hello from '../../assets/images/hello.svg';
import Edit from '../../assets/images/edit.svg';
import Food from '../../assets/images/food.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import Search from '../Search';
import {BackHandler, StatusBar} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';

import DepartmentDialog from '../components/DepartmentDialog';
import SemesterDialog from '../components/SemesterDialog';
import RegulationDialog from '../components/RegulationDialog';

import useNetworkStatus from '../functions/useNetworkStatus';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

export default function PageOne() {
  const navigation = useNavigation();
  const netc = useNetworkStatus();

  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [visible3, setVisible3] = React.useState(false);

  const [userdata, setUserdata] = React.useState({});

  const [tempdept, setTempdept] = React.useState('Civil Engineering');
  const [tempsem, setTempsem] = React.useState('Semester 1');
  const [tempreg, setTempreg] = React.useState('2022');

  const [exitVisible, setExitVisible] = React.useState(false);

  //<- Dialog handle functions open ->

  // ==> Department Handle
  const handleClose = useCallback(() => setVisible1(false), []);

  const handleSelect = useCallback(dept => {
    setTempdept(dept);
    cacheupdate('tempdept', dept);
    setVisible1(false);
  }, []);

  // ==> Semester Handle
  const handleClose2 = useCallback(() => setVisible2(false), []);

  const handleSelect2 = useCallback(sem => {
    setTempsem(sem);
    cacheupdate('tempsem', sem);
    setVisible2(false);
  }, []);

  // ==> Regulation Handle
  const handleClose3 = useCallback(() => setVisible3(false), []);

  //<- Dialog handle functions close ->

  useEffect(() => {
    const loadCache = async () => {
      const cacheUserData = await cache.get('userdata');

      const ctempdept = await cache.get('tempdept');
      const ctempsem = await cache.get('tempsem');

      if (!cacheUserData) {
        navigation.navigate('UserLogin');
      } else if (!ctempdept || !ctempsem) {
        await cache.set('tempdept', 'Civil Engineering');
        await cache.set('tempsem', 'Semester 1');
        setUserdata(cacheUserData);
        setTempdept('Civil Engineering');
        setTempsem('Semester 1');
      } else {
        setUserdata(cacheUserData);
        setTempdept(ctempdept);
        setTempsem(ctempsem);
      }
    };
    loadCache();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      BootSplash.hide({fade: true});
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setExitVisible(true);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const cacheupdate = async (ckey, cvalue) => {
    await cache.set(ckey, cvalue);
  };

  let somedata = {
    reqType: userdata.mail,
    regType: tempreg,
    depType: tempdept,
    semType: tempsem,
    access: userdata.roll,
  };

  return (
    <View
      style={{
        backgroundColor: '#F5F5F5',
        height: '100%',
        paddingHorizontal: 5,
      }}>
      <Portal>
        <Dialog
          visible={exitVisible}
          onDismiss={() => setExitVisible(false)}
          style={{backgroundColor: '#F7F7F7'}}>
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={{color: 'black', fontSize: 17, marginTop: 10}}>
              Are you sure you want to exit?
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button textColor="#6F2DA8" onPress={() => setExitVisible(false)}>
              Cancel
            </Button>
            <Button
              textColor="#6F2DA8"
              onPress={() => {
                setExitVisible(false);
                BackHandler.exitApp();
              }}>
              Exit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <DepartmentDialog
        visible={visible1}
        onClose={handleClose}
        onSelect={handleSelect}
      />

      <SemesterDialog
        visible={visible2}
        onDismiss={handleClose2}
        semSelect={handleSelect2}
      />

      <RegulationDialog visible={visible3} onDismiss={handleClose3} />

      <ScrollView
        style={{backgroundColor: '#FFFFFF'}}
        keyboardShouldPersistTaps="handled">
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

        <StudentTitle />

        <View style={{marginBottom: 10}}>
          <Text
            style={{
              color: 'black',
              marginLeft: 10,
              fontSize: 20,
              fontWeight: '800',
              fontFamily: 'monospace',
            }}>
            Welcome{<Hello width={20} height={20} />}, {userdata.name}
          </Text>
          <TouchableOpacity onPress={() => setVisible1(true)}>
            <Text
              style={{
                color: 'black',
                marginLeft: 10,
                fontSize: 16,
                fontWeight: '600',
                marginTop: 20,
              }}>
              {tempdept}{' '}
              {
                <Icon source="playlist-edit" color="#856088" size={25} />
                // <Edit width={20} height={17} />
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setVisible2(true)}>
            <Text
              style={{
                color: 'black',
                marginLeft: 10,
                fontSize: 16,
                fontWeight: '600',
                marginTop: 18,
              }}>
              {tempsem}
              {'  '}
              {<Icon source="playlist-edit" color="#856088" size={25} />}
            </Text>
          </TouchableOpacity>
          {/* {' '}
            - R{tempreg}
            {'  '} */}
          {/* {
              <TouchableOpacity onPress={() => setVisible3(true)}>
                <Icon source="playlist-edit" color="#856088" size={25} />
              </TouchableOpacity>
            } */}
        </View>

        <Search />

        <Text style={styles.subtitle}> Learning Resource </Text>

        <View style={styles.v1}>
          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('TimetableShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }
            }}
            style={[styles.syltouch, {backgroundColor: '#E2FAFD'}]}>
            <Logo width={'40%'} height={'100%'} />

            <Text style={[styles.semst, {marginLeft: -15}]}>Time Table</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="timetable"
              color="#007FFF"
              size={34}
            />

            <Text style={{color: 'black'}}>Time Table</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="notebook-edit-outline"
              color="#007FFF"
              size={34}
            />

            <Text style={{color: 'black'}}>Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="book-edit"
              color="#007FFF"
              size={34}
            />

            <Text style={{color: 'black'}}>Semester</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialIcons name="rule" color="#007FFF" size={34} />

            <Text style={{color: 'black'}}>Syllabus</Text>
          </TouchableOpacity> */}

          

           <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('StuNoteShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }
            }}
            style={[styles.syltouch, {backgroundColor: '#F8FFF6'}]}>
            <Note width={'40%'} height={'100%'} />

            <Text style={[styles.semst, {marginLeft: -35}]}>Notes</Text>
          </TouchableOpacity> 
        </View>

        <View style={styles.v1}>
          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('SubShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }
            }}
            style={[styles.syltouch, {backgroundColor: '#E7E8FF'}]}>
            <Sem width={'40%'} height={'100%'} />

            <Text style={styles.semst}> Sem Exam</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('SyllShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }
            }}
            style={styles.syltouch}>
            <Syl width={'40%'} height={'100%'} />

            <Text style={[styles.semst, {marginLeft: -20}]}>Syllabus</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}> Study Materials </Text>

         <View style={styles.stdview}>
         {/* <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome
              name="book"
              color="#007FFF"
              size={34}
              
            />

            <Text style={{color: 'black'}}>Books</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="notebook-check"
              color="#007FFF"
              size={34}
            />

            <Text style={{color: 'black'}}>UT 1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="notebook-check"
              color="#007FFF"
              size={34}
            />

            <Text style={{color: 'black'}}>UT 2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons name="web" color="#007FFF" size={34} />

            <Text style={{color: 'black'}}>Website</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('BooksShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }
            }}
            style={[styles.ut2touch, {backgroundColor: '#FDE6D7'}]}>
            <Books width={'50%'} height={'100%'} />

            <Text style={styles.stdtxt}>Books</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('UtSubShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }
            }}
            style={[styles.ut2touch, {backgroundColor: '#E2FAFD'}]}>
            <Ut width={'50%'} height={'100%'} />

            <Text style={styles.stdtxt}>Unit Test 1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('UttSubShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }
            }}
            style={styles.ut2touch}>
            <Ut width={'50%'} height={'100%'} />
            <Text style={styles.stdtxt}>Unit Test 2</Text>
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.subtitle}> GCT Alumni </Text>

        <TouchableOpacity
          onPress={() => {
            if (!netc) {
              navigation.navigate('Alumine');
            } else {
              setSnvisible(true);
            }
          }}
          style={styles.v1}>
          <View style={styles.alutouch}>
            <Alu width={'40%'} height={'100%'} />

            <Text style={styles.alutxt}>Alumni Profiles</Text>
          </View>
        </TouchableOpacity> */}

        <Text style={styles.subtitle}>Mess Food Menu</Text>

        <View style={styles.v1}>
          <TouchableOpacity
            style={[styles.syltouch, {backgroundColor: '#E2FAFD'}]}
            onPress={() => {

              if (!netc) {
                navigation.navigate('WebViewShow', {
                url: 'https://mygct.org/app/uploads/boyshostel.pdf',
              });
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }
              
            }}>
            <Food width={'40%'} height={'100%'} />

            <Text style={styles.semst}>Boys</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.syltouch, {backgroundColor: '#E7E8FF'}]}
            onPress={() => {

              if (!netc) {
                navigation.navigate('WebViewShow', {
                url: 'https://mygct.org/app/uploads/girlshostel.pdf',
              });
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
                Vibration.vibrate(100);
              }

              
            }}>
            <Food width={'40%'} height={'100%'} />
            <Text style={[styles.semst, {marginLeft: -35}]}>Girls</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: 'black',
    marginLeft: 5,
    fontFamily: 'sans-serif-condensed',
    fontSize: 18,
    fontWeight: '700',
   // marginTop: 15,
   marginVertical:10
  },
  v1: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent:"space-around",
    marginTop: 10,
    height: 80,
    marginBottom:10
  },
  ut2touch: {
    width: '30%',
    backgroundColor: '#FFFAE7',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 11,
    //boxShadow: '#0000003D 0 3 8',
  },
  alutouch: {
    width: '93%',
    backgroundColor: '#DEEBF0',
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 11,
    //boxShadow: '#0000003D 0 3 8',
  },
  stdtxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stdview: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: "space-around",
    height: 100,
  },
  alutxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: -30,
  },
  syltouch: {
    width: '45%',
    backgroundColor: '#FFF3FF', // Mild color
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    elevation: 11,
    //boxShadow: '#0000003D 0 3 10',
  },
  ftex: {
    color: '#7B0202',
    fontWeight: 700,
    fontSize: 18,
    marginVertical: 15,
  },
  semst: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
    marginLeft: -15,
  },
});
