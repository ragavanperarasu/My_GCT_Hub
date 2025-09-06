import React from 'react';
import {View, StyleSheet} from 'react-native';
import BottomNav from './StudentBottomNav/BottomNav'



export default function StudentHome() {

  return (
    <View style={styles.container}>
        <BottomNav />
    </View>
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

