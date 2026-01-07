import React, {useEffect, useState, useLayoutEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Image, Share} from 'react-native';
import Nodejs from '../../assets/images/accoun.svg';
import {Avatar, Card, Text, Button, Appbar, Snackbar, Badge} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';
import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import Loading from '../components/Loading';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const GETTING_POST = "/getpost"

type PostShowScreenProp = StackNavigationProp<RootStackParamList, "PostShow">;



export default function PostShow({route}:{route: PostShowScreenProp}) {
  const navigation = useNavigation<PostShowScreenProp>();

  const {reqType, userid, subid, access} = route.params;

  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});


  const [load, setLoad] = useState(false);

        useEffect(() => {
        //getData();
      }, []);

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: reqType,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
          color: '#1560BD',
          fontFamily: 'Momo Trust Display',
        },
        headerTintColor: '#1560BD',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('NewPost',{reqType: reqType, userid:userid, subid: subid, subname: '', pdfuri: ''})}
            
            style={{marginRight: 5}}>
            <Feather name="plus" size={24} color="#1560BD" />
          </TouchableOpacity>
        ),
      });
    }, [navigation, reqType]);




      function getData() {
    setLoad(true);
    const fetchData = async () => {
      try {
        const url =
          'http://192.168.150.104:5000' +`/app/posts/semqus/${subid}`;
        await axios.get(url).then(res => {
          const resData = res.data;
          console.log("output : ",resData)
          setData(resData.data);
        });
        setLoad(false);
      } catch (error) {
        setLoad(false);
      }
    };
    fetchData();
  }


  const timeAgo = (date: string) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const days = Math.floor(diff / 86400);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  const hours = Math.floor(diff / 3600);
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const minutes = Math.floor(diff / 60);
  return `${minutes} min ago`;
};

const onSharePdf = async (item) => {
  try {
    const pdfLink = `http://192.168.150.104:5000${item.pdfurl}`;

    await Share.share({
      message: `Hey 👋\n\n${item.postdes}\n\n📄 PDF Link:\n${pdfLink}`,
      url: pdfLink, // iOS support
      title: 'Share PDF',
    });
  } catch (error) {
    console.log('Share error:', error);
  }
};


  if (load) {
    return (
      <Loading/>
    );
  }

return (
  <View style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      {data.map((item, index) => (
        <View key={index} style={styles.card}>

          {/* PDF Thumbnail */}
          <Image
            source={{ uri: `http://192.168.150.104:5000${item.pdfimg}` }}
            style={styles.thumbnail}
          />

{/* Description */}
<Text
  style={styles.description}
  numberOfLines={expanded[item._id] ? undefined : 2}
>
  {item.postdes}
</Text>

{/* Expand / Collapse */}
{item.postdes?.length > 80 && (
  <TouchableOpacity
    onPress={() =>
      setExpanded(prev => ({
        ...prev,
        [item._id]: !prev[item._id],
      }))
    }
  >
    <Text style={styles.expandText}>
      {expanded[item._id] ? 'Show less' : 'Read more'}
    </Text>
  </TouchableOpacity>
)}


          {/* User Info */}
          <View style={styles.userRow}>

            {/* Left */}
            <View style={styles.userLeft}>
              <Image
                source={{ uri: item.useruid.profile }}
                style={styles.profileImg}
              />

              <View>
                <Text style={styles.username}>
                  {item.useruid.name}
                </Text>
                <Text style={styles.timeAgo}>
                  {timeAgo(item.createdAt)}
                </Text>
              </View>
            </View>

            {/* Right: Share */}
            <TouchableOpacity
              onPress={() => onSharePdf(item)}
              style={styles.shareBtn}
            >
              <Feather name="share-2" size={20} color="#ffffffff" />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="eye-outline" size={22} color="#555" />
              <Text style={styles.statText}>{item.view}</Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="cloud-download-outline" size={22} color="#555" />
              <Text style={styles.statText}>{item.downc}</Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-multiple-check-outline" size={22} color="#555" />
              <Text style={styles.statText}>{item.comc}</Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-multiple-remove-outline" size={22} color="#555" />
              <Text style={styles.statText}>{item.comc}</Text>
            </View>

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="comment-processing-outline" size={22} color="#555" />
              <Text style={styles.statText}>{item.comc}</Text>
            </View>

          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },

  card: {
    backgroundColor: '#ffffffff',
    overflow: 'hidden',
  },

  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  description: {
    padding: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Philosopher',
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 1,
    backgroundColor:'#e9e9e9ff'
  },

  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },

  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    fontFamily: 'Philosopher',
  },

  timeAgo: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Philosopher',
  },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#4691ecff',
    borderRadius: 5,
  },

  shareText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#ffffffff',
    fontFamily: 'Philosopher',
    paddingLeft: 3,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    //borderBottomWidth: 4,
    backgroundColor: '#e9e9e9ff',
    //borderColor: '#C0C0C0',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statText: {
    marginLeft: 5,
    color: '#555',
    fontFamily: 'Philosopher',
  },

  expandText: {
  color: '#4691ecff',
  fontSize: 13,
  fontFamily: 'Philosopher',
  paddingHorizontal: 10,
  paddingBottom: 5,
},
});
