import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Text, Button, TextInput, Snackbar} from 'react-native-paper';
import Nodejs from '../../assets/images/nodejs.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import axios from 'axios';
import {API_URL} from '@env';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import Loading from '../components/Loading';



const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

const Showcomments = ({route}) => {
const navigation = useNavigation();
  const {com, subname, postdate, sendurl} = route.params;

  const [userdata, setUserdata] = useState({});
  const [tempdept, setTempdept] = useState('');
  const [tempsem, setTempSem] = useState('');

  const [commentText, setCommentText] = useState('');


  const [load, setLoad] = useState(false);
    const [loadtext, setLoadtext] = useState('Connecting to server');
  
    const [errtxt, setErrtxt] = useState('');
    const [snvisible, setSnvisible] = useState(false);


  const [netc, setNetc] = React.useState(false);


    useEffect(() => {
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

  function netStatusCheck() {
    NetInfo.fetch().then(state => {
      setNetc(!state.isConnected);
    });
  }

  setInterval(() => netStatusCheck(), 3000);



  if (load) {
      return (
        <Loading loadtext={loadtext} />
      );
    }

   function addComt() {

     if (!commentText.trim()) {
    setErrtxt('Comment cannot be empty');
    setSnvisible(true);
    return;
  }
   else if (netc === true) {
      setErrtxt('No Internet Connection');
      setSnvisible(true);
      return;
    }

    const fetchData = async () => {
      const jsonData = {
        department: tempdept,
        sem: tempsem,
        subname: subname,
        postdate: postdate,
        com: commentText,
        commentby: userdata.name
      };

      try {
        const url = API_URL + sendurl;
        axios.post(url, jsonData).then(res => {

          const resData = res.data;
          if(resData === 'success'){
            setLoadtext("Comment Added Successfully")
            setTimeout(()=>{navigation.navigate('StudentHome')},2000)
          }
          else{
            setLoad(false)
            setErrtxt("Something Problem")
            setSnvisible(true)
          }

        });

      } catch (error) {
        setLoad(false);
        setErrtxt('Network Problem');
        setSnvisible(true);
      }
    };
    setLoadtext("Adding Your Comment");
    setLoad(true)
    fetchData();
  }

  return (
    <View style={styles.container}>
    <ScrollView >
      <Text style={styles.heading}>Comments</Text>

      {com && com.length > 0 ? (
        com.map((item, index) => (
          <View key={item._id || index} style={styles.section}>
            <View style={styles.iconRow}>
              <View style={styles.profileIcon}>
                <Nodejs width={40} height={40} />
              </View>
              <View>
                <Text style={styles.posterName}>{item.commentby}</Text>
                <Text style={styles.posterMail}>
                  Commented On:{' '}
                  {new Date(item.cdate).toISOString().split('T')[0]}
                </Text>
              </View>
            </View>
            <Text style={styles.commentContent}>{item.com}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noComments}>No comments available</Text>
      )}
    </ScrollView>

    <View style={styles.commentInputContainer}>
  <TextInput
    mode="outlined"
    placeholder="Write Your Comment..."
    value={commentText}
    onChangeText={setCommentText}
    style={styles.input}
    multiline
    textColor='black'
    activeOutlineColor="#6082B6"
  />
  <Button
    mode="contained"
    onPress={addComt}
    style={styles.sendButton}
    labelStyle={{color: 'white'}}>
    Add Comment
  </Button>

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


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007FFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  section: {
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
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
  commentContent: {
    fontSize: 15,
    color: '#555',
    marginVertical: 10,
    marginLeft: 5,
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    fontSize: 15,
    marginTop: 20,
    fontStyle: 'italic',
  },
   but: {
    backgroundColor: '#007FFF',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    height:50,
  },
  but2: {
    backgroundColor: '#DE3163',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height:45
  },
  butlab: {
    color: 'white',
    fontSize: 20,
    padding: 5,
  },

  commentInputContainer: {
  marginTop: 20,
  backgroundColor: '#fff',
},

input: {
    marginTop: 10,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 50,
    marginBottom:10,
    paddingTop:10,

  },

sendButton: {
  backgroundColor: '#007FFF',
  borderRadius: 5,
  height: 45,
  justifyContent: 'center',
},


});

export default Showcomments;
