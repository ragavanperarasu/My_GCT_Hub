import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  { id: '1', image: require('../../assets/images/ncc.jpg'), title: 'National Cadet Corps' },
  { id: '2', image: require('../../assets/images/tamil.png'), title: 'Tamil Mandram & Fine Arts' },
  { id: '3', image: require('../../assets/images/dance.jpg'), title: 'Eliminators' },
  { id: '4', image: require('../../assets/images/sing.jpg'), title: 'GCT MUFX' },
  { id: '5', image: require('../../assets/images/gsarc.jpg'), title: 'gSARC' },
  { id: '6', image: require('../../assets/images/ieee.jpg'), title: 'IEEE' },
  { id: '7', image: require('../../assets/images/rotaract.jpg'), title: 'Rotaract' },
  { id: '8', image: require('../../assets/images/ish.jpg'), title: 'ISHRAE GCT' },
  { id: '9', image: require('../../assets/images/sports.jpg'), title: 'Sports' },
  // { id: '10', image:require('../../assets/images/pd.jpg'), title: 'Product Design & Development' },
  { id: '11', image: require('../../assets/images/ted.jpeg'), title: 'TedX' },
  //{ id: '12', image:require('../../assets/images/code.jpg'), title: 'Coding' },
  { id: '13', image: require('../../assets/images/nat.jpeg'), title: 'Green Club' },
];



  

const SmoothSlider = () => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll function
  const autoScroll = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= images.length) {
      nextIndex = 0;
    }
    setCurrentIndex(nextIndex);
    scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
  };

  useEffect(() => {
    // Setup auto scroll interval
    const interval = setInterval(autoScroll, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // When user scroll manually update currentIndex
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16} // to get smooth scroll events
        scrollEnabled={true} // enable manual scroll
      >
       {images.map((item) => (
  <View key={item.id} style={styles.slide}>
    <View style={styles.imageWrapper}> {/* <-- New wrapper */}
      <ImageBackground
        source={item.image}
        style={styles.image}
        imageStyle={{ borderRadius: 12 }} // <-- Properly rounds image inside
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        <View style={styles.dotInsideImage}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? '#3a86ff' : '#fff',
                  opacity: i === currentIndex ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>
      </ImageBackground>
    </View>
  </View>
))}

      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display:'flex',
    justifyContent:'center',
    alignItems:"center",
    width:'100%'
  },


  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: 35,
    zIndex: 2,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dotInsideImage: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

slide: {
  width: width,
  alignItems: 'center', // centers content horizontally
  justifyContent: 'center', // centers content vertically if needed
},

imageWrapper: {
  width: '96%', // smaller than full width for padding effect
  height: 200,
  borderRadius: 12,
  overflow: 'hidden',
  alignItems: 'center', // optional, keeps image centered inside
  justifyContent: 'center',
},

image: {
  width: '100%',
  height: '100%',
  justifyContent: 'flex-end',
},


});

export default SmoothSlider;
