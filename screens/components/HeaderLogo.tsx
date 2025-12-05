import React, { memo } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

function HeaderLogo() {
  return (
    <View style={styles.view1}>
      <Image
        source={require('../../assets/images/mygcti.png')}
        style={styles.img1}
      />
      <Text style={styles.text7}>My GCT Hub</Text>
    </View>
  );
}

export default memo(HeaderLogo);

const styles = StyleSheet.create({
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },
  text7: {
    fontSize: 16,
    color: '#1560BD',
    fontFamily: 'Momo Trust Display',
  },
  img1: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
