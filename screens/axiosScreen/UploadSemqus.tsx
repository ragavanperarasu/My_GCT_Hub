import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Pressable,
  Image,
  Button,
  Alert,
  TextInput,
} from 'react-native';
import {Text, Snackbar, Surface, Icon} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {API_URL} from '@env';
import NetInfo from '@react-native-community/netinfo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Feather from 'react-native-vector-icons/Feather';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Loading from '../components/Loading';

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

type SubShowScreenProp = StackNavigationProp<
  RootStackParamList,
  'UploadSemqus'
>;

export default function UploadSemqus({route}: {route: SubShowScreenProp}) {
  const navigation = useNavigation<SubShowScreenProp>();
  const {subname, pdfuri} = route.params;

  const [userdata, setUserdata] = useState({});
  const [tempdept, setTempdept] = useState('');
  const [tempsem, setTempSem] = useState('');

  const [pname, setPname] = useState('');

  const [pdfFile, setPdfFile] = useState<any>(null);

  const [load, setLoad] = useState(false);
  const [loadtext, setLoadtext] = useState('Connecting to server');

  const [errtxt, setErrtxt] = useState('');
  const [snvisible, setSnvisible] = useState(false);

  const [netc, setNetc] = useState(false);

  const [text, setText] = useState('');
  const [height, setHeight] = useState(40);

  function netStatusCheck() {
    NetInfo.fetch().then(state => {
      setNetc(!state.isConnected);
    });
  }
  setInterval(() => netStatusCheck(), 3000);

  useEffect(() => {
    if (pdfuri) {
      setPdfFile(pdfuri);
    }
    const fetchData = async () => {
      const std = await cache.get('userdata');
      const std2 = await cache.get('tempdept');
      const std3 = await cache.get('tempsem');
      setUserdata(std || {});
      setTempdept(std2);
      setTempSem(std3);
    };
    fetchData();
  }, []);

  if (load) {
    return <Loading loadtext={loadtext} />;
  }

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });

      setPdfFile(res);
      console.log("Selected PDF file:", res);
    } catch (err) {}
  };

  async function sendLocalNotification() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: 'Your New Post',
      body: 'Thanks For Your Contribution',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        largeIcon: 'ic_launcher',
        pressAction: {id: 'default'},
      },
    });
  }

  const handleUpload = async () => {
    if (!pname || !pdfFile) {
      setErrtxt('Please Select All Field');
      setSnvisible(true);
      return;
    }

    setLoadtext('Uploading File... Please wait');
    setLoad(true);

    const formData = new FormData();
    formData.append('docname', pdfFile.name);
    formData.append('postby', userdata.name);
    formData.append('postmail', userdata.mail);
    formData.append('department', tempdept);
    formData.append('postname', pname);
    formData.append('sem', tempsem);
    formData.append('subject', subname);

    formData.append('pdf', {
      uri: pdfFile.uri,
      type: pdfFile.type,
      name: pdfFile.name,
    });

    try {
      const url = API_URL + '/semupl22';

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setLoadtext(`Uploading... ${percentCompleted}%`);
        },
      });

      setLoadtext('Upload successful!');
      setTimeout(() => {
        setLoad(false);
        sendLocalNotification();
        navigation.navigate('StudentHome');
      }, 500);
    } catch (error) {
      console.error(error);
      setLoadtext('Upload failed');
      setTimeout(() => {
        setLoad(false);
        navigation.navigate('StudentHome');
      }, 500);
    }
  };

  console.log("post screen : ",subname, pdfuri);

  return (
   
      <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          backgroundColor: '#ffffffff',
          flexDirection: 'row',
        }}>
        <Image
          source={{uri: userdata.photo}}
          style={{
            width: 50,
            height: 50,
            borderRadius: 60,
            marginRight: 10,
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 15,
              color: 'black',
              fontFamily: 'Momo Trust Display',
            }}>
            {userdata.name}
          </Text>

          <Text
            style={{fontSize: 14, color: 'gray', fontFamily: 'Philosopher'}}>
            {userdata.email}
          </Text>
        </View>
      </View>
      {pdfFile && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WebViewShow', {url: pdfFile.uri});
          }}
          style={{
            backgroundColor: '#D0F0C0',
            paddingVertical: 10,
            paddingHorizontal: 30,
            marginHorizontal: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          <FontAwesome6 name="file-pdf" size={20} color="#00693E" />
          <Text
            style={{color: '#00693E', fontSize: 15, fontFamily: 'Philosopher', marginLeft: 5}}>
            {pdfFile.name}
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.scroll}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type you description"
          multiline
          style={{
            minHeight: 100,

            padding: 10,
            fontSize: 16,
            textAlignVertical: 'top',
            fontFamily: 'Philosopher',
          }}
        />
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.replace('CameraScreen', {subname: subname, pdfuri: ''})}
            style={{
              backgroundColor: '#FF9966',
              padding: 12,
              borderRadius: 50,
              marginRight: 10,
            }}>
            <Feather name="camera" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePickDocument}
            style={{
              backgroundColor: '#FB607F',
              padding: 12,
              borderRadius: 50,
            }}>
            <Feather name="file-plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Post Button */}
        <TouchableOpacity
          onPress={() => Alert.alert('Post')}
          style={{
            backgroundColor: '#1560BD',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          <Feather name="upload-cloud" size={22} color="#fff" />
          <Text
            style={{color: 'white', fontSize: 18, fontFamily: 'Philosopher'}}>
            Post
          </Text>
        </TouchableOpacity>
      </View></View>

   
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  center: {
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
  },
  center1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    position: 'absolute',
    width: '80%',
    bottom: 20,
    left: '10%',
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
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 25,
    boxShadow: '#0000003D 0 3 8',
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
    fontSize: 16,
    fontFamily: 'sans-serif-condensed',
    marginVertical: 10,
    color: '#8B8589',
  },
  but2: {
    backgroundColor: '#DE3163',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  butlab: {
    color: 'white',
    fontSize: 18,
    padding: 5,
  },
  input: {
    marginTop: 15,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 50,
    height: 45,
  },
  but: {
    backgroundColor: '#007FFF',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  surface: {
    padding: 8,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#DE3163',
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
