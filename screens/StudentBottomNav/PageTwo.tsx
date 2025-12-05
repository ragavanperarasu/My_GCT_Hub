import * as React from 'react';
import { View,ScrollView, StyleSheet, Image, TouchableOpacity, ToastAndroid, Vibration } from 'react-native';
import { Avatar, Card, Button, Icon,Text, Appbar, Searchbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../RootParam';
import Hostel from '../../assets/images/club.svg';
import ImageSlider from './ImageSlider';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';







export default function PageTwo() {
  const navigation = useNavigation();


  return (
    <View style={{backgroundColor:"#FEFEFA", height:"100%"}}>
                <Appbar.Header
                  style={{
                    backgroundColor: '#ffffffff',
                    elevation:20,
                    borderBottomLeftRadius:40,
                    borderBottomRightRadius:40,
                  }}>
                  <Appbar.Content
                    title="Club Events"
                    color="#1CA9C9"
                    titleStyle={{fontWeight: '700', fontSize:20, textAlign:"center"}}
                  />
                </Appbar.Header>

      <ScrollView >
     
                  <View style={styles.subjectCard}>
                    <Text
                      style={styles.subjectText}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                                                          <Icon
                            source="newspaper-variant-outline"
                            color='#00A550'
                            size={20}
                          />{" "}New Event Post
                    </Text>
        
                    <TouchableOpacity
                      style={styles.createButton}
                      onPress={()=>{
                        ToastAndroid.show('This feature in development stage', ToastAndroid.LONG);
                        Vibration.vibrate(100)
                      }}
                      >
                      <Icon1
                        name="plus"
                        size={18}
                        color="#fff"
                        style={styles.createIcon}
                      />
                      <Text style={styles.createText}>Create</Text>
                    </TouchableOpacity>
                  </View>
        

            <View style={{marginTop:10,}}>

            <ImageSlider/>

            </View>

             <View style={styles.subjectCard}>
                    <Text
                      style={styles.subjectText}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                                                          <Icon
                            source="message-processing-outline"
                            color='#00A550'
                            size={20}
                          />{" "}Messages
                    </Text>
                  </View>

           
    
    </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
 section: {
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 15,
    boxShadow: '#0000003D 0 3 8',
    marginHorizontal: 5,
  },
  title: {
    color: '#007FFF',
    fontSize: 20,
    fontFamily: 'sans-serif-condensed',
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconCircle: {
    marginVertical: 20,
    marginLeft: 10,
    height: 65,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '#0000003D 0 3 8',
  },

  outerContainer: {
    marginHorizontal: 8,
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
    color: '#00A86B',
    flex: 1,
    marginRight: 10,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  createIcon: {
    marginRight: 5,
  },
  createText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  posterName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  posterMail: {
    fontSize: 14,
    color: 'gray',
  },
  postDate: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 10,
  },
  postName: {
    fontSize: 15,
    color: '#555',
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionBtn: {
    alignItems: 'center',
  },
  downloadText: {
    color: '#007bff',
    fontSize: 12,
  },
  viewText: {
    color: '#28a745',
    fontSize: 12,
  },
  likeText: {
    color: '#dc3545',
    fontSize: 12,
  },
  commentText: {
    color: '#6c757d',
    fontSize: 12,
  },
    input: {
    marginVertical:15,
    backgroundColor: 'white',
    color: 'black',
    height: 45,
  },
});