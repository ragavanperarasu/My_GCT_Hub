import React, { useState } from 'react';
import { View} from 'react-native';
import { WebView } from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import Loading from '../components/Loading';

const WebViewSave = ({ route }) => {
  const navigation = useNavigation();
  const { url } = route.params;
  const [load, setLoad] = useState(true);
  const [loadtext, setLoadtext] = useState('Download Will Start...');

  setTimeout(() => {
      setLoad(false);
      navigation.goBack();
    }, 3000);

  return (
    <View style={{ flex: 1 }}>
      <WebView
  source={{ uri: url }}
  style={{ flex: 1 }}
  originWhitelist={['*']}
  useWebKit={true}
  onLoadEnd={() => {
    setLoad(true);
    
  }}
  startInLoadingState={true}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  allowFileAccess={true}
  allowUniversalAccessFromFileURLs={true}
/>

      {load && (
        <Loading loadtext={loadtext} />
      )}
    </View>
  );
};



export default WebViewSave;

