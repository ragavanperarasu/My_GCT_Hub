import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar, Pressable
} from 'react-native';
import {Button, Text, Dialog, Portal, Icon, Surface, Switch} from 'react-native-paper';
import RepTitle from './TileBar/StudentTitle';
import Linkedin from '../assets/images/linkedin.svg';
import Github from '../assets/images/github.svg';
import Website from '../assets/images/website.svg';
import Whatsapp from '../assets/images/whatsapp.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

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

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const std = await cache.get('userdata');
      setUserdata(std);
    };
    fetchData();
  }, []);

    function delUser() {
    const jsonData = {
      mail: userdata.mail
    };

    const axiosSend = async () => {
      try {
        const url = API_URL + '/deluser';
        await axios.post(url, jsonData).then(()=>{
          const rm = async()=>{await cache.clearAll();}
          rm();
          navigation.navigate("UserLogin")
        });
      } catch (error) {
        // setMail('');
        // setLoad(false);
        // console.log(error)
      }
    };
    axiosSend();
  }

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);


  return (
    <View style={{flex: 1}}>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{backgroundColor: '#F7F7F7'}}>
          <Dialog.Icon icon="alert" size={40} color="#C40234" />
          <Dialog.Title style={{textAlign: 'center', color: '#C40234'}}>
            Account Delete
          </Dialog.Title>
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={{color: 'black', fontSize: 17, textAlign: 'center'}}>
              Are you sure you want to delete your account?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)} textColor="#6F2DA8">
              Cancel
            </Button>
            <Button onPress={() => {setVisible(false); delUser()}} textColor="#6F2DA8">
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
          <Dialog.Icon icon="information" size={40} color="#FFBF00" />
          <Dialog.Title style={{textAlign: 'center', color: '#FFBF00'}}>
            Switch Account
          </Dialog.Title>
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={{color: 'black', fontSize: 17, textAlign: 'center'}}>
              Are you sure you want to switch accounts?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible1(false)} textColor="#6F2DA8">
              Cancel
            </Button>
            <Button
              onPress={() => {setVisible1(false);navigation.navigate('UserLogin')}}
              textColor="#6F2DA8">
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView style={styles.scroll}>
        <View style={styles.center}>
          <RepTitle />
          <Text style={styles.header}>{userdata.roll} Account</Text>
          <Text style={styles.subHeader}>Version 1.7</Text>
        </View>

         {/* <View style={styles.section}>
          <Text style={styles.title}>Notification</Text>

<View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={styles.text}>
            Send Post Notification
          </Text>
        
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color='#007FFF' /></View>
        </View> */}


        <View style={styles.section}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
        </View>

        <View style={styles.section}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon source="account-circle" size={50} color="#007FFF" />
          </View>

          <Text style={styles.title}>Account Activity</Text>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginVertical:20}}>

<Pressable style={{ width: '45%' }} onPress={() => setVisible1(true)}>
  {({ pressed }) => (
    <Surface
      elevation={4}
      style={[
        styles.surface,
        pressed && { backgroundColor: '#6F2DA8' },
      ]}
    >
     <Text style={{color:"white", fontSize:16, fontWeight:700}}><Icon
    source="account-switch"
    color={"white"}
    size={17}
  />  Switch</Text>
  </Surface>)}</Pressable>


<Pressable style={{ width: '45%' }} onPress={() => setVisible(true)}>
  {({ pressed }) => (
    <Surface
      elevation={4}
      style={[
        styles.surface2,
        pressed && { backgroundColor: '#E5E4E2' },
      ]}
    >
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
        <Icon source="delete" color="white" size={20} />  Delete
      </Text>
    </Surface>
  )}
</Pressable>

        </View>
          {/* <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.butlab}
            onPress={() => setVisible1(true)}
            icon={'account-switch'}>
            Switch Account
          </Button>
          <Button
            mode="contained"
            style={styles.button1}
            labelStyle={styles.butlab1}
            onPress={() => setVisible(true)}
            icon={'delete'}>
            Delete Account
          </Button> */}
        </View>

        {/* {userdata.roll === 'Root' && (
          <View style={styles.section}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Icon source="account" size={50} color="#007FFF" />
            </View>
            <Text style={styles.title}>Add Alumin</Text>
            <Button
              mode="contained"
              style={styles.button}
              labelStyle={styles.butlab}
              onPress={() => navigation.navigate('UploaddAlumin')}>
              Add Alumin
            </Button>
          </View>
        )} */}

        <View style={[styles.section,{marginBottom:30}]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon source="android" size={50} color="#32CD32" />
          </View>
          <Text style={styles.title}>Developer Support</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.linkedin.com/in/ragavandevp/')
              }
              style={styles.iconCircle}>
              <Linkedin width={55} height={55} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://github.com/ragavanperarasu')
              }
              style={styles.iconCircle}>
              <Github width={50} height={50} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://ragavan.vercel.app/')}
              style={styles.iconCircle}>
              <Website width={40} height={40} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://wa.me/919487745405')}
              style={styles.iconCircle}>
              <Whatsapp width={50} height={50} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 10,
    backgroundColor: '#F5F5F5',
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
    marginTop:20,
    borderRadius: 20,
    elevation: 15,
  },
  title: {
    color: '#007FFF',
    fontSize: 20,
    fontFamily: 'sans-serif-condensed',
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 10,
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
    marginVertical: 20,
    marginLeft: 10,
    height: 65,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    padding: 8,
    height: 45,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
    backgroundColor: '#00A550',
  },
    surface2: {
    padding: 8,
    height: 45,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
    backgroundColor: '#E60026',
    
  },
});
