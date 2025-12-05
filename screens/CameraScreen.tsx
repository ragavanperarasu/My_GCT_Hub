import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';

type CameraScreenProp = StackNavigationProp<RootStackParamList, 'CameraScreen'>;


import { jsPDF } from "jspdf";
import RNFS from "react-native-fs"; 


const { width, height } = Dimensions.get("window");
const MAX_THUMBS = 1;



export default function CameraScreen({route}: {route: CameraScreenProp}) {
  const navigation = useNavigation<CameraScreenProp>();
  const {subname, pdfuri} = route.params;

  const camera = useRef(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  const [images, setImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [focusPoint, setFocusPoint] = useState(null);

  const [flash, setFlash] = useState("off");
  const [showGrid, setShowGrid] = useState(false);
  const [isFlashing, setIsFlashing] = useState(true);
  const [cameraState, setCameraState] = useState(true);
  
  // PDF State
  const [isCreatingPdf, setIsCreatingPdf] = useState(false);

  const flatListRef = React.useRef(null);

  useEffect(() => {
    if (previewVisible) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: previewIndex, animated: false });
      }, 50);
    }
  }, [previewVisible]);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, []);

  const takePhoto = async () => {
    if (!camera.current) return;
    try {
      setIsFlashing(false);
      const photo = await camera.current.takePhoto({
        flash,
        enableShutterSound: false,
      });
      const img = {
        uri: "file://" + photo.path,
        path: photo.path, // Store raw path
        id: Date.now(),
      };
      
      setImages((prev) => [...prev, img]);
      setIsFlashing(true);
    } catch (e) {
      console.log(e);
      setIsFlashing(true);
    }
  };

  const deleteImage = (i) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setImages((prev) => prev.filter((_, index) => index !== i)),
      },
    ]);
  };

  const createPDF = async () => {
    if (images.length === 0) return;
    
    setIsCreatingPdf(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const imageItem = images[i];
        const validPath = imageItem.path || imageItem.uri.replace('file://', '');
        const base64Data = await RNFS.readFile(validPath, 'base64');
        doc.addImage(base64Data, 'JPEG', 0, 0, pageWidth, pageHeight);
        if (i < images.length - 1) {
          doc.addPage();
        }
      }
      const timestamp = Date.now();
      const filePath = `${RNFS.DocumentDirectoryPath}/${subname}_${timestamp}.pdf`;
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      await RNFS.writeFile(filePath, pdfBase64, 'base64');

      const fileData = { uri: `file://${filePath}`, name: `${subname}_${timestamp}.pdf`, type: 'application/pdf' };

      navigation.replace('UploadSemqus', {subname: subname, pdfuri: fileData});


    } catch (error) {
      console.error("PDF Generation Error:", error);
      Alert.alert("Error", "Failed to generate PDF");
    } finally {
      setIsCreatingPdf(false);
    }
  };
  // ---------------------------------------------

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>No Camera Found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* <StatusBar backgroundColor="#ffffffff" barStyle="light-content" /> */}

<View style={styles.topControls}>
  <TouchableOpacity
    onPress={() => setShowGrid(prev => !prev)}
    style={[
      styles.gridBtn,
      { backgroundColor: showGrid ? '#3EB489' : 'rgba(255, 255, 255, 0.3)' }
    ]}
  >
    <MaterialIcons name="grid-on" size={25} color="#fff" />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => flash === 'on' ? setFlash('off') : setFlash('on')} style={styles.flashBtn}>
    {flash === "on" ? 
      <MaterialIcons name="flash-on" color="#ffffffff" size={30}/> : 
      <MaterialIcons name="flash-off" color="#ffffffff" size={30}/>
    }
  </TouchableOpacity>
</View>

      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={(e) => {
          const tapX = e.nativeEvent.locationX;
          const tapY = e.nativeEvent.locationY;
          const x = tapX / width;
          const y = tapY / height;
          camera.current?.focus({ x, y });
          setFocusPoint({ x: tapX, y: tapY });
          setTimeout(() => setFocusPoint(null), 600);
        }}
      >
        <Camera
          ref={camera}
          style={{ flex: 1 }}
          device={device}
          isActive={cameraState}
          photo={true}
        />
        {showGrid && (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={styles.horizontalLine} />
      <View style={[styles.horizontalLine, { top: '66.6%' }]} />
      <View style={styles.verticalLine} />
      <View style={[styles.verticalLine, { left: '66.6%' }]} />
    </View>
  )}
        {focusPoint && (
          <View
            style={{
              position: "absolute",
              left: focusPoint.x - 40,
              top: focusPoint.y - 40,
              width: 60,
              height: 60,
              borderRadius: 40,
              borderWidth: 2,
              borderColor: "#FFD700",
              backgroundColor: "transparent",
            }}
          />
        )}
      </TouchableOpacity>

      {/* CAPTURE BUTTON */}
      {isFlashing && (
        <View style={styles.bottomControls}>
        <TouchableOpacity onPress={() => takePhoto()} style={styles.captureBtn}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
        </View>
      )}
      

      {/* THUMBNAILS */}
      <View style={styles.thumbColumn}>
        {images.slice(-MAX_THUMBS).map((img) => {
          const originalIndex = images.indexOf(img); 
          const badgeNumber = originalIndex + 1;  
          return (
            <TouchableOpacity
              key={img.id}
              onPress={() => {
                setPreviewIndex(originalIndex);
                setPreviewVisible(true);
                setCameraState(false);
              }}
            >
              <View style={styles.thumbWrapper}>
                <Image source={{ uri: img.uri }} style={styles.thumb} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeNumber}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>


      {/* FULLSCREEN PREVIEW & PDF BUTTON */}
      <Modal visible={previewVisible} transparent={true} animationType="fade">
        <View style={styles.previewContainer}>
          
          {/* CREATE PDF BUTTON */}
          <TouchableOpacity 
            onPress={createPDF} 
            disabled={isCreatingPdf}
            style={{
              position: 'absolute', 
              top: 20, 
              right: 10, 
              zIndex: 10, 
              backgroundColor:'#1560BD', 
              padding: 10, 
              borderRadius: 6
            }}
          >
            {isCreatingPdf ? (
              <ActivityIndicator color="#fff" size={20}/>
            ) : (
              <Text style={styles.pText}>Create PDF</Text>
            )}
          </TouchableOpacity>

          <FlatList
            data={images}
            horizontal
            pagingEnabled
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={previewIndex}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / screenWidth
              );
              setPreviewIndex(newIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.page}>
                 <ScrollView maximumZoomScale={4} minimumZoomScale={1} contentContainerStyle={{ flexGrow: 1 }} >
                  <Image source={{ uri: item.uri }} style={styles.previewImage} resizeMode="contain" />
                </ScrollView>
              </View>
            )}
          />

          <View style={styles.previewTop}>
            <TouchableOpacity onPress={() => {setPreviewVisible(false); setCameraState(true);}} style={styles.pBtn}>
              <Feather name="arrow-left" color="#ffffffff" size={25} />
            </TouchableOpacity>

            <View style={styles.imageNumberBadge}>
              <Text style={styles.imageNumberText}>
                {previewIndex + 1} / {images.length}
              </Text>
            </View>

            <TouchableOpacity onPress={() => deleteImage(previewIndex)} style={styles.pBtn}>
              <Feather name="trash" color="red" size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  captureInner: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 30,
  },
  thumbColumn: {
    position: "absolute",
    right: 10,
    bottom: 20,
  },
  thumbFlash: {
    position: "absolute",
    left: 50,
    bottom: 50,
  },
  thumbWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  thumb: {
    width: 70,
    height: 90,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#1560BD",
    width: 19,
    height: 19,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontFamily:'Philosopher'
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  page: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: screenWidth,
    height: screenHeight,
  },
  previewTop: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  pBtn: {
    // padding: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    // borderRadius: 6,
  },
  pText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: 'Philosopher'
  },
  imageNumberBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
  },
  imageNumberText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: 'Philosopher'
  },

  topControls: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  gridBtn: {
    padding: 8,
    borderRadius: 8,
  },

  flashBtn: {
    padding: 8,
    // Using a translucent background helps the icon stand out
    backgroundColor: 'rgba(0,0,0,0.4)', 
    borderRadius: 8,
  },

  // Grid Line Styles
  horizontalLine: {
    position: 'absolute',
    top: '33.3%', // 1/3 down
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

  verticalLine: {
    position: 'absolute',
    left: '33.3%', // 1/3 across
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },

});