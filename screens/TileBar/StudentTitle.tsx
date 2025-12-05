import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from 'react-native-cache';
import HeaderLogo from '../components/HeaderLogo';
import styles from '../components/Style1';
import * as Animatable from 'react-native-animatable';

const cache = new Cache({
  namespace: 'mygct',
  policy: { maxEntries: 50000, stdTTL: 0 },
  backend: AsyncStorage,
});

function StudentTitle() {
  const [userdata, setUserdata] = React.useState({});
  const refRBSheet = useRef();

  useEffect(() => {
    const d = async () => {
      const cacheUserData = await cache.get('userdata');
      setUserdata(cacheUserData);
    };
    d();
  }, []);

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
          style={styles.avaContainer}
          onPress={() => refRBSheet.current.open()}
        >
          <Image source={{ uri: userdata.photo }} style={styles.avatar} />
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
        height={400}
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
            source={{ uri: userdata.photo }}
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
        </View></ScrollView>
      </RBSheet>

    </View>
  );
}

export default React.memo(StudentTitle);
