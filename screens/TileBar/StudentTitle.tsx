import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Image, ScrollView, Animated } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from 'react-native-cache';
import HeaderLogo from '../components/HeaderLogo';
import styles from '../components/Style1';
import * as Animatable from 'react-native-animatable';
import Feather from "react-native-vector-icons/Feather";


const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const cache = new Cache({
  namespace: 'mygct',
  policy: { maxEntries: 50000, stdTTL: 0 },
  backend: AsyncStorage,
});

function StudentTitle() {
  const [userdata, setUserdata] = React.useState({});
  const refRBSheet = useRef();
const bgAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const d = async () => {
      const cacheUserData = await cache.get('userdata');
      setUserdata(cacheUserData);
    };
    d();
  }, []);

    useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 2,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

const backgroundColor = bgAnim.interpolate({
  inputRange: [0, 1, 2],
  outputRange: [
    '#007FFF', // Blue
    '#00A86B', // Green
    '#FF6F61', // Coral
  ],
});


  return (
    <View style={styles.whiteBg}>

      {/* TOP BAR */}
      <Animatable.View
        animation={'zoomIn'}
        duration={800}
        delay={200}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          marginHorizontal: 3,
          marginTop: 15,
          padding: 10,
          borderRadius: 10,
        }}>

        {/* CLICK TO OPEN SHEET */}
        <TouchableOpacity
          style={{
        marginVertical: 10,
        height: 76,
        width: 76,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
  
      }}
          onPress={() => refRBSheet.current.open()}
        >
          <Image source={{ uri: userdata.profile }} style={styles.avatar} />
        </TouchableOpacity>

        <Text style={{
          color: 'black',
          marginLeft: 15,
          fontSize: 19,
          fontFamily: 'Philosopher',
        }}>
          {userdata.name}
        </Text>
      </Animatable.View>

      {/* ---------- BOTTOM SHEET ---------- */}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={440}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          <HeaderLogo />

          <Text style={{ fontSize: 22, color: '#1560BD' ,fontFamily: 'Momo Trust Display', marginVertical: 15 }}>
            Welcome to My GCT Hub!
          </Text>
          <Image
            source={{ uri: userdata.profile }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginBottom: 15,
            }}
          />

          <Text style={{ fontSize: 20, color: 'black',fontFamily: 'Momo Trust Display' }}>
            {userdata.name}
          </Text>

          <Text style={{ fontSize: 16, marginTop: 5, color: 'gray',fontFamily: 'Philosopher' }}>
            {userdata.email}
          </Text>


<TouchableOpacity
  onPress={() => console.log("Pressed")}
  activeOpacity={0.8}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1560BD',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop:10

  }}
>
  <Feather
    name="settings"
    size={18}
    color="#FFFFFF"
    style={{ marginRight: 6 }}
  />
  <Text
    style={{
      color: '#FFFFFF',
      fontSize: 15,
      fontFamily: 'Philosopher',
      fontWeight: '600',
    }}
  >
    Account Profile Settings
  </Text>
</TouchableOpacity>

        </View></ScrollView>
      </RBSheet>

    </View>
  );
}

export default React.memo(StudentTitle);
