import * as React from 'react';
import { View,ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Avatar, Card, Button, Icon,Text, Appbar, Searchbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../RootParam';
import Hostel from '../../assets/images/club.svg';
import ImageSlider from './ImageSlider';
import Food from '../../assets/images/food.svg';

import Insta from '../../assets/images/insta.svg';
import Linkedin from '../../assets/images/linkedin.svg';
import Youtube from '../../assets/images/youtube.svg';
import Web from '../../assets/images/web.svg';
import Search from '../Search';


type HomeScreenProp = StackNavigationProp<RootStackParamList, "Home">;


export default function PageTwo() {
  const navigation = useNavigation<HomeScreenProp>();


  return (
    <View style={{backgroundColor:"#FEFEFA", height:"100%"}}>

      <ScrollView >
        

            <View>

            <ImageSlider/>

            </View>

            {/* <Text style={{color:"black", marginLeft:10, fontFamily:"sans-serif-condensed", fontSize:18, fontWeight:"700", marginTop:20}}>Social Media Account</Text>

            <View style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly"}}>
            <View 
                style={{ 
                  marginVertical:20,
                  marginLeft: 10,
                  height:75, width:75, 
                  borderRadius:50,
                  boxShadow:"#0000003D 0 3 8",
                  alignItems:"center",
                  justifyContent:"center"
                }}
              >
            <Insta width={50} height={50}/>
              </View>
              <View 
                style={{ 
                  marginVertical:20,
                  marginLeft: 10,
                  height:75, width:75, 
                  borderRadius:50,
                  boxShadow:"#0000003D 0 3 8",
                  alignItems:"center",
                  justifyContent:"center"
                }}
              >
            <Linkedin width={70} height={70}/>
              </View>
              <View 
                style={{ 
                  marginVertical:20,
                  marginLeft: 10,
                  height:75, width:75, 
                  borderRadius:50,
                  boxShadow:"#0000003D 0 3 8",
                  alignItems:"center",
                  justifyContent:"center"
                }}
              >
            <Youtube width={50} height={50}/>
              </View>
              
              <View 
                style={{ 
                  marginVertical:20,
                  marginLeft: 10,
                  height:75, width:75, 
                  borderRadius:50,
                  boxShadow:"#0000003D 0 3 8",
                  alignItems:"center",
                  justifyContent:"center"
                }}
              >
            <Web width={60} height={60}/>
              </View>

              </View>


            <Text style={{color:"black", marginLeft:10, fontFamily:"sans-serif-condensed", fontSize:18, fontWeight:"700", marginTop:10}}>Club Description</Text>
                      
                       */}

{/* 
      <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/ncc.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={[styles.title,{marginRight:50}]}>NCC</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/gct_ncc_?igsh=cjBxNGxoMHZqNGw0"})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card> */}

    {/* <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/tamil.png")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={[styles.title,{fontSize:20}]}>Tamil Mandram & Fine Arts</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/tmfa_gct?igsh=MTh6aHc3ZXg1Y2djcQ=="})}>
        <Avatar.Icon icon="instagram" size={40} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/fineartsgct?igsh=Y28xMDUxZ2g0N2Fy"})}>
        <Avatar.Icon icon="instagram" size={40} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

    <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/dance.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>Eliminators</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/eliminators_crew_gct?igsh=MTA1NDM1eTV4YmR4OA=="})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

    <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/sing.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>GCT MUFX</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/gctmufx?igsh=aTV3anAxbTVmdHFr"})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

      <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/gsarc.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>gSARC</Text>

      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/rotaract_gct?igsh=NWE3c2thY2R0bWty"})}>
        <Avatar.Icon icon="instagram" size={40} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.linkedin.com/groups/133636/"})}>
      <Avatar.Icon icon="linkedin" size={45} style={{backgroundColor:'#0e76a8'}}/>
      </TouchableOpacity>   
      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.gctalumni.org.in/"})}>
      <Avatar.Icon icon="web" size={45} style={{backgroundColor:'#16166B'}}/>
      </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card> */}



     
{/* 
    <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/ieee.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>IEEE</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/gct_ieee?igsh=ajI2cXM3NDFxdDh0"})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.linkedin.com/company/gct-ieee-student-branch"})}>
      <Avatar.Icon icon="linkedin" size={45} style={{backgroundColor:'#0e76a8'}}/>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.gctieee.org/"})}>
      <Avatar.Icon icon="web" size={45} style={{backgroundColor:'#16166B'}}/>
      </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

   
    <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/rotaract.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>Rotaract</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/rotaract_gct?igsh=NWE3c2thY2R0bWty"})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

    


   


   

    

<Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/ish.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>ISHRAE GCT</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/gct_ishrae?igsh=MTNvZ3Z3NDJkMjdkcQ=="})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.linkedin.com/in/gct-ishrae-student-chapter-a194ab285/"})}>
      <Avatar.Icon icon="linkedin" size={45} style={{backgroundColor:'#0e76a8'}}/>
      </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

   

<Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/sports.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>Sports</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/_gct_sports_?igsh=dDdjYWF3aWltZTV0"})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>


<Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/pd.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={[styles.title,{fontSize:20}]}>Product Design & Development</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/pddc_gct?igsh=MWd6eDFqeDk3aWIycA=="})}>
        <Avatar.Icon icon="instagram" size={40} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

   

<Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/ted.jpeg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>TedX</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/tedxgct19?igsh=cGhvNGc0ZHJ0OTd2"})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

   



   
<Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/code.jpg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>Coding</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/codingclub.gct?igsh=b3R1cmp4MHA2YjB3"})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://codingclubgct.in/"})}>
      <Avatar.Icon icon="web" size={45} style={{backgroundColor:'#16166B'}}/>
      </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>

   

<Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Card.Cover source={require("../../assets/images/nat.jpeg")} style={styles.image} />
        <View style={styles.overlay}>
        
          <View style={styles.cardi2}>
          <Text style={styles.title}>Green Club</Text>

          <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/greenclubgct?igsh=MWloemo0ZXczYXc4Yw=="})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>
      </View>
        </View>
      </View>
    </Card>





<Card  style={styles.cardm}>
    <Card.Title
    title="NDLI Club" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={styles.cardt} />
    <Card.Actions>
      <View style={styles.cardi2}>
      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/ndli_gct?igsh=MXF4NXlvc2x5dWFhaQ=="})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

      </View>
      </Card.Actions>
    </Card>

<Card  style={styles.cardm}>
    <Card.Title
    title="Centaurus Aerospace Society" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#6F2DA8'}]} />
    <Card.Actions>
      <View style={styles.cardi2}>
      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/cas_gct?igsh=MTJpMHF4bHlzdWtndw=="})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

      </View>
      </Card.Actions>
    </Card>

    <Card  style={styles.cardm}>
    <Card.Title
    title="LDS" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}
    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={styles.cardt} />
    <Card.Actions>
      <View style={styles.cardi2}>
      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/literary_and_debating_society?igsh=cGswbHZtMnBnaWRu"})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

      </View>
      </Card.Actions>
    </Card>

    <Card  style={styles.cardm}>
    <Card.Title
    title="Defence Aspirants Council" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={styles.cardt} />
    <Card.Actions>
      <View style={styles.cardi2}>
      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/defence_aspirants_gct?igsh=MXRmdnB2MmdjN2Ryeg=="})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

      </View>
      </Card.Actions>
    </Card>


    <Card  style={styles.cardm}>
    <Card.Title
    title="Y's Service Club of GCT Youth" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#6F2DA8'}]} />
    <Card.Actions>
      <View style={styles.cardi2}>
      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/ysyouth_gct?igsh=MWhxc2tvenI2bXNpbA=="})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.linkedin.com/in/ysc-of-gct-youth-tdc-tech-developers-community-8b6466288/"})}>
      <Avatar.Icon icon="linkedin" size={45} style={{backgroundColor:'#0e76a8'}}/>
      </TouchableOpacity>


      </View>
      </Card.Actions>
    </Card>

    <Card  style={styles.cardm}>
    <Card.Title
    title="SAE Club" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#6F2DA8'}]} />
    <Card.Actions>
      <View style={styles.cardi2}>
      <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.instagram.com/sae_gct?igsh=MWsxdmE4NXR5eHM3aA=="})}>
        <Avatar.Icon icon="instagram" size={45} style={{backgroundColor:'#E4405F'}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate("WebViewShow",{url:"https://www.linkedin.com/company/saegct/"})}>
      <Avatar.Icon icon="linkedin" size={45} style={{backgroundColor:'#0e76a8'}}/>
      </TouchableOpacity>

      </View>
      </Card.Actions>
    </Card>

<Card  style={styles.cardm}>
    <Card.Title
    title="MSME Facilitation Centre" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#01796F'}]} /></Card>



<Card  style={styles.cardm}>
    <Card.Title
    title="Youth Red Cross" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#6F2DA8'}]} /></Card>



<Card  style={styles.cardm}>
    <Card.Title
    title="Students Journalist Council" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={styles.cardt} /></Card>



<Card  style={styles.cardm}>
    <Card.Title
    title="National Service Scheme" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#01796F'}]} /></Card>

<Card  style={styles.cardm}>
    <Card.Title
    title="Administration Aspirants Council" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={styles.cardt} /></Card>

<Card  style={styles.cardm}>
    <Card.Title
    title="Yellow Cap Community" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}
    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#6F2DA8'}]} /></Card>





<Card  style={styles.cardm}>
    <Card.Title
    title="Red Ribbon Club" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#01796F'}]} /></Card>

<Card  style={styles.cardm}>
    <Card.Title
    title="Student Research Foundation" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={styles.cardt} /></Card>




<Card  style={styles.cardm}>
    <Card.Title
    title="BIS-Standards Clubs" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#6F2DA8'}]} /></Card>

<Card  style={styles.cardm}>
    <Card.Title
    title="Electoral Literacy Club" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={[styles.cardt,{backgroundColor:'#01796F'}]} /></Card>

<Card  style={styles.cardm}>
    <Card.Title
    title="Anti-Drugs Club" titleStyle={{fontSize:20, color:"white"}}
    titleNumberOfLines={3}

    left={(props) => <Avatar.Icon {...props} icon="creation" size={45} style={styles.cardi}/>}
    style={styles.cardt} /></Card>
   */}

    
    </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "gray", // Box shadow for Android
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Box shadow for Android
    boxShadow:"5 5 10 3 gray",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    paddingLeft: 20,
    paddingBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent overlay
  },
  title: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardm: {
    boxShadow:"5 5 10 3 gray", 
    marginHorizontal:10,
    marginVertical:15,
    borderRadius:20,
    backgroundColor:'#FEFEFA'
  },
  cardt: {
    backgroundColor:"#007BA7",
    borderRadius:20,
    padding:30,
  },
  cardi: {
    backgroundColor: '#DE3163',
  },
  cardi2: {
    width:"100%",
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-evenly"
  },
  cards:{
      color:"white",  
  },
  cardts:{
      fontSize:20,
      color:"white",
      fontWeight:700,
  }
});