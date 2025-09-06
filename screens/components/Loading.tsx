import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';


const Loading = React.memo(({ loadtext }) => {
  const animationSource = useMemo(
    () => require('../../assets/animations/robo.json'),
    []
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={{
          width: '100%',
          height: 250,
        }}
      />
      <Text
        style={{
          color: '#007FFF',
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 23,
        }}>
        {loadtext}
      </Text>
    </View>
  );
});


export default Loading;
