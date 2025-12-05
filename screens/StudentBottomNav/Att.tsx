import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
 ToastAndroid
} from 'react-native';
import {
  Appbar,
  Snackbar,
  Dialog,
  Portal,
  Button,
  Text, TextInput, Icon
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {API_URL} from '@env';
import axios from 'axios';
import Nodejs from '../../assets/images/accoun.svg';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import Loading from '../components/Loading';
import * as Animatable from 'react-native-animatable';

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});



const Att = () => {
  const navigation = useNavigation();

  const [load, setLoad] = useState(false);
  const [loadtext, setLoadtext] = useState('Connecting to server');

  const [errtxt, setErrtxt] = useState('');
  const [snvisible, setSnvisible] = useState(false);

  const [rdata, setRdata] = useState({});
  const [netc, setNetc] = React.useState(false);

  const [userdata, setUserdata] = React.useState({});
  const [tempdept, setTempdept] = React.useState('');
   const [acc, setAcc] = useState(false);

  useEffect(() => {
    initialCase();
  }, []);

// ✅ loadCache only sets data
const loadCache = async () => {
  const cacheUserData = await cache.get('userdata');
  const ctempdept = await cache.get('tempdept');

  setUserdata(cacheUserData);
  setTempdept(ctempdept);

  if (cacheUserData.roll === 'Root' || cacheUserData.roll === 'Admin' || cacheUserData.roll === 'Staff') {
    setAcc(true);
  } else {
    setAcc(false);
  }
  fetchData(ctempdept)
  
};





  function netStatusCheck() {
    NetInfo.fetch().then(state => {
      setNetc(!state.isConnected);
    });
  }

  setInterval(() => netStatusCheck(), 3000);

  function initialCase() {
    if (!netc) {
      setLoad(true);
      loadCache();
    } else {
      setErrtxt('No, Internet Connection');
      setSnvisible(true);
    }
  }

  async function fetchData(ctempdept:string) {
    const jsonData = {
      dept: ctempdept,
    };
    try {
      const url = API_URL + '/getatt';

      await axios.post(url, jsonData).then(res => {
        const resData = res.data;
        setRdata(resData);
        setLoad(false);
        ToastAndroid.show(`Displaying only ${ctempdept} Attendance`, ToastAndroid.LONG);
      });
    } catch (error) {
      setLoad(false);
      setErrtxt('Server Side Problem');
      setSnvisible(true);
    }
  }

  if (load) {
    return (
      <Loading loadtext={loadtext}/>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>

        <Appbar.Header
          style={{
            backgroundColor: 'white',
            elevation: 20,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}>
            <Appbar.Action icon="refresh" onPress={() => {}} color='white'/>
          <Appbar.Content
            title="Attendance"
            color="#1CA9C9"
            titleStyle={{fontWeight: '700', fontSize: 20, textAlign: 'center'}}
          />
          <Appbar.Action icon="database-sync" onPress={initialCase} style={{marginRight:10}} color='#007bff'/>
        </Appbar.Header>
        <ScrollView>
           {acc && (      
          <View style={styles.subjectCard}>
            <Text
              style={styles.subjectText}
              numberOfLines={2}
              ellipsizeMode="tail">
                                                  <Icon
                    source="microsoft-excel"
                    color='#00A550'
                    size={20}
                  />{" "}New Attendance
            </Text>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                if (!netc) {
                  navigation.navigate('Attcreate');
                } else {
                  setErrtxt('No, Internet Connection');
                  setSnvisible(true);
                }
              }}>
              <Icon1
                name="plus"
                size={18}
                color="#fff"
                style={styles.createIcon}
              />
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
          </View>)} 

          {rdata &&
            rdata.length > 0 &&
            rdata.map((d, ind) => (
              <Animatable.View key={ind} style={styles.section} animation={'zoomIn'}
      duration={1500} useNativeDriver>
                <View style={styles.iconRow}>
                  <View style={styles.profileIcon}>
                    <Nodejs width={60} height={53} />
                  </View>

                  <View>
                    <Text style={styles.posterName}>{d.name}</Text>
                    <Text style={styles.posterMail}>
                      Created On :{' '}
                      {new Date(d.createdAt).toISOString().split('T')[0]}
                    </Text>
                  </View>
                </View>

                <Text style={styles.postName}>
                  {d.dept}, {d.sem}
                </Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                      if (!netc) {
                        //navigation.navigate('Insertatt', {data: d});
                        if(userdata.mail === d.mail || userdata.roll === 'Staff'){
                          navigation.navigate('Pinenter', {data: d, ftype:"insert"});
                        }
                        else{
                          setErrtxt("Access Denied")
                          setSnvisible(true)
                        }
                        
                      } else {
                        setErrtxt('No, Internet Connection');
                        setSnvisible(true);
                      }
                    }}>
                    <Icon2 name="addchart" size={24} color="#007bff" />
                    <Text style={styles.downloadText}>Insert</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                      if (!netc) {
                        //navigation.navigate('Attview', {data: d});
                        navigation.navigate('Pinenter', {data: d, ftype:"view"});
                      } else {
                        setErrtxt('No, Internet Connection');
                        setSnvisible(true);
                      }
                    }}>
                    <Icon1 name="eye" size={24} color="#28a745" />
                    <Text style={styles.viewText}>View</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity style={styles.actionBtn} onPress={() => {
                    
                      }}>
                        <Icon name="heart" size={24} color="#dc3545" />
                     
                      </TouchableOpacity> */}

                  {/* <TouchableOpacity style={styles.actionBtn} onPress={() => {

                      }}>
                        <Icon name="comment" size={24} color="#6c757d" />
                     
                      </TouchableOpacity> */}

                  <TouchableOpacity style={styles.actionBtn} onPress={() => {
                      if (!netc) {
                        //navigation.navigate('Insertatt', {data: d});
                        if(userdata.mail === d.mail ){
                          navigation.navigate('Pinenter', {data: d, ftype:"delete"});
                        }
                        else{
                          setErrtxt("Access Denied")
                          setSnvisible(true)
                        }
                        
                      } else {
                        setErrtxt('No, Internet Connection');
                        setSnvisible(true);
                      }
                    }}>
                    <Icon1 name="trash-can-outline" size={24} color="#CD5C5C" />
                    <Text style={styles.likeText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
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
};

const styles = StyleSheet.create({
  section: {
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 15,
    boxShadow: '#0000003D 0 3 8',
    marginHorizontal: 5,
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
    backgroundColor: '#ffffffff',
    padding: 12,
    borderRadius: 15,
    elevation: 10,
    marginTop: 10,
    marginHorizontal: 5,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A86B',
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
    input: {
    marginVertical:15,
    backgroundColor: 'white',
    color: 'black',
    height: 45,
  },
});

export default Att;
