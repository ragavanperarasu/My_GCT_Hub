import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Vibration,
} from 'react-native';
import {
  Appbar,
  Text,
  DataTable,
  Button,
  Icon,
  TextInput,
  Snackbar,
  Portal,
  Dialog,
} from 'react-native-paper';

import axios from 'axios';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {API_URL} from '@env';
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import {encode} from 'base64-arraybuffer';
import Loading from '../components/Loading';
import useNetworkStatus from '../functions/useNetworkStatus';

const Attview = ({route}) => {
  const {data} = route.params;
  const netc = useNetworkStatus();

  const [load, setLoad] = useState(false);
  const [loadtext, setLoadtext] = useState('Connecting to server');

  const [rdata, setRdata] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [sub, setSub] = useState('');
  const [visible2, setVisible2] = useState(false);
  const [sregres, setSregres] = useState({});
  const [sregno, setSregno] = useState('');

  async function fetchData(stype: string, freq: string) {
    if (netc) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
      Vibration.vibrate(100);
      return;
    }
    setLoad(true);
    setLoadtext('Connecting to server...');
    try {
      const url = API_URL + '/attview';
      const jsonData = {
        mail: 'test',
        aid: data._id,
        stype: stype,
        date: date.toISOString().split('T')[0],
        sub: sub,
        sname: data.sname,
      };

      const res = await axios.post(url, jsonData, {
        responseType: 'arraybuffer', // binary response
        onDownloadProgress: progressEvent => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setLoadtext(`Fetching... ${percentCompleted}%`);
          } else {
            setLoadtext(`Fetching...`);
          }
        },
      });

      setLoadtext('Converting file...');

      const base64Data = encode(res.data);

      const path = `${
        RNFS.TemporaryDirectoryPath
      }/attendance_${Date.now()}.xlsx`;
      await RNFS.writeFile(path, base64Data, 'base64');

      setLoadtext('Finalizing...');

      if (freq === 'save') {
        if (Platform.OS === 'android') {
          ToastAndroid.show(`File saved to ${path}`, ToastAndroid.LONG);
        } else {
          Alert.alert('Success', 'File saved to Downloads/attendance.xlsx');
        }
      } else if (freq === 'share') {
        await Share.open({
          url: `file://${path}`,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          showAppsToView: true,
        });
      }
      setLoadtext('Completed!');
    } catch (error) {
      // setErrtxt('Server Problem');
      // setSnvisible(true);
    } finally {
      setLoad(false);
    }
  }

  async function fetchDataDateWise(stype: string, reg: string) {
    if (netc) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
      Vibration.vibrate(100);
      return;
    }
    setLoadtext('Connecting to server');
    setLoad(true);
    try {
      const url = API_URL + '/attview';
      const jsonData = {
        mail: 'test',
        aid: data._id,
        stype: stype,
        date: date.toISOString().split('T')[0],
        sub: sub,
        regno: reg,
      };

      if (stype !== 'date') {
        setLoadtext('Analysing Attendance');
        jsonData.sname = data.sname;
      }

      const res = await axios.post(url, jsonData);

      if (stype === 'date') {
        setRdata(res.data || []);
        setShowTable(true);
      } else {
        setSregres(res.data);
        setVisible2(true);
      }
    } catch (error) {
      ToastAndroid.show('Server Side Problem', ToastAndroid.LONG);
      Vibration.vibrate(100);
    } finally {
      setLoad(false);
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  if (load) {
    return <Loading loadtext={loadtext} />;
  }

  function searchDateWise(stype: string) {
    if (netc) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
      Vibration.vibrate(100);
      return;
    }

    if (stype === 'date') {
      fetchDataDateWise(stype, sregno);
      return;
    }

    if (sregno === '') {
      ToastAndroid.show('Enter Your Register Number', ToastAndroid.SHORT);
      Vibration.vibrate(100);
      return;
    }

    const s = data.sname.find(s => s.value === sregno);
    if (s) {
      fetchDataDateWise(stype, sregno);
    } else {
      ToastAndroid.show('Enter Valid Register Number', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    }
  }

  function searchSubWise(extype: string, freq: string) {
    if (sub === '') {
      ToastAndroid.show('Select Subject', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else if (netc) {
      ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
      Vibration.vibrate(100);
    } else {
      fetchData(extype, freq);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content
          title="Attendance"
          color="#1CA9C9"
          titleStyle={styles.appBarTitle}
        />
      </Appbar.Header>

      <ScrollView>
        <Portal>
          <Dialog visible={visible2} style={{backgroundColor: '#F7F7F7'}}>
            <Text
              style={{
                textAlign: 'center',
                color: '#3EB489',
                fontWeight: 800,
                fontSize: 50,
                marginBottom: 20,
                fontStyle: 'italic',
              }}>
              {sregres.percentage}
            </Text>

            <Text
              style={{
                textAlign: 'center',
                color: '#007FFF',
                fontWeight: 800,
                fontSize: 18,
                marginBottom: 10,
              }}>
              {sregres.regno}
            </Text>

            <Text
              style={{
                textAlign: 'center',
                color: '#FF7538',
                fontWeight: 800,
                fontSize: 18,
                marginBottom: 10,
              }}>
              Present Period :{sregres.present}
            </Text>

            <Text
              style={{
                textAlign: 'center',
                color: '#79443B',
                fontWeight: 800,
                fontSize: 18,
                marginBottom: 10,
              }}>
              Total Period :{sregres.total}
            </Text>

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

        <View style={styles.subjectCard}>
          <Text
            style={styles.subjectText}
            numberOfLines={2}
            ellipsizeMode="tail">
            <Icon source="microsoft-excel" color="#00A550" size={20} /> Export
            All
          </Text>

          {/* <TouchableOpacity
              style={styles.createButton}
              onPress={() => fetchData('alld', "save")}>
              <Icon source="download" color="#007FFF" size={25} />
              <Icon source="microsoft-excel" color="#00A550" size={25} />
           
            </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => fetchData('alls', 'share')}>
            <Icon source="whatsapp" color="#25D366" size={25} />

            <Icon source="google-drive" color="#3D6EC9" size={25} />
            <Icon source="microsoft-excel" color="#00A550" size={25} />
            <Icon source="gmail" color="#DB4437" size={25} />
            {/* <Text style={styles.createText}>Export</Text> */}
          </TouchableOpacity>
        </View>

        <View style={styles.subjectCard}>
          <Text
            style={styles.subjectText}
            numberOfLines={2}
            ellipsizeMode="tail">
            <Icon source="microsoft-excel" color="#00A550" size={20} /> Export
            Subject
          </Text>

          {/* <TouchableOpacity
              style={styles.createButton}
              onPress={() => searchSubWise('subd', 'save')}>
              <Icon source="download" color="#007FFF" size={25} />
              <Icon source="microsoft-excel" color="#00A550" size={25} />
              
            </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => searchSubWise('subs', 'share')}>
            <Icon source="whatsapp" color="#25D366" size={25} />

            <Icon source="google-drive" color="#3D6EC9" size={25} />
            <Icon source="microsoft-excel" color="#00A550" size={25} />
            <Icon source="gmail" color="#DB4437" size={25} />
            {/* <Text style={styles.createText}>Export</Text> */}
          </TouchableOpacity>
        </View>

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
        />

        {/* ========================================================================== */}
        <View style={styles.subjectCard}>
          <Text
            style={styles.subjectText}
            numberOfLines={2}
            ellipsizeMode="tail">
            <Icon source="table-eye" color="#00A550" size={20} /> My Percentage
          </Text>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => searchDateWise('regno')}>
            <Icon source="database-search" color="#3D6EC9" size={25} />

            <Text style={styles.createText}>Search</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{marginHorizontal: 5, marginVertical: 10}}>
          <TextInput
            mode="outlined"
            value={sregno}
            placeholder="Your Register Number"
            style={styles.input}
            activeOutlineColor="#6082B6"
            onChangeText={setSregno}
            outlineColor="white"
            placeholderTextColor={'#C0C0C0'}
            outlineStyle={{borderWidth: 1.5, elevation: 10}}
            textColor="black"
            theme={{
              roundness: 10,
            }}
            right={<TextInput.Icon icon="badge-account" />}
          />
        </TouchableOpacity>

        {/* ========================================================= */}

        <View style={styles.subjectCard}>
          <Text
            style={styles.subjectText}
            numberOfLines={2}
            ellipsizeMode="tail">
            <Icon source="table-eye" color="#00A550" size={20} /> Show
            Particular Date
          </Text>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => searchDateWise('date')}>
            <Icon source="database-search" color="#3D6EC9" size={25} />

            <Text style={styles.createText}>Search</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setShow(true)}
          style={{marginHorizontal: 5, marginVertical: 10}}>
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

        {showTable && (
          <ScrollView horizontal>
            <View style={styles.tableContainer}>
              <DataTable>
                <DataTable.Header style={styles.header}>
                  <DataTable.Title style={[styles.cell, styles.columnFixed]}>
                    <Text style={styles.headerText}>Sl No</Text>
                  </DataTable.Title>
                  <DataTable.Title style={[styles.cell, styles.columnFixed]}>
                    <Text style={styles.headerText}>Date</Text>
                  </DataTable.Title>
                  <DataTable.Title style={[styles.cell, styles.columnFixed]}>
                    <Text style={styles.headerText}>Subject</Text>
                  </DataTable.Title>
                  <DataTable.Title style={[styles.cell, styles.columnFixed]}>
                    <Text style={styles.headerText}>Period</Text>
                  </DataTable.Title>
                  {data.sname.map((d, ind) => (
                    <DataTable.Title
                      key={ind}
                      style={[styles.cell, styles.columnFixed]}>
                      <Text style={styles.headerText}>{d.value}</Text>
                    </DataTable.Title>
                  ))}
                  <DataTable.Title style={[styles.cell, styles.columnFixed]}>
                    <Text style={styles.headerText}>Absent Count</Text>
                  </DataTable.Title>
                </DataTable.Header>

                {Array.isArray(rdata) &&
                  rdata.length > 0 &&
                  rdata.map((d, ind) => {
                    const absentCount = d.alist.filter(
                      a => a.status === 'A',
                    ).length;

                    const rowStyle = {
                      backgroundColor: ind % 2 === 0 ? '#f2f2f2' : '#ffffff', // even: light gray, odd: white
                    };

                    return (
                      <DataTable.Row key={ind} style={rowStyle}>
                        <DataTable.Cell
                          style={[styles.cell, styles.columnFixed]}>
                          <Text style={styles.text}>{ind + 1}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cell, styles.columnFixed]}>
                          <Text style={styles.text}>
                            {new Date(d.date).toLocaleDateString()}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cell, styles.columnFixed]}>
                          <Text style={styles.text}>{d.sub}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell
                          style={[styles.cell, styles.columnFixed]}>
                          <Text style={styles.text}>{d.period}</Text>
                        </DataTable.Cell>
                        {d.alist.map((d2, ind2) => (
                          <DataTable.Cell
                            key={ind2}
                            style={[styles.cell, styles.columnFixed]}>
                            <Text style={styles.text}>{d2.status}</Text>
                          </DataTable.Cell>
                        ))}
                        <DataTable.Cell
                          style={[styles.cell, styles.columnFixed]}>
                          <Text style={styles.text}>{absentCount}</Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                    );
                  })}
              </DataTable>
            </View>
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingText: {
    color: '#007FFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 23,
  },
  appBar: {
    backgroundColor: '#ffffffff',
    elevation: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  appBarTitle: {fontWeight: '700', fontSize: 20, textAlign: 'center'},
  tableContainer: {borderWidth: 1, borderColor: 'black', margin: 15},
  header: {backgroundColor: '#00A86B'},
  cell: {borderRightWidth: 1, borderColor: 'black', justifyContent: 'center'},
  columnFixed: {width: 120},
  headerText: {color: 'white', fontWeight: 'bold', textAlign: 'center'},
  text: {color: 'black', textAlign: 'center'},
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
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginHorizontal: 5,
  },
  createIcon: {
    marginRight: 5,
  },
  createText: {
    color: '#246BCE',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 5,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    height: 45,
  },
  box: {
    borderColor: 'white',
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 10,
  },
  dropdown: {
    borderColor: '#007bff',
    backgroundColor: 'white',
  },
});

export default Attview;
