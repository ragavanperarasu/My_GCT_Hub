import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from 'react-native-cache';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';


const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

export default function Dir() {
  const navigation = useNavigation();

  useEffect(() => {
    const loadCache = async () => {
      try {
        const cacheUserData = await cache.get('userdata');
        if (cacheUserData) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'PageOne' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserLogin' }],
          });
        }
      } catch (error) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserLogin' }],
        });
      }
    };

    loadCache();
  }, [navigation]);

  return <View/>;
}
