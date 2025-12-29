import React, { useMemo, useEffect, useState, useRef } from 'react';
import { View, StatusBar, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from 'react-native-cache';

const cache = new Cache({
  namespace: 'mygct',
  policy: { maxEntries: 50000, stdTTL: 0 },
  backend: AsyncStorage,
});

const COLORS = ['#8D029B', '#00A86B', '#D71868', '#EC5800', '#79443B'];

// Destructure the "progress" prop sent from the parent
const Uploading = React.memo(({ progress }) => {
  const [userData, setUserData] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const textRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const fetchUser = async () => {
      const cacheUserData = await cache.get('userdata');
      if (isMounted.current) setUserData(cacheUserData);
    };
    fetchUser();
    return () => { isMounted.current = false; };
  }, []);

  const messageChunks = useMemo(() => {
    // Fallback name if cache is still loading
    const name = userData?.name || 'Friend';
    const messages = [
      `Hey ${name}, you're Doing a great Job ✨! This File is very useful 💡 for other students to Study 📚`,
      `Excellent work ${name} 🏆! Your contribution helps build a better learning community 🤝`,
      `Thank you ${name} 🙏 Sharing these resources makes a huge difference 🚀 for everyone`,
      `Great initiative ${name} 🎯! This material will be a valuable asset 💎 for exam prep 📝`,
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const words = randomMsg.split(' ');
    const result = [];
    for (let i = 0; i < words.length; i += 3) {
      result.push(words.slice(i, i + 3).join(' '));
    }
    return result;
  }, [userData]);

  useEffect(() => {
    if (messageChunks.length === 0) return;

    const interval = setInterval(() => {
      if (textRef.current && isMounted.current) {
        textRef.current.fadeOut(500).then(() => {
          if (!isMounted.current) return;
          setCurrentChunkIndex((prev) => (prev + 1) % messageChunks.length);
          setCurrentColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
          textRef.current?.fadeIn(500);
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [messageChunks]);

  const animationSource = useMemo(() => require('../../assets/animations/ucloud.json'), []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      
      <LottieView
        source={animationSource}
        autoPlay loop
        style={styles.lottie}
      />

      {/* Progress Percentage Text */}
      <Animatable.View animation="pulse" iterationCount="infinite" style={styles.progressContainer}>
         <Text style={styles.progressText}>{progress}</Text>
      </Animatable.View>

      <View style={styles.textContainer}>
        <Animatable.Text
          ref={textRef}
          useNativeDriver
          style={[styles.greetingText, { color: currentColor }]}
        >
          {messageChunks[currentChunkIndex]}
        </Animatable.Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  lottie: {
    width: '100%',
    height: 250,
  },
  progressContainer: {
    marginVertical: 10,
    backgroundColor: '#f0f4f7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 18,
    color: '#1560BD',
    fontFamily: 'Momo Trust Display',
  },
  textContainer: {
    marginTop: 20,
    height: 90, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontFamily: 'Momo Trust Display',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 28,
  },
});

export default Uploading;
