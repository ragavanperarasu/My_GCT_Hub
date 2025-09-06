import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Nodejs from '../../assets/images/accoun.svg';
import {Avatar, Text,  Appbar, Snackbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';

import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Loading from '../components/Loading';
import axios from 'axios';


const GETTING_POST = "/getpost"

type SubShowScreenProp = StackNavigationProp<RootStackParamList, 'TimetableShow'>;


export default function TimetableShow({route}: {route: SubShowScreenProp}) {
  const navigation = useNavigation<SubShowScreenProp>();
  const {reqType, regType, depType, semType, access} = route.params;

const [acc, setAcc] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
    const [loadtext, setLoadtext] = useState('Connecting to server');
  
    const [errtxt, setErrtxt] = useState('');
    const [snvisible, setSnvisible] = useState(false);

      useEffect(() => {
        if(access === 'Student')
          setAcc(false)
        else if(access === 'Admin')
          setAcc(true)
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
          const resData = res.data.timetable;
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

  function addView() {
    const fetchData = async () => {
      const jsonData = {
        department: depType,
        sem: semType,
      };
      try {
        const url = API_URL + '/syllview';
        axios.post(url, jsonData);
      } catch (error) {
        setLoad(false);
        setErrtxt('Network Problem');
        setSnvisible(true);
      }
    };
    fetchData();
  }

  function addDownc() {
    const fetchData = async () => {
      const jsonData = {
        department: depType,
        sem: semType,
      };
      try {
        const url = API_URL + '/sylldownc';
        axios.post(url, jsonData);
      } catch (error) {
        setLoad(false);
        setErrtxt('Network Problem');
        setSnvisible(true);
      }
    };
    fetchData();
  }

  function addLike() {
    const fetchData = async () => {
      const jsonData = {
        department: depType,
        sem: semType,
        mail: reqType
      };
      try {
        const url = API_URL + '/sylllike';
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

  if (load) {
      return (
        <Loading loadtext={loadtext} />
      );
    }

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      
        <Appbar.Header
          style={{
            backgroundColor: '#ffffffff',
              elevation:20,
              borderBottomLeftRadius:40,
              borderBottomRightRadius:40,
          }}>
          <Appbar.Content
            title="Semester Timetable"
            color="#1CA9C9"
              titleStyle={{fontWeight: '700', fontSize:20, textAlign:"center"}}
          />
        </Appbar.Header>
        <ScrollView>
        <View style={styles.outerContainer}>
          <View style={styles.subjectCard}>
            {/* Subject Name */}
            <Text
              style={styles.subjectText}
              numberOfLines={2}
              ellipsizeMode="tail">
              Add Timetable
            </Text>

            {/* Create Post Button */}
            {acc && (
            <TouchableOpacity style={styles.createButton} onPress={()=> navigation.navigate('UploadTtable', {subname:"test"})}>
              <Icon
                name="plus"
                size={18}
                color="#fff"
                style={styles.createIcon}
              />
              <Text style={styles.createText}>Create Post</Text>
            </TouchableOpacity>)}
          </View>

          {data?.postby?.trim() ? (

          <View style={styles.section}>
            <View style={styles.iconRow}>
              <View style={styles.profileIcon}>
                <Nodejs width={60} height={53} />
              </View>
              <View>
                <Text style={styles.posterName}>{data.postby}</Text>
                <Text style={styles.posterMail}>Posted On : {new Date(data.postdate).toISOString().split('T')[0]}</Text>
              </View>
            </View>

            <Text style={styles.postName}>{data.postname}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => {
                          addDownc();
                          navigation.navigate('WebViewSave', {url: `${API_URL}/${data.docurl}`});}} >
                <Icon name="download" size={24} color="#007bff" />
                <Text style={styles.downloadText}>Download ({data.downloadc})</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={()=>{
                addView()
                 navigation.navigate('WebViewShow', {
                              url: `${API_URL}/${data.docurl}`,
                            });
              }}>
                <Icon name="eye" size={24} color="#28a745" />
                <Text style={styles.viewText}>View ({data.view})</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={addLike}>
                <Icon name="heart" size={24} color="#dc3545" />
                <Text style={styles.likeText}>
                  Like ({data.likec})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={() => {
            navigation.navigate("Showcomments", {
              com: data.comment,
              subname: "test",
              postdate: "test",
              sendurl: "/syllcom"
            });
          }}>
                                <Icon name="comment" size={24} color="#6c757d" />
                                <Text style={styles.commentText}>Comment ({data.comment?.length})</Text>
                              </TouchableOpacity>
            </View>
          </View>): null} 
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
  section: {
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 15,
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
