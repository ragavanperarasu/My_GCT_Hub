import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, TextInput, Vibration} from 'react-native';
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

import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RBSheet from 'react-native-raw-bottom-sheet';

import AddSubjectSheet from '../components/AddSubjectSheet';


const GETTING_POST = '/getpost';

type SubShowScreenProp = StackNavigationProp<RootStackParamList, 'SubShow'>;

const deptList = ['Civil','CSE', 'ECE', 'EEE','EIE','IBT', 'Mechanical', 'Production'];
const regulationList = ['2019', '2022', '2023'];


export default function SubShow({route}: {route: SubShowScreenProp}) {
  const navigation = useNavigation<SubShowScreenProp>();
  const {reqType, regType, depType, semType, access} = route.params;
  const [data, setData] = useState([{'subname':'Tamil'},{'subname':'Probability, Random Process and Queueing Theory'},{'subname':'Theory of Computation'},{'subname':'Data Structure'},{'subname':'Java with Object Oriented Programming'},{'subname':'Network Security'}]);

  const [acc, setAcc] = useState(true);

  const [load, setLoad] = useState(false);

  const [errtxt, setErrtxt] = useState('');
  const [snvisible, setSnvisible] = useState(false);

  const [expandedSubject, setExpandedSubject] = useState(null);

  const refRBSheet = useRef<RBSheet>(null);

const [subjectName, setSubjectName] = useState('');
const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
const [regulation, setRegulation] = useState('');


  useEffect(() => {
    if (access === 'Student') setAcc(true);
    else if (access === 'Admin') setAcc(true);
    else if (access === 'Root') setAcc(true);
    //getData();
  }, []);



  // Set header button here
useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => refRBSheet.current?.open()}
        style={{ marginRight: 5 }}
      >
        <Feather name="plus" size={24} color="#1560BD" />
      </TouchableOpacity>
    ),
  });
}, [navigation]);


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

  function addNewSubject(){
    ToastAndroid.show('Something Issue', ToastAndroid.SHORT);
  }


  if (load) {
    return <Loading />;
  }

//   const toggleDept = (dept: string) => {
//   setSelectedDepts(prev =>
//     prev.includes(dept)
//       ? prev.filter(d => d !== dept)
//       : [...prev, dept]
//   );
// };




const handleAddSubject = (payload: {
  subjectName: string;
  departments: string[];
  regulation: string;
}) => {
  console.log('New Subject:', payload);

  // API call here if needed
};



  return (
    <View style={{flex: 1, backgroundColor: '#ffffffff'}}>

      <AddSubjectSheet
  ref={refRBSheet}
  onSubmit={handleAddSubject}
/>


      {/* <RBSheet
  ref={refRBSheet}
  height={450}
  openDuration={250}
  customStyles={{
    container: {
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
  }}
>
  <ScrollView>

    <Text style={styles.label}>Subject Name</Text>
    <TextInput
      placeholder="Enter subject name"
      value={subjectName}
      onChangeText={setSubjectName}
      style={styles.input}
      
    />

    <Text style={styles.label}>Departments (Common)</Text>
    {deptList.map(dept => (
      <TouchableOpacity
        key={dept}
        style={styles.checkboxRow}
        onPress={() => toggleDept(dept)}
      >
        <Feather
          name={selectedDepts.includes(dept) ? 'check-square' : 'square'}
          size={20}
          color="#1560BD"
        />
        <Text style={styles.checkboxText}>{dept}</Text>
      </TouchableOpacity>
    ))}

    <Text style={styles.label}>Regulation</Text>
    {regulationList.map(reg => (
      <TouchableOpacity
        key={reg}
        style={styles.radioRow}
        onPress={() => setRegulation(reg)}
      >
        <Feather
          name={regulation === reg ? 'radio' : 'circle'}
          size={20}
          color="#1560BD"
        />
        <Text style={styles.checkboxText}>{reg}</Text>
      </TouchableOpacity>
    ))}


    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
      <Text style={styles.submitText}>Submit</Text>
    </TouchableOpacity>

  </ScrollView>
</RBSheet> */}


<ScrollView showsVerticalScrollIndicator={false}>
  {data?.map((i, outerIndex) => (
    <Animatable.View
      animation="zoomIn"
      duration={800}
      delay={outerIndex * 80}
      useNativeDriver
      key={outerIndex}
      style={styles.outerContainer}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.subjectCard}
        // onPress={() =>
        //   navigation.navigate("SubjectDetails", { subject: i })
        // }
      >
        {/* Left Icon */}
        <View style={styles.leftIcon}>
           <Feather name="book-open" color="#1560BD" size={22} />
        </View>

        {/* Subject Name */}
        <View style={styles.textContainer}>
          <Text style={styles.subjectText}>{i.subname}</Text>
          <Text style={styles.subText}>Tap to view post</Text>
        </View>

        {/* Right Arrow */}
        <Feather name="chevron-right" size={22} color="#9CA3AF" />
      </TouchableOpacity>
    </Animatable.View>
  ))}
</ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 10,
    marginTop: 12,
  },

  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderColor:'#000000ff',
    borderWidth:0.5,
  },

  leftIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
  },

  subjectText: {
    fontSize: 15,
    fontFamily: 'Momo Trust Display',
    color: "#00A86B",
  },

  subText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: 'Philosopher',
    marginTop: 2,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Momo Trust Display',
    marginTop: 15,
    marginBottom: 8,
    color:'#1560BD'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontFamily:'Philosopher',
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
    color:'black',
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
});
