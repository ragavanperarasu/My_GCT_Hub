import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid, Vibration, Button
} from 'react-native';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import StudentTitle from './../TileBar/StudentTitle';
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

import * as Animatable from 'react-native-animatable';

import RBSheet from "react-native-raw-bottom-sheet";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/Feather';

import HeaderLogo from '../components/HeaderLogo';

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

  const refRBSheet = useRef();
  const refRBExit = useRef();
  const refSemesterSheet = useRef();

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

          setTimeout(() => {
  BootSplash.hide({ fade: true });
}, 200);
    
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        refRBExit.current.open();
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
        backgroundColor: '#ffffffff',
        height: '100%',
        paddingHorizontal: 5,
      }}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

<RBSheet
  ref={refRBExit}
  closeOnDragDown
  closeOnPressMask
  height={230}
  customStyles={{
    container: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      alignItems: 'center',
    },
  }}
>
  <HeaderLogo />

  <Text
    style={{
      fontSize: 18,
      color: 'black',
      textAlign: 'center',
      marginTop: 20,
      fontFamily: 'Philosopher',
    }}
  >
    Are you sure you want to exit?
  </Text>

  <View
    style={{
      flexDirection: 'row',
      marginTop: 30,
      gap: 15,
    }}
  >
    {/* Cancel Button */}
    <TouchableOpacity
      onPress={() => refRBExit.current.close()}
      style={{
        flex: 1,
        backgroundColor: '#3EB489',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 18,
          fontFamily: 'Philosopher',
        }}
      >
        Cancel
      </Text>
    </TouchableOpacity>

    {/* Exit Button */}
    <TouchableOpacity
      onPress={() => BackHandler.exitApp()}
      style={{
        flex: 1,
        backgroundColor: '#CD5C5C',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 18,
          fontFamily: 'Philosopher',
        }}
      >
        Exit
      </Text>
    </TouchableOpacity>
  </View>
</RBSheet>



      {/* <Portal>
        <Dialog
          visible={exitVisible}
          onDismiss={() => setExitVisible(false)}
          style={{backgroundColor: '#ffffffff'}}>
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
      </Portal> */}

      {/* <DepartmentDialog
        visible={visible1}
        onClose={handleClose}
        onSelect={handleSelect}
      /> */}

      <RBSheet
  ref={refSemesterSheet}
  height={350}
  openDuration={400}
  closeOnDragDown={true}
  customStyles={{
    container: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  }}
>
  <SemesterDialog
    onSelect={(sem) => {
      handleSelect2(sem);
      refSemesterSheet.current.close();
    }}
  />
</RBSheet>


      {/* <SemesterDialog
        visible={visible2}
        onDismiss={handleClose2}
        semSelect={handleSelect2}
      /> */}

      <RBSheet
        ref={refRBSheet}
        height={400}
        openDuration={400}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <DepartmentDialog
          onSelect={handleSelect}
          onClose={() => refRBSheet.current.close()}
        />
      </RBSheet>

      <RegulationDialog visible={visible3} onDismiss={handleClose3} />

      <ScrollView
        style={{backgroundColor: '#FFFFFF'}}
        keyboardShouldPersistTaps="handled">
        

        <StudentTitle />

        <Animatable.View animation={'zoomIn'}
      duration={1000} delay={300} useNativeDriver  style={{marginBottom: 10}} >

<TouchableOpacity onPress={() => refRBSheet.current.open()}>
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E6E6FA',
      marginHorizontal: 5,
      padding: 8,
      borderRadius: 10,
      alignSelf: 'flex-start',
    }}
  >
  <FontAwesome name="bookmark" color="#4B0082" size={18} />
    {/* <Icon source="playlist-edit" color="#856088" size={25} /> */}
    <Text
      style={{
        color: '#4B0082',
        marginLeft: 6,
        fontSize: 15,
        fontFamily: 'Philosopher',
      }}
    >
      {tempdept}
    </Text>

    
  </View>
</TouchableOpacity>


          <TouchableOpacity onPress={() => refSemesterSheet.current.open()}>
            <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF0F5',
      marginTop: 10,
      marginHorizontal: 5,
      padding: 8,
      borderRadius: 10,
      alignSelf: 'flex-start',
    }}
  ><FontAwesome name="grid" color="#DE3163" size={18} />
            <Text
              style={{
                color: '#DE3163',
                marginLeft: 6,
                fontSize: 15,
                fontFamily: 'Philosopher',
              }}>
                
              {tempsem}
            </Text></View>
          </TouchableOpacity>
        </Animatable.View>

        <Search />

        {/* <Animatable.Text animation={'zoomIn'}
      duration={1000} delay={1200} useNativeDriver  style={styles.subtitle}> Learning Resource </Animatable.Text> */}




<Animatable.View
  animation={'zoomIn'}
  duration={1000}
  delay={500}
  useNativeDriver
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,

  }}
>

  {/* BOX 1 */}
  <TouchableOpacity
    style={{
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#E0FFFF',
      borderRadius: 15,
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <MaterialCommunityIcons name="timetable" color="#007BA7" size={31} />
    <Text style={{ color: '#007BA7', fontFamily: 'Philosopher', marginTop: 5, fontSize:15  }}>
      Time Table
    </Text>
  </TouchableOpacity>

  {/* BOX 2 */}
  <TouchableOpacity
    style={{
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#D0F0C0',
      paddingVertical: 10,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <MaterialCommunityIcons name="notebook-edit-outline" color="#2E8B57" size={31} />
    <Text style={{ color: '#2E8B57', fontFamily: 'Philosopher', marginTop: 5, fontSize:15 }}>
      Notes
    </Text>
  </TouchableOpacity>

</Animatable.View>





<Animatable.View
  animation={'zoomIn'}
  duration={1000}
  delay={600}
  useNativeDriver
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,

  }}
>

  {/* BOX 1 */}
  <TouchableOpacity
    style={{
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#EFDCFF',
      paddingVertical: 10,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    }}

    onPress={() => {
              if (!netc) {
                navigation.navigate('SubShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
                Vibration.vibrate(100);
              }
            }}
  >
    <MaterialCommunityIcons name="clipboard-edit-outline" color="#6F2DA8" size={31} />
    <Text style={{ color: '#6F2DA8', fontFamily: 'Philosopher', marginTop: 5, fontSize:15  }}>
      Sem Exam
    </Text>
  </TouchableOpacity>

  {/* BOX 2 */}
  <TouchableOpacity
    style={{
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#F7E7CE',
      paddingVertical: 10,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <MaterialCommunityIcons name="book-education-outline" color="#FF7F50" size={31} />
    <Text style={{ color: '#FF7F50', fontFamily: 'Philosopher', marginTop: 5, fontSize:15 }}>
      Syllabus
    </Text>
  </TouchableOpacity>

</Animatable.View>





<Animatable.View
  animation={'zoomIn'}
  duration={1000}
  delay={700}
  useNativeDriver
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,

  }}
>

  {/* BOX 1 */}
  <TouchableOpacity
    style={{
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#E5E4E2',
      paddingVertical: 10,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <MaterialCommunityIcons name="bookshelf" color="#4D5D53" size={31} />
    <Text style={{ color: '#4D5D53', fontFamily: 'Philosopher', marginTop: 5, fontSize:15  }}>
      Books
    </Text>
  </TouchableOpacity>



</Animatable.View>





<Animatable.View
  animation={'zoomIn'}
  duration={1000}
  delay={700}
  useNativeDriver
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,

  }}
>

  {/* BOX 1 */}
  <TouchableOpacity
    style={{
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#F3EBF3',
      paddingVertical: 10,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <MaterialCommunityIcons name="clipboard-list-outline" color="#8d4b89ff" size={31} />
    <Text style={{ color: '#8d4b89ff', fontFamily: 'Philosopher', marginTop: 5, fontSize:15  }}>
      Unit Test 1
    </Text>
  </TouchableOpacity>

  {/* BOX 2 */}
  <TouchableOpacity
    style={{
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: '#FFE2DE',
      paddingVertical: 10,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <MaterialCommunityIcons name="clipboard-list-outline" color="#8A3324" size={31} />
    <Text style={{ color: '#8A3324', fontFamily: 'Philosopher', marginTop: 5, fontSize:15 }}>
      Unit Test 2
    </Text>
  </TouchableOpacity>

</Animatable.View>


















{/* 
        <Animatable.View style={styles.v1} animation={'zoomIn'}
      duration={1000} delay={1200} useNativeDriver>
          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('TimetableShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
                Vibration.vibrate(100);
              }
            }}
            style={[styles.syltouch, {backgroundColor: '#E2FAFD'}]}>
            <Logo width={'40%'} height={'100%'} />

            <Text style={[styles.semst, {marginLeft: -15}]}>Time Table</Text>
          </TouchableOpacity>

          

          

           <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('StuNoteShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
                Vibration.vibrate(100);
              }
            }}
            style={[styles.syltouch, {backgroundColor: '#F8FFF6'}]}>
            <Note width={'40%'} height={'100%'} />

            <Text style={[styles.semst, {marginLeft: -35}]}>Notes</Text>
          </TouchableOpacity> 
        </Animatable.View>

        <Animatable.View style={styles.v1} animation={'zoomIn'}
      duration={1000} delay={1200} useNativeDriver>
          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('SubShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
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
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
                Vibration.vibrate(100);
              }
            }}
            style={styles.syltouch}>
            <Syl width={'40%'} height={'100%'} />

            <Text style={[styles.semst, {marginLeft: -20}]}>Syllabus</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.Text animation={'zoomIn'}
      duration={1000} delay={1200} useNativeDriver style={styles.subtitle}> Study Materials </Animatable.Text>

         <Animatable.View style={styles.stdview} animation={'zoomIn'}
      duration={1000} delay={1200} useNativeDriver>
        

          <TouchableOpacity
            onPress={() => {
              if (!netc) {
                navigation.navigate('BooksShow', somedata);
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
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
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
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
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
                Vibration.vibrate(100);
              }
            }}
            style={styles.ut2touch}>
            <Ut width={'50%'} height={'100%'} />
            <Text style={styles.stdtxt}>Unit Test 2</Text>
          </TouchableOpacity>
        </Animatable.View>

       

        <Animatable.Text animation={'zoomIn'}
      duration={1000} delay={1200} useNativeDriver style={styles.subtitle}>Mess Food Menu</Animatable.Text>

        <Animatable.View style={styles.v1} animation={'zoomIn'}
      duration={1000} delay={1200} useNativeDriver>
          <TouchableOpacity
            style={[styles.syltouch, {backgroundColor: '#E2FAFD'}]}
            onPress={() => {

              if (!netc) {
                navigation.navigate('WebViewShow', {
                url: 'https://mygct.org/app/uploads/boyshostel.pdf',
              });
              } else {
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
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
                ToastAndroid.show('No, Internet Connection', ToastAndroid.SHORT);
                Vibration.vibrate(100);
              }

              
            }}>
            <Food width={'40%'} height={'100%'} />
            <Text style={[styles.semst, {marginLeft: -35}]}>Girls</Text>
          </TouchableOpacity>
        </Animatable.View> */}
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
