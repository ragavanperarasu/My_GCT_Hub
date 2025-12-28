import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Nodejs from '../../assets/images/accoun.svg';
import {Avatar, Card, Text, Button, Appbar, Snackbar, Badge} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';
import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import Loading from '../components/Loading';
import axios from 'axios';

const GETTING_POST = "/getpost"

type SubShowScreenProp = StackNavigationProp<RootStackParamList, "StuNoteShow">;



export default function StuNoteShow({route}:{route: SubShowScreenProp}) {
  const navigation = useNavigation<SubShowScreenProp>();
  const {reqType, userid, subid, access} = route.params;
  
  const [load, setLoad] = useState(false);

  if (load) {
    return (
      <Loading/>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
    
    </View>
  );
}

const styles = StyleSheet.create({
  
});
