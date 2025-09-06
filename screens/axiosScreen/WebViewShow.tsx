import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const FileOpenScreen = ({ route }) => {
  const { url } = route.params;
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(true);

  const downloadAndOpenFile = async () => {
    try {
      const fileName = url.split('/').pop();
      const dirs = RNFetchBlob.fs.dirs;
      const path = `${dirs.DocumentDir}/${fileName}`;

      // Check if file exists
      const exists = await RNFetchBlob.fs.exists(path);
      if (!exists) {
        setDownloading(true);

        await RNFetchBlob.config({
          path,
          fileCache: true,
        })
          .fetch('GET', url)
          .progress((received, total) => {
            setProgress(received / total);
          });
      }

      setDownloading(false);

      // Open file with default app
      await FileViewer.open(path, { showOpenWithDialog: false });

      // Go back automatically
      navigation.goBack();
    } catch (error) {
      console.error('Error opening file:', error);
      setDownloading(false);
      Alert.alert('Error', error.message || 'No app found to open this file');
      navigation.goBack();
    }
  };

  useEffect(() => {
    downloadAndOpenFile();
  }, [url]);

  return (
    <View style={styles.loader}>
      {downloading ? (
        <>
          <Text style={styles.percentageText}>{Math.floor(progress * 100)}%</Text>
          <ProgressBar progress={progress} color="#009E60" style={styles.progressBar} />
        </>
      ) : (
        <ActivityIndicator size="large" color="#009E60" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  percentageText: { fontSize: 24, fontWeight: '700', marginBottom: 12, color: '#009E60' },
  progressBar: { width: 200, height: 10, backgroundColor: '#C0C0C0', borderRadius: 10 },
});

export default FileOpenScreen;
