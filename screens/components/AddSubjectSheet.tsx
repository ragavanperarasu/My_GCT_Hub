import React, { forwardRef, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Vibration,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Text } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Loading from './Loading';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from 'react-native-cache';

const cache = new Cache({
  namespace: 'mygct',
  policy: { maxEntries: 50000, stdTTL: 0 },
  backend: AsyncStorage,
});

const deptList = ['Civil','CSE','ECE','EEE','EIE','IBT','Mechanical','Production'];
const regulationList = ['2019', '2022', '2023'];

type Props = {
  onSubmit: (data: {
    subjectName: string;
    departments: string[];
    regulation: string;
  }) => void;
};

const AddSubjectSheet = forwardRef<RBSheet, Props>(({ onSubmit }, ref) => {

    const [load, setLoad] = useState(false);
    const [userdata, setUserdata] = React.useState({});

  const [subjectName, setSubjectName] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [regulation, setRegulation] = useState('');

  useEffect(() => {
      const d = async () => {
        const cacheUserData = await cache.get('userdata');
        setUserdata(cacheUserData);
      };
      d();
    }, []);

  const toggleDept = (dept: string) => {
    setSelectedDepts(prev =>
      prev.includes(dept)
        ? prev.filter(d => d !== dept)
        : [...prev, dept]
    );
  };

 const sendSubjectData = async ()=> {
    setLoad(true);

      const jsonData = {
        useruid: userdata._id,
        subname: subjectName,
        regulation: regulation,
        dept: selectedDepts
      };
      console.log("data")
      console.log(jsonData)
    //   try {
    //     const url = API_URL + GETTING_POST;
    //     await axios.post(url, jsonData).then(res => {
    //       const resData = res.data.sub;
    //       setData(resData);
    //     });
    //     setLoad(false);
    //   } catch (error) {
    //     setLoad(false);
    //     setErrtxt('Network Problem');
    //     setSnvisible(true);
    //   }

  }

  const handleSubmit = () => {
    if (!subjectName || selectedDepts.length === 0 || !regulation) {
      ToastAndroid.show('Complete all fields', ToastAndroid.SHORT);
      Vibration.vibrate(100);
      return;
    }
    else{
        //ref?.current?.close();
        sendSubjectData()
    }

    // onSubmit({
    //   subjectName,
    //   departments: selectedDepts,
    //   regulation,
    // });

    // reset
    // setSubjectName('');
    // setSelectedDepts([]);
    // setRegulation('');

    // close sheet
    // @ts-ignore
    // ref?.current?.close();
  };

//    if (load) {
//     return <Loading />;
//   }

  return (
    <RBSheet
      ref={ref}
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
            {load ? (
                <>
                <Text style={[styles.label,{textAlign:'center'}]}>Creating New Subject</Text>
                <Text style={[styles.label,{textAlign:'center', marginTop:0}]}>Don't Close</Text>
      
      <View style={styles.loaderContainer}>
        
        <Loading />
      </View></>
    ) : (
        
      <ScrollView showsVerticalScrollIndicator={false}>
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

        <Text style={styles.label}>Regulatin</Text>
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
      </ScrollView>)}
    </RBSheet>
  );
});

export default AddSubjectSheet;


const styles = StyleSheet.create({
    loaderContainer: {
marginTop:"40%"
},

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
