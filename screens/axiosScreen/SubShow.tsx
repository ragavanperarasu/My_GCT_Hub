import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Vibration,
} from 'react-native';
import Nodejs from '../../assets/images/accoun.svg';
import {Avatar, Card, Text, Button, Appbar, Snackbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';
import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import axios from 'axios';
import Loading from '../components/Loading';

import * as Animatable from 'react-native-animatable';

import Feather from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';

import AddSubjectSheet from '../components/AddSubjectSheet';

import cat from '../../assets/animations/cat.json'

const GETTING_POST = '/getpost';

type SubShowScreenProp = StackNavigationProp<RootStackParamList, 'SubShow'>;

export default function SubShow({route}: {route: SubShowScreenProp}) {
  const navigation = useNavigation<SubShowScreenProp>();

  const {reqType, regType, depType, userType, access} = route.params;

  const [data, setData] = useState([]);

  const [acc, setAcc] = useState(true);

  const [load, setLoad] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'AZ' | 'ZA'>('AZ');

  const refRBSheet = useRef<RBSheet>(null);

  useEffect(() => {
    if (access === 'Student') setAcc(true);
    else if (access === 'Admin') setAcc(true);
    else if (access === 'Root') setAcc(true);
    getData();
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
          onPress={() => refRBSheet.current?.open()}
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
          'http://192.168.150.104:5000' +
          `/app/subjects/sublist/${regType}/${depType}`;
        await axios.get(url).then(res => {
          const resData = res.data;
          setData(resData.data);
        });
        setLoad(false);
      } catch (error) {
        setLoad(false);
      }
    };
    fetchData();
  }

  function addNewSubject() {
    ToastAndroid.show('Something Issue', ToastAndroid.SHORT);
  }

  if (load) {
    return <Loading />;
  }

  const filteredData = data
    ?.filter(item =>
      item.subname.toLowerCase().includes(searchText.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === 'AZ') {
        return a.subname.localeCompare(b.subname);
      } else {
        return b.subname.localeCompare(a.subname);
      }
    });

  return (
  <View style={{ flex: 1, backgroundColor: '#ffffffff' }}>
    <AddSubjectSheet ref={refRBSheet} onSubmit={getData} />

    <View style={styles.filterBar}>
      {/* Search */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#6B7280" />
        <TextInput
          placeholder="Search subject"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {/* Sort Button */}
      <TouchableOpacity
        style={styles.sortBtn}
        onPress={() =>
          setSortOrder(prev => (prev === 'AZ' ? 'ZA' : 'AZ'))
        }>
        <Feather
          name={sortOrder === 'AZ' ? 'arrow-down' : 'arrow-up'}
          size={18}
          color="#1560BD"
        />
        <Text style={styles.sortText}>
          {sortOrder === 'AZ' ? 'A–Z' : 'Z–A'}
        </Text>
      </TouchableOpacity>
    </View>

    {/* ✅ Empty State */}
    {filteredData?.length === 0 ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        source={cat}
        autoPlay
        loop
        style={{
          width: '100%',
          height: 200,
          alignSelf: 'center',
        }}
      />
      <Text style={{ marginTop: 10, color: '#1560BD', fontFamily:'Momo Trust Display', fontSize:17}}>
  Data Not Available
</Text>
      </View>
    ) : (
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredData.map((i, outerIndex) => (
          <Animatable.View
            animation="zoomIn"
            duration={800}
            delay={outerIndex * 60}
            useNativeDriver
            key={outerIndex}
            style={styles.outerContainer}>
            <TouchableOpacity activeOpacity={0.8} style={styles.subjectCard} onPress={()=>
              navigation.navigate('PostShow',{reqType:reqType, userid:userType, subid:i._id, access:access})
            }>
              <View style={styles.leftIcon}>
                <Feather name="book-open" color="#1560BD" size={22} />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.subjectText}>{i.subname}</Text>
                <Text style={styles.subText}>Tap to view post</Text>
              </View>

              <Feather name="chevron-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>
    )}
  </View>
);

}

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 10,
    marginTop: 12,
  },

  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7ff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },

  leftIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
  },

  subjectText: {
    fontSize: 15,
    fontFamily: 'Momo Trust Display',
    color: '#00A86B',
  },

  subText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Philosopher',
    marginTop: 2,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Momo Trust Display',
    marginTop: 15,
    marginBottom: 8,
    color: '#1560BD',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Philosopher',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
    fontFamily: 'Philosopher',
  },
  submitBtn: {
    marginTop: 25,
    backgroundColor: '#1560BD',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Philosopher',
  },

  // new css
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 40,
  },

  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Philosopher',
  },

  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 10,
  },

  sortText: {
    marginLeft: 4,
    color: '#1560BD',
    fontFamily: 'Philosopher',
    fontSize: 14,
  },
});
