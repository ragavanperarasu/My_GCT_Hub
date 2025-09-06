import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Nodejs from '../../assets/images/accoun.svg';
import {Avatar, Card, Text, Button, Appbar, Snackbar, Badge} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';
import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import Loading from '../components/Loading';
import axios from 'axios';

const GETTING_POST = "/getpost"

type SubShowScreenProp = StackNavigationProp<RootStackParamList, "StuNoteShow">;



export default function StuNoteShow({route}:{route: SubShowScreenProp}) {
  const navigation = useNavigation<SubShowScreenProp>();
  const {reqType, regType, depType, semType, access} = route.params;
  const [data, setData] = useState([]);

  const [acc, setAcc] = useState(false);

  const [load, setLoad] = useState(false);
  const [loadtext, setLoadtext] = useState('Connecting to Server');

  const [errtxt, setErrtxt] = useState('');
  const [snvisible, setSnvisible] = useState(false);

  const [expandedSubject, setExpandedSubject] = useState(null);


  useEffect(() => {
    if(access === 'Student')
      setAcc(true)
    else if(access === 'Admin')
      setAcc(true)
    else if(access === 'Normal')
      setAcc(false)
    else if(access === 'Root')
      setAcc(true)
    getData();
  }, []);

  function getData() {
    setLoad(true);
    const fetchData = async () => {
      const jsonData = {
        dept: depType,
        sem: semType,
        reg: regType,
      };
      try {
        const url = API_URL + GETTING_POST;
        await axios.post(url, jsonData).then(res => {
          const resData = res.data.sub;
          setData(resData);
        });
        setLoad(false);
      } catch (error) {
    
        setLoad(false);
        setErrtxt('Network Problem');
        setSnvisible(true);
     
      }
    };
    fetchData();
  }

  function addView(subname:string, postdate:string) {
    const fetchData = async () => {
      const jsonData = {
        department: depType,
        sem: semType,
        reg: regType,
        subname: subname,
        postdate: postdate
      };
      try {
        const url = API_URL + '/notesview';
        axios.post(url, jsonData);
      } catch (error) {
        setLoad(false);
        setErrtxt('Network Problem');
        setSnvisible(true);
      }
    };
    fetchData();
  }

  function addDownc(subname:string, postdate:string) {
    const fetchData = async () => {
      const jsonData = {
        department: depType,
        sem: semType,
        reg: regType,
        subname: subname,
        postdate: postdate
      };
      try {
        const url = API_URL + '/notesdownc';
        axios.post(url, jsonData);
      } catch (error) {
        setLoad(false);
        setErrtxt('Network Problem');
        setSnvisible(true);
      }
    };
    fetchData();
  }

  function addLike(subname:string, postdate:string) {
    const fetchData = async () => {
      const jsonData = {
        department: depType,
        sem: semType,
        reg: regType,
        subname: subname,
        postdate: postdate,
        mail: reqType
      };
      try {
        const url = API_URL + '/noteslike';
        axios.post(url, jsonData).then(res => {
          const resData = res.data;
          if(resData === 'success'){
            setErrtxt("Your Like Added")
            setSnvisible(true)
          }
          else{
            setErrtxt("Your Already Liked")
            setSnvisible(true)
          }
        });
      } catch (error) {
        setLoad(false);
        setErrtxt('Network Problem');
        setSnvisible(true);
      }
    };
    fetchData();
  }

  async function sendLocalNotification() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH
    });
  await notifee.displayNotification({
    title: "Your Post Deleted",
    body: 'Your Notes PDF Deleted Successfully',
    android: {
      channelId: 'default',        
      smallIcon: 'ic_launcher',     
      largeIcon: 'ic_launcher', 
      pressAction: { id: 'default' }
    },
  });
}


  function delPost(subname:string, oid:string) {
    setLoad(true);
      const fetchData = async () => {
        const jsonData = {
          department: depType,
          sem: semType,
          reg: regType,
          subname: subname,
          oid: oid
        };
   
        try {
          const url = API_URL + '/notesdel';
          await axios.post(url, jsonData).then((res)=>{
            if (res.data === "done"){
            setLoad(false);
            sendLocalNotification();
            navigation.goBack();
          }
          else {
            setLoad(false);
            setErrtxt('Network Problem');
            setSnvisible(true);
          }
          });
        } catch (error) {
          setLoad(false);
          setErrtxt('Network Problem');
          setSnvisible(true);
        }
      };
      fetchData();
    }

  if (load) {
    return (
      <Loading loadtext={loadtext} />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
    
          <Appbar.Header
            style={{
              backgroundColor: '#FFFFFF',
              elevation:20,
              borderBottomLeftRadius:40,
              borderBottomRightRadius:40,
            }}>
            <Appbar.Content
              title="Student Notes"
              color="#1CA9C9"
              titleStyle={{fontWeight: '700', fontSize:20, textAlign:"center"}}
            />
          </Appbar.Header>

          <ScrollView>

          {data?.map((i, outerIndex) => (
  <View key={outerIndex} style={styles.outerContainer}>
    

    <TouchableOpacity
      style={styles.subjectCard}
      onPress={() =>
        setExpandedSubject(expandedSubject === outerIndex ? null : outerIndex)
      }>
      <Text style={styles.subjectText}>{i.subname} </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{
    color: '#5A4FCF',
    fontSize: 16,
    alignSelf: 'flex-start', marginRight:5, fontWeight:900
    }}>({i.stunote.length})</Text>

    <Icon
      name={expandedSubject === outerIndex ? 'chevron-up' : 'chevron-down'}
      size={28}
      color={expandedSubject === outerIndex ? '#3F51B5' : '#757575'}
    />
    {acc && (
  <TouchableOpacity
    style={{ marginLeft: 15 }}
    onPress={() =>
      navigation.navigate('UploadNotes', { subname: i.subname })
    }>
    <Icon name="plus-circle" size={28} color="#4CAF50" />
  </TouchableOpacity>
)}
  </View>
    </TouchableOpacity>


    {expandedSubject === outerIndex && i.stunote?.map((j, innerIndex) => (
      <View key={innerIndex} style={styles.section}>
 
        <View style={styles.iconRow}>
          <View style={styles.profileIcon}>
            <Nodejs width={60} height={53} />
          </View>
          <View>
            <Text style={styles.posterName}>{j.postby}</Text>
            <Text style={styles.posterMail}>
              Posted On :{' '}
              {new Date(j.postdate).toISOString().split('T')[0]} 
            </Text>
          </View>
        </View>

        <Text style={styles.postName}>{j.postname}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => {
            addDownc(i.subname, j.postdate);
            navigation.navigate('WebViewSave', {
              url: `${API_URL}/${j.docurl}`,
            });
          }}>
            <Icon name="download" size={24} color="#007bff" />
            <Text style={styles.downloadText}>({j.downloadc})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => {
            addView(i.subname, j.postdate);
            navigation.navigate('WebViewShow', {
              url: `${API_URL}/${j.docurl}`,
            });
          }}>
            <Icon name="eye" size={24} color="#28a745" />
            <Text style={styles.viewText}>({j.view})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => {
            addLike(i.subname, j.postdate);
          }}>
            <Icon name="heart" size={24} color="#dc3545" />
            <Text style={styles.likeText}>({j.likec})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => {
            navigation.navigate("Showcomments", {
              com: j.comment,
              subname: i.subname,
              postdate: j.postdate,
              sendurl: "/notescom"
            });
          }}>
            <Icon name="comment" size={24} color="#6c757d" />
            <Text style={styles.commentText}>({j.comment?.length})</Text>
          </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => {
                                  if (reqType === j.postbymail){

                      delPost(i.subname, j._id)
                    }
                    else{
                      setErrtxt("Access Denied")
                      setSnvisible(true)
                    }
                    }}>
                      <Icon name="trash-can-outline" size={24} color="#CD5C5C" />
                    
                    </TouchableOpacity>
        </View>
      </View>
    ))}
  </View>
))}

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
  section: {
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 15,
    elevation:12
    //boxShadow: '#0000003D 0 3 8',
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
  
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A0785A',
    flex: 1,
    marginRight: 10,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  createIcon: {
    marginRight: 5,
  },
  createText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  posterName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  posterMail: {
    fontSize: 14,
    color: 'gray',
  },
  postDate: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 10,
  },
  postName: {
    fontSize: 15,
    color: '#555',
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionBtn: {
    alignItems: 'center',
  },
  downloadText: {
    color: '#007bff',
    fontSize: 12,
  },
  viewText: {
    color: '#28a745',
    fontSize: 12,
  },
  likeText: {
    color: '#dc3545',
    fontSize: 12,
  },
  commentText: {
    color: '#6c757d',
    fontSize: 12,
  },
});
