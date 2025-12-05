import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Text as RNText,
  Platform,
  Image,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  TextInput,
  Appbar,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';
import {API_URL} from '@env';
import Loading from '../components/Loading';
import {useNavigation} from '@react-navigation/native';
import useNetworkStatus from '../functions/useNetworkStatus';
import FastImage from 'react-native-fast-image';
import FileViewer from 'react-native-file-viewer';

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

export default function PageThree() {
  const navigation = useNavigation();
  const netc = useNetworkStatus();
  const [data, setData] = useState([]);

  const [message, setMessage] = useState('');
  const scrollViewRef = useRef(null);

  const [userdata, setUserdata] = React.useState({});
  const [progress, setProgress] = useState(0);
  const [load, setLoad] = useState(false);
  const [loadtext, setLoadtext] = useState('Connecting to server');

  const [visible, setVisible] = React.useState(false);

  const handleLongPress = msg => {
    if (msg.mail !== userdata.mail) {
      ToastAndroid.show("You Can't Delete this Message", ToastAndroid.LONG);
      Vibration.vibrate(100);
    } else {
      setVisible(true);
    }
  };

  useEffect(() => {
    fetchData();
    const loadCache = async () => {
      const cacheUserData = await cache.get('userdata');
      setUserdata(cacheUserData);
    };
    loadCache();
  }, []);

  const fetchData = async () => {
    if (netc) {
      ToastAndroid.show('No Internet Access', ToastAndroid.SHORT);
      Vibration.vibrate(100);
      return;
    }
    setLoadtext('Connecting to server');
    setLoad(true);
    try {
      const res = await axios.get(`${API_URL}/msgget`);
      setData(res.data);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [data]);

  const formatDateTime = timestamp => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const day = date.toLocaleDateString();
    return `${time}, ${day}`;
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;
    const msgObj = {
      id: Date.now().toString(),
      text: message,
      createdAt: Date.now(),
      user: userdata.name,
      mail: userdata.mail,
    };
    setData(prev => [...prev, msgObj]);
    setMessage('');
    setLoadtext('Send Your Message');
    setLoad(true);
    const msgsendurl = `${API_URL}/msgtxt`;
    try {
      await axios
        .post(msgsendurl, {
          text: msgObj.text,
          user: userdata.name,
          mail: userdata.mail,
        })
        .then(res => {
          setLoad(false);
          if (res.data === 'done') {
            ToastAndroid.show('Message Send Successfully', ToastAndroid.LONG);
          } else {
            ToastAndroid.show('Message Not Send', ToastAndroid.LONG);
            Vibration.vibrate(100);
          }
        });
    } catch (error) {
      setLoad(false);
      ToastAndroid.show('Message Not Send', ToastAndroid.LONG);
      Vibration.vibrate(100);
    }
  };

  if (load) {
    return <Loading loadtext={loadtext} />;
  }

  const pickDocument = async () => {
    try {
      if (netc) {
        ToastAndroid.show('No Internet Access', ToastAndroid.SHORT);
        Vibration.vibrate(100);
        return;
      }
      // 1. Let user pick a document (PDF or Image)
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      // 2. Prepare the document object for local UI
      const docObj = {
        id: Date.now().toString(),
        text: res.name,
        fileUri: res.uri,
        mime: res.type,
        timestamp: Date.now(),
        user: userdata.name,
        mail: userdata.mail,
      };

      // 3. Add document to UI list
      setData(prev => [...prev, docObj]);

      // 4. Prepare form data for upload
      const formData = new FormData();
      formData.append('file', {
        uri: res.uri,
        name: res.name,
        type: res.type || 'application/octet-stream',
      });
      formData.append('timestamp', docObj.timestamp);
      formData.append('user', docObj.user);
      formData.append('mail', docObj.mail);

      setLoad(true);
      await axios
        .post(`${API_URL}/msgupl`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: progressEvent => {
            const total = progressEvent.total || 1; // Prevent division by 0
            const percent = Math.round((progressEvent.loaded * 100) / total);
            setLoadtext(`Uploading... ${percent}%`);
          },
        })
        .then(res => {
          setLoad(false);
          if (res.data === 'done') {
            ToastAndroid.show('Sent successfully', ToastAndroid.LONG);
          } else {
            ToastAndroid.show('Message Not Send', ToastAndroid.LONG);
            Vibration.vibrate(100);
          }
          fetchData();
          setSnvisible(true);
        });
    } catch (err) {
      setLoad(false);
      ToastAndroid.show('Message Not Send', ToastAndroid.LONG);
      Vibration.vibrate(100);
    }
  };

  function addLike(postdate: string) {
    const fetchlikeData = async () => {
      const jsonData = {
        createdAt: postdate,
        mail: userdata.mail,
      };
      try {
        const url = `${API_URL}/msglike`;
        await axios.post(url, jsonData).then(res => {
          const resData = res.data;

          if (resData === 'success') {
            ToastAndroid.show('Your Like Added', ToastAndroid.LONG);
            fetchData();
          } else {
            ToastAndroid.show('Your Already Liked', ToastAndroid.LONG);
            Vibration.vibrate(100);
          }
        });
      } catch (error) {
        ToastAndroid.show('Network Problem', ToastAndroid.LONG);
        Vibration.vibrate(100);
      }
    };
    fetchlikeData();
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#FFFFFF'}}
      keyboardVerticalOffset={80}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{flex: 1}}>
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={{backgroundColor: '#F7F7F7'}}>
            <Dialog.Icon icon="message-text" size={40} color="#C40234" />
            <Dialog.Title style={{textAlign: 'center', color: '#C40234'}}>
              Delete Message
            </Dialog.Title>
            <Dialog.Content>
              <Text
                variant="bodyMedium"
                style={{color: 'black', fontSize: 17, textAlign: 'center'}}>
                Are you sure you want to delete your Message?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)} textColor="#6F2DA8">
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setVisible(false);
                }}
                textColor="#6F2DA8">
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Appbar.Header
          style={{
            backgroundColor: 'white',
            margin: 7,
            boxShadow: '#0000003D 0 3 8',
            borderRadius: 10,
            height: 50,
          }}>
          <AntDesign
            size={30}
            name="message1"
            style={{backgroundColor: 'white', marginHorizontal: 10}}
            color="#A8A8A7"
          />
          <Appbar.Content
            title="Messages"
            color="#A8A8A7"
            titleStyle={{fontWeight: '700'}}
          />
          <Appbar.Action icon="refresh" size={30} onPress={fetchData} />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={{padding: 10, paddingBottom: 80}}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}>
          {data.length === 0 ? (
            <Text style={{textAlign: 'center', marginTop: 20, color: '#888'}}>
              No messages yet. Start the conversation!
            </Text>
          ) : (
            data.map((msg, index) => {
              const isImage = msg?.mime?.startsWith('image/');
              const isPDF = msg?.mime === 'application/pdf';

              return (
                <View key={msg.id || index} style={styles.messageContainer}>
                  <Pressable
                    onLongPress={() => handleLongPress(msg)}
                    style={({pressed}) => [
                      styles.messageBubble,
                      {opacity: pressed ? 0.8 : 1}, // Change opacity on press
                    ]}>
                    <Text style={styles.messageUser}>{msg.user}</Text>
                    {(msg.filepath || msg.fileUri) && isImage && (
                      <View style={styles.imageContainer}>
                        {progress < 100 && (
                          <Text style={styles.progressText}>
                            Loading {progress}%
                          </Text>
                        )}

                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('WebViewShow', {
                              url: `${API_URL}/${msg.filepath}`,
                            });
                          }}>
                          <FastImage
                            style={styles.imagePreview}
                            source={{
                              uri: msg.fileUri || `${API_URL}/${msg.filepath}`,
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            onProgress={e => {
                              const percent = Math.round(
                                (e.nativeEvent.loaded / e.nativeEvent.total) *
                                  100,
                              );
                              setProgress(percent);
                            }}
                            onLoadEnd={() => setProgress(100)}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                    {(msg.filepath || msg.fileUri) && isPDF && (
                      <TouchableOpacity
                        style={styles.pdfContainer}
                        onPress={() => {
                          navigation.navigate('WebViewShow', {
                            url: `${API_URL}/${msg.filepath}`,
                          });
                        }}>
                        <Icon
                          name="file-pdf"
                          size={25}
                          color="white"
                          style={{
                            backgroundColor: '#e63946',
                            borderRadius: 10,
                            padding: 10,
                          }}
                        />
                        <View style={{flex: 1, marginLeft: 10}}>
                          <Text style={styles.pdfFileName}>
                            {msg.text || 'Document.pdf'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}

                    {!(msg.filepath || msg.fileUri) && (
                      <Text style={styles.messageText}>{msg.text}</Text>
                    )}

                    <View style={styles.actionBtn}>
                      <TouchableOpacity
                        style={styles.likebut}
                        onPress={() => addLike(msg.createdAt)}>
                        <AntDesign name="like1" size={18} color="white" />
                        <Text style={styles.likeText}>{msg.likec || 0}</Text>
                      </TouchableOpacity>
                      <View>
                        <RNText style={styles.timestampText}>
                          {formatDateTime(msg.createdAt || msg.timestamp)}
                        </RNText>
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            })
          )}
        </ScrollView>

        {!(userdata?.roll === 'Student' || userdata?.roll === 'Normal') && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              placeholder="PDF Img Text Messages Only"
              value={message}
              onChangeText={setMessage}
              placeholderTextColor={'#BABABA'}
              multiline
              textColor="black"
              cursorColor="black"
              numberOfLines={4} // 👈 helps estimate height
              scrollEnabled={true}
              right={
                <TextInput.Icon
                  icon="send"
                  onPress={sendMessage}
                  color={'white'}
                  style={{backgroundColor: '#3a86ff', paddingLeft: 5}}
                />
              }
              left={<TextInput.Icon icon="attachment" onPress={pickDocument} />}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  messageBubble: {
    backgroundColor: '#317CEE',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    maxWidth: '85%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageUser: {
    color: '#FFBA00',
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 5,
  },
  timestampText: {
    color: '#d0d0d0',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderRadius: 15,
  },
  pdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pdfFileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: 8,
    marginHorizontal: -10,
  },
  imagePreview: {
    width: 250,
    height: 270,
    borderRadius: 18,
    marginBottom: 5,
  },
  imageFileName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  likeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    marginRight: 10,
  },
  actionBtn: {
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  likebut: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  uploadBox: {
    marginHorizontal: 16,
    marginBottom: 10,
  },

  uploadText: {
    fontSize: 14,
    color: '#177245',
    marginBottom: 4,
  },

  progressBar: {
    height: 6,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: 6,
    backgroundColor: '#6200ee',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
    zIndex: 1,
  },
});
