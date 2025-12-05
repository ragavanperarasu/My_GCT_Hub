import React, { useMemo } from 'react';
import { View, Text, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';


const Loading = React.memo(() => {
  const animationSource = useMemo(
    () => require('../../assets/animations/loading.json'),
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
        <StatusBar
                backgroundColor="#ffffffff" // for Android
                barStyle="dark-content" // for iOS and Android
              />
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={{
          width: '100%',
          height: 250,
        }}
      />
    </View>
  );
});


export default Loading;
