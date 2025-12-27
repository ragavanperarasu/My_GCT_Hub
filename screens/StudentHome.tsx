import React from 'react';
import {View, StyleSheet} from 'react-native';
import BottomNav from './StudentBottomNav/BottomNav'
import { SafeAreaView } from 'react-native-safe-area-context';



export default function StudentHome() {

  return (
    
    <SafeAreaView style={styles.container}>
        <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  bottomBar: {
    backgroundColor: '#6200ee',
  },
});

