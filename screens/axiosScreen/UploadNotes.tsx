import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Button, Text, TextInput,Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from 'react-native-cache';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {API_URL} from '@env';
import Loading from '../components/Loading';
import NetInfo from '@react-native-community/netinfo';
import AntDesign from 'react-native-vector-icons/FontAwesome6';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

type SubShowScreenProp = StackNavigationProp<RootStackParamList, 'UploadNotes'>;

export default function UploadNotes({route}: {route: SubShowScreenProp}) {
  const navigation = useNavigation<SubShowScreenProp>();
const {subname} = route.params;

  const [userdata, setUserdata] = useState({});
  const [tempdept, setTempdept] = useState("");
  const [tempsem, setTempSem] = useState("");

  const [pname, setPname] = useState("");

  const [pdfFile, setPdfFile] = useState<any>(null);

  const [load, setLoad] = useState(false);
  const [loadtext, setLoadtext] = useState('Connecting to server');

  const [errtxt, setErrtxt] = useState('');
  const [snvisible, setSnvisible] = useState(false);

  const [netc, setNetc] = useState(false);

  function netStatusCheck() {
    NetInfo.fetch().then(state => {
      setNetc(!state.isConnected);
    });
  }
  setInterval(() => netStatusCheck(), 3000);

  useEffect(() => {
    const fetchData = async () => {
      const std = await cache.get('userdata');
      const std2 = await cache.get('tempdept');
      const std3 = await cache.get('tempsem');
      setUserdata(std || {});
      setTempdept(std2)
      setTempSem(std3)
    };
    fetchData();
  }, []);

  
if (load) {
    return (
      <Loading loadtext={loadtext} />
    );
  }

const handlePickDocument = async () => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
    });

    setPdfFile(res);
  } catch (err) {

  }
};

  async function sendLocalNotification() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH
    });
  await notifee.displayNotification({
    title: "Your New Post",
    body: 'Thanks For Your Contribution',
    android: {
      channelId: 'default',        
      smallIcon: 'ic_launcher',     
      largeIcon: 'ic_launcher', 
      pressAction: { id: 'default' }
    },
  });
}

const handleUpload = async () => {
  if (!pname || !pdfFile) {
    setErrtxt("Please Select All Field")
    setSnvisible(true)
    return;
  }

  setLoadtext("Uploading File... Please wait");
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
    const url = API_URL + "/notesupl";

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setLoadtext(`Uploading... ${percentCompleted}%`);
      }
    });

    setLoadtext("Upload successful!");
    setTimeout(() => {
      setLoad(false);
       sendLocalNotification();
      navigation.navigate("StudentHome");
    }, 500);

  } catch (error) {
    setLoadtext("Upload failed");
    setTimeout(() => {
      setLoad(false);
      navigation.navigate("StudentHome");
    }, 500);
  }
};



  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scroll}>
        <View style={styles.center}>

          <Text style={styles.header}>Semester Notes</Text>
          <Text style={styles.subHeader}>Upload</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Post Deatail</Text>
          <Text style={styles.text}>User Name: {userdata.name}</Text>
          <Text style={styles.text}>Mail Id: {userdata.mail}</Text>
          <Text style={styles.text}>Post Department: {tempdept}</Text>
          <Text style={styles.text}>Post Semester: {tempsem}</Text>
          <Text style={styles.text}>Subject Name: {subname}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Upload Your Document</Text>
          <TextInput
          mode="outlined"
          placeholder="Post Name"
          onChangeText={text => {
            setPname(text);
          }}
          style={styles.input}
          activeOutlineColor="#6082B6"
          textColor="black"
        />

        {pdfFile && (
  <Text style={{color: 'green', textAlign: 'center', marginTop: 10}}>
    Selected: {pdfFile.name}
  </Text>
)}

       <View style={{flexDirection:"row", justifyContent:"space-evenly", marginTop:10}}>
                       <Button
                 mode="contained"
                 style={styles.but2}
                 labelStyle={styles.butlab}
                 onPress={handlePickDocument}
               >
                 <AntDesign name="file-pdf" size={23} color="white" /> Pick PDF
               </Button>
               
               <Button
                 mode="contained"
                 style={styles.but}
                 labelStyle={styles.butlab}
                 onPress={handleUpload}
               >
                  <AntDesign name="upload" size={23} color="white" /> Upload
               </Button></View>

        </View>









      </ScrollView>
      <Snackbar
              visible={snvisible}
              onDismiss={() => setSnvisible(false)}
              style={{backgroundColor: '#3B3C36', borderRadius: 10}}
              action={{
                label: 'Okay',
                textColor: '#007FFF',
                onPress: () => {
                  setSnvisible(false);
                },
              }}>
              <Text style={{fontSize: 15, color: 'white'}}>{errtxt}</Text>
            </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  center: {
    alignItems: 'center',
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
    paddingVertical:10,
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
    height:45,
  },
  but: {
    backgroundColor: '#007FFF',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,

  },
});
