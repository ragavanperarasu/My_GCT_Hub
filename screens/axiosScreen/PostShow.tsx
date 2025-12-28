import React, {useEffect, useState, useLayoutEffect} from 'react';
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
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';

const GETTING_POST = "/getpost"

type PostShowScreenProp = StackNavigationProp<RootStackParamList, "PostShow">;



export default function PostShow({route}:{route: PostShowScreenProp}) {
  const navigation = useNavigation<PostShowScreenProp>();

  const {reqType, userid, subid, access} = route.params;

  console.log(route.params)

  const [load, setLoad] = useState(false);

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: reqType,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
          color: '#1560BD',
          fontFamily: 'Momo Trust Display',
        },
        headerTintColor: '#1560BD',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('NewPost',{reqType: reqType, userid:userid, subid: subid, subname: '', pdfuri: ''})}
            
            style={{marginRight: 5}}>
            <Feather name="plus" size={24} color="#1560BD" />
          </TouchableOpacity>
        ),
      });
    }, [navigation, reqType]);

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
