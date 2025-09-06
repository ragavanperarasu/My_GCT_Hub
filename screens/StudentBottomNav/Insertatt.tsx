import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable, ToastAndroid, Vibration
} from 'react-native';
import {
  Appbar,
  Dialog,
  Portal,
  Button,
  Text,
  Surface,
  TextInput,
  Snackbar,
  Icon,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';
import axios from 'axios';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import {API_URL} from '@env';
import Loading from '../components/Loading';
import useNetworkStatus from '../functions/useNetworkStatus';

const pdata = [
  {key: '1', value: '1'},
  {key: '2', value: '2'},
  {key: '3', value: '3'},
  {key: '4', value: '4'},
  {key: '5', value: '5'},
  {key: '6', value: '6'},
  {key: '7', value: '7'},
  {key: '8', value: '8'},
];

type SubShowScreenProp = StackNavigationProp<RootStackParamList, 'Insertatt'>;

export default function Insertatt({route}: {route: SubShowScreenProp}) {
  const navigation = useNavigation<SubShowScreenProp>();
  const {data} = route.params;
  const netc = useNetworkStatus();

  const [sub, setSub] = useState('');
  const [period, setPeriod] = useState('');
  const [attendance, setAttendance] = useState<{[key: string]: string}>({});
  const [alist, setAlist] = useState<any[]>([]);
  const [visible1, setVisible1] = useState(false);
  const [aoverwrite, setAoverwrite] = useState('no');

  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const [visible4, setVisible4] = useState(false);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [load, setLoad] = useState(false);

  useEffect(() => {
    resetAtt();
  }, [data.sname]);

  function resetAtt() {
    const initialAttendance: {[key: string]: string} = {};
    data.sname?.forEach(d => {
      initialAttendance[d.key] = 'P'; // Default to Present
    });
    setAttendance(initialAttendance);
  }

  const handleAttendanceChange = (key: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [key]: status,
    }));
  };

  function submitAtt() {
    // Convert all students into an array with their status
    const fullList = data.sname?.map(d => ({
      key: d.key,
      value: d.value,
      status: attendance[d.key],
    }));

    setAlist(fullList);
    setVisible1(true);
  }

  async function sendUserData() {
    setLoad(true);
    const jsonData = {
      aid: data._id,
      mail: data.mail,
      date: date.toISOString().split('T')[0],
      sub: sub,
      period: period,
      alist: alist, // now contains ALL students with their status
      aoverwrite: aoverwrite,
    };

    try {
      const url = API_URL + '/attins';
      await axios.post(url, jsonData).then(res => {
        if (res.data === 'success') {
          setAoverwrite('no');
          setVisible2(true);
        } else if (res.data === 'warning') {
          setAoverwrite('no');
          setVisible3(true);
        } else {
          setVisible4(true);
        }
      });
    } catch (error) {
      //console.log(error);
    } finally {
      setLoad(false);
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  function handleButtonSubmit() {
    if (sub === '') {
      ToastAndroid.show('Select Subject Name', ToastAndroid.LONG);
      Vibration.vibrate(100);
    } else if (period === '') {
      ToastAndroid.show('Select Period Number', ToastAndroid.LONG);
      Vibration.vibrate(100);
    }
    else if (netc) {
      ToastAndroid.show('No, Internet Connection', ToastAndroid.LONG);
      Vibration.vibrate(100);
    }
    else {
      submitAtt();
    }
  }

  if (load) {
    return (
<Loading loadtext={"Connecting to Server"} />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>


        <Portal>
          <Dialog
            visible={visible2}
            onDismiss={() => {
              setVisible2(false);
            }}
            style={{backgroundColor: '#F7F7F7'}}>
            <Dialog.Icon icon="database-check" size={70} color="#3EB489" />
            <Dialog.Title
              style={{textAlign: 'center', color: '#3EB489', fontWeight: 800}}>
              Attendance Updated Successfully
            </Dialog.Title>

            <Dialog.Actions>
              <Button
                onPress={() => {
                  setVisible2(false);
                }}
                textColor="#6F2DA8">
                Okay
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog
            visible={visible4}
            onDismiss={() => {
              setVisible4(false);
            }}
            style={{backgroundColor: '#F7F7F7'}}>
            <Dialog.Icon icon="database-remove" size={70} color="#ED2839" />
            <Dialog.Title
              style={{textAlign: 'center', color: '#ED2839', fontWeight: 800}}>
              Something Network Issue
            </Dialog.Title>

            <Dialog.Actions>
              <Button
                onPress={() => {
                  setVisible4(false);
                }}
                textColor="#6F2DA8">
                Okay
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={visible3} style={{backgroundColor: '#F7F7F7'}}>
            <Dialog.Icon icon="database-alert" size={70} color="#ED2839" />
            <Dialog.Title
              style={{textAlign: 'center', color: '#ED2839', fontWeight: 800}}>
              Warning
            </Dialog.Title>
            <Text
              variant="bodyMedium"
              style={{color: 'black', fontSize: 17, textAlign: 'center'}}>
              Attendance for this date and period already exists
            </Text>

            <Dialog.Actions>
              <Button
                onPress={() => {
                  setVisible3(false);
                  setAoverwrite('yes');
                  submitAtt();
                }}
                textColor="#6F2DA8">
                Overwrite
              </Button>
              <Button
                onPress={() => {
                  setVisible3(false);
                }}
                textColor="#6F2DA8">
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={visible1} style={{backgroundColor: '#F7F7F7'}}>
            <Dialog.Icon icon="information" size={40} color="#FFBF00" />
            <Dialog.Title style={{textAlign: 'center', color: '#FFBF00'}}>
              Attendance Status
            </Dialog.Title>
            <Text
              variant="bodyMedium"
              style={{color: 'black', fontSize: 17, textAlign: 'center'}}>
              Are you sure you want to submit?
            </Text>

            <Dialog.Content>
              <Text style={styles.dialogInfo}>Period No: {period}</Text>
              <Text style={styles.dialogInfo}>Subject : {sub}</Text>
              <Text style={[styles.dialogInfo, {color: '#FFBF00'}]}>
                Total OD: {alist.filter(s => s.status === 'O').length}
              </Text>
              <Text style={[styles.dialogInfo, {color: '#3EB489'}]}>
                Total Present: {alist.filter(s => s.status === 'P').length}
              </Text>

              <Text style={[styles.dialogInfo, {color: '#FF4C4C'}]}>
                Total Absent: {alist.filter(s => s.status === 'A').length}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible1(false)} textColor="#6F2DA8">
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setVisible1(false);
                  sendUserData();
                }}
                textColor="#6F2DA8">
                Yes
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Appbar.Header
          style={{
            backgroundColor: '#F7F7F7',
            elevation: 20,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}>
          <Appbar.Content
            title="Insert Attendance"
            color="#1CA9C9"
            titleStyle={{fontWeight: '700', fontSize: 20, textAlign: 'center'}}
          />
        </Appbar.Header>
        <ScrollView>
          <View style={styles.subjectCard}>
            <Text
              style={styles.subjectText}
              numberOfLines={2}
              ellipsizeMode="tail">
              <Icon source="microsoft-excel" color="#007FFF" size={20} /> Reset
            </Text>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                setSub('');
                setPeriod('');
              }}>
              <Icon source="book-sync" color="#007FFF" size={25} />

              <Text style={styles.createText}> Subject</Text>
              {/* <Text style={styles.createText}>Export</Text> */}
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton} onPress={resetAtt}>
              <Icon source="account-sync" color="#007FFF" size={25} />
              <Text style={styles.createText}> Students</Text>
              {/* <Text style={styles.createText}>Export</Text> */}
            </TouchableOpacity>
          </View>
          <View style={{marginHorizontal: 5}}>
            <SelectList
              setSelected={setSub}
              data={data.sub}
              save="value"
              boxStyles={styles.box}
              dropdownStyles={styles.dropdown}
              placeholder="Select Subject"
              inputStyles={{
                color: sub === '' ? '#BEBFC5' : 'black',
              }}
              defaultOption={{key: sub, value: sub}}
            />

            <SelectList
              setSelected={setPeriod}
              data={pdata}
              save="value"
              boxStyles={styles.box2}
              dropdownStyles={styles.dropdown}
              placeholder="Select Period"
              inputStyles={{
                color: period === '' ? '#BEBFC5' : 'black',
              }}
              defaultOption={{key: period, value: period}}
            />

            <TouchableOpacity onPress={() => setShow(true)}>
              <TextInput
                value={date.toISOString().split('T')[0]}
                mode="outlined"
                editable={false}
                placeholder="Select Date"
                style={styles.input}
                activeOutlineColor="#6082B6"
                outlineColor="white"
                outlineStyle={{borderWidth: 1.5, elevation: 10}}
                textColor="black"
                theme={{
                  roundness: 10,
                }}
                right={
                  <TextInput.Icon
                    icon="calendar-month"
                    onPress={() => setShow(true)}
                  />
                }
              />
            </TouchableOpacity>

            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}

            {data.sname?.map(d => (
              <View key={d.key} style={styles.studentCard}>
                <Text style={styles.studentName}>
                  <Icon2 name="user-graduate" size={24} color="#8A3324" />
                  {'  '}
                  {d.value}
                </Text>
                <View style={styles.attendanceRow}>
                  {[
                    {
                      value: 'P',
                      label: 'Present',
                      color: '#3EB489',
                      icon: 'account-check',
                    },
                    {
                      value: 'A',
                      label: 'Absent',
                      color: '#FF4C4C',
                      icon: 'account-remove',
                    },
                    {
                      value: 'O',
                      label: 'OD',
                      color: '#FFD700',
                      icon: 'account-clock',
                    },
                  ].map(btn => {
                    const isSelected = attendance[d.key] === btn.value;
                    return (
                      <TouchableOpacity
                        key={btn.value}
                        onPress={() => handleAttendanceChange(d.key, btn.value)}
                        style={{
                          backgroundColor: isSelected ? btn.color : '#F0F0F0',
                          borderColor: isSelected ? btn.color : '#A9A9A9',
                          borderWidth: 1,
                          borderRadius: 20,
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          marginHorizontal: 5,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Icon1
                          name={btn.icon}
                          size={18}
                          color={isSelected ? 'white' : 'black'}
                        />
                        <Text
                          style={{
                            marginLeft: 5,
                            color: isSelected ? 'white' : 'black',
                            fontWeight: 'bold',
                          }}>
                          {btn.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            <Pressable
              style={{width: '100%', marginTop: 15, marginBottom: 60}}
              onPress={handleButtonSubmit}>
              {({pressed}) => (
                <Surface
                  elevation={4}
                  style={[
                    styles.surface2,
                    pressed && {backgroundColor: '#E5E4E2'},
                  ]}>
                  <Text
                    style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
                    <Icon1 source="account-plus" color="white" size={20} /> Show
                    Absentees Before Submit
                  </Text>
                </Surface>
              )}
            </Pressable>
          </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  surface2: {
    padding: 8,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#1E90FF',
  },
  box: {
    borderColor: 'white',
    backgroundColor: 'white',
    marginVertical: 15,
    borderRadius: 10,
    elevation: 10,
  },
  box2: {
    borderColor: 'white',
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    elevation: 10,
  },
  dropdown: {
    borderColor: '#007bff',
    backgroundColor: 'white',
  },
  studentCard: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 10,
    padding: 10,
  },
  studentName: {
    color: '#8A3324',
    marginVertical: 15,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 5,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  dialogInfo: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#007FFF',
    fontSize: 17,
    padding: 5,
    marginTop: 5,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    height: 45,
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
    color: '#007FFF',
    flex: 1,
    marginRight: 10,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginHorizontal: 5,
  },
  createText: {
    color: '#246BCE',
    fontWeight: 'bold',
  },
});
