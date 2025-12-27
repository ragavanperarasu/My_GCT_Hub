import React,{useEffect, useState} from 'react';
import {Alert, BackHandler, Platform, TouchableOpacity} from 'react-native';

import {
  Dialog,
  Portal,
  Button,
  Text,
  PaperProvider,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {RootStackParamList} from './screens/RootParam';

import PageOne from './screens/StudentBottomNav/PageOne';
import StudentHome from './screens/StudentHome';
import Dir from './screens/Dir';
import SubShow from './screens/axiosScreen/SubShow';
import About from './screens/About';
import WebViewShow from './screens/axiosScreen/WebViewShow';
import WebViewSave from './screens/axiosScreen/WebViewSave';
import UtSubShow from './screens/axiosScreen/UtSubShow';
import UttSubShow from './screens/axiosScreen/UttSubShow';
import StuNoteShow from './screens/axiosScreen/StuNoteShow';
import TimetableShow from './screens/axiosScreen/TimetableShow';
import SyllShow from './screens/axiosScreen/SyllShow';
import Search from './screens/Search';
import UserLogin from './screens/UserLogin';
import CreateNewAccount from './screens/CreateNewAccount';

import UploadSemqus from './screens/axiosScreen/UploadSemqus';
import UploadUtoqus from './screens/axiosScreen/UploadUtoqus';
import UploadUttqus from './screens/axiosScreen/UploadUttqus';
import UploadBooks from './screens/axiosScreen/UploadBooks';
import UploadNotes from './screens/axiosScreen/UploadNotes';
import UploadSyll from './screens/axiosScreen/UploadSyll';
import UploadTtable from './screens/axiosScreen/UploadTtable';

import BooksShow from './screens/axiosScreen/BooksShow';
import Showcomments from './screens/axiosScreen/Showcomments';


import Att from './screens/StudentBottomNav/Att';
import Attcreate from './screens/StudentBottomNav/Attcreate';
import Insertatt from './screens/StudentBottomNav/Insertatt';
import Attview from './screens/StudentBottomNav/Attview';

import CameraScreen from './screens/CameraScreen';

import notifee, { AuthorizationStatus, AndroidImportance } from '@notifee/react-native';
import Immersive from 'react-native-immersive';
import Pinenter from './screens/StudentBottomNav/Pinenter';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from "react-native-vector-icons/Feather";




const Stack = createNativeStackNavigator<RootStackParamList>();



const isAndroid15 = Platform.OS === 'android' && Platform.Version >= 35;

function App() {
const [exitVisible, setExitVisible] = useState(false);


async function setupNotifications() {

  

  let settings = await notifee.getNotificationSettings();

  if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
    await notifee.requestPermission();
    settings = await notifee.getNotificationSettings();

    if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
      setExitVisible(true)
      return; 
    }
  }

}

useEffect(() => {
  setupNotifications();
}, []);


//  useEffect(() => {
//     if (isAndroid15) {
//       Immersive.on();
//     }

//     return () => {
//       if (isAndroid15) {
//          Immersive.off();
//       }
//     };
//   }, []);

  return (

<PaperProvider>
  <Portal>
          <Dialog
            visible={exitVisible}
           
            style={{ backgroundColor: '#F7F7F7' }}
          >
            <Dialog.Title style={{ color: '#6F2DA8', textAlign:"center", fontWeight:700}}>
            
                Notification Permission
            </Dialog.Title>
           
            <Dialog.Content>
              <Text
                variant="bodyMedium"
                style={{ color: 'black', fontSize: 17, marginTop:10}}
              >
                Kindly Enable Notifications to Receive Important News, Updates, and Posts from the MyGCT App.
              </Text>
            </Dialog.Content>
  
            <Dialog.Actions>
              <Button
                textColor="#6F2DA8"
                onPress={() => {setExitVisible(false);notifee.openNotificationSettings()}}
              >
                Go to Settings
              </Button>
              <Button
                textColor="#6F2DA8"
                onPress={() => {BackHandler.exitApp();}}
              >
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dir" screenOptions={{animation:"slide_from_right"}}>

      <Stack.Screen name="Dir" component={Dir} options={{ headerShown: false }}/>
      <Stack.Screen name="StudentHome" component={StudentHome} options={{ headerShown: false }}/>
      <Stack.Screen name="SubShow" component={SubShow}  options={({ navigation }) => ({
    title: "Semester Questions",
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: 18,
      color: '#1560BD',
      fontFamily: 'Momo Trust Display',
    },
    headerBackTitleVisible: false,
    headerTintColor: '#1560BD',
  })}/>
    <Stack.Screen name="PageOne" component={PageOne} options={{ headerShown: false }}/>
      <Stack.Screen name="BooksShow" component={BooksShow} options={{ headerShown: false }}/>
      <Stack.Screen name="About" component={About} options={{ headerShown: true }}/>
      <Stack.Screen name="WebViewShow" component={WebViewShow} options={{ headerShown: false }}/>
      <Stack.Screen name="WebViewSave" component={WebViewSave} options={{ headerShown: false }}/>
      <Stack.Screen name="UtSubShow" component={UtSubShow} options={{ headerShown: false }}/>
      <Stack.Screen name="UttSubShow" component={UttSubShow} options={{ headerShown: false }}/>
      <Stack.Screen name="StuNoteShow" component={StuNoteShow} options={{ headerShown: false }}/>

      <Stack.Screen name="TimetableShow" component={TimetableShow} options={{ headerShown: false }}/>
      <Stack.Screen name="SyllShow" component={SyllShow} options={{ headerShown: false }}/>
      <Stack.Screen name="Search" component={Search} options={{ headerShown: false }}/>
      <Stack.Screen name="UserLogin" component={UserLogin} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateNewAccount" component={CreateNewAccount} options={{ headerShown: false }}/>

      <Stack.Screen name="UploadSemqus" component={UploadSemqus} options={({ navigation }) => ({
    title: "New Post",
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: 18,
      color: '#1560BD',
      fontFamily: 'Momo Trust Display',
    },
    headerBackTitleVisible: false,
    headerTintColor: '#1560BD',
    
  })}/>
      <Stack.Screen name="UploadUtoqus" component={UploadUtoqus} options={{ headerShown: false }}/>
      <Stack.Screen name="UploadUttqus" component={UploadUttqus} options={{ headerShown: false }}/>
      <Stack.Screen name="UploadBooks" component={UploadBooks} options={{ headerShown: false }}/>
      <Stack.Screen name="UploadNotes" component={UploadNotes} options={{ headerShown: false }}/>
      <Stack.Screen name="UploadSyll" component={UploadSyll} options={{ headerShown: false }}/>
      <Stack.Screen name="UploadTtable" component={UploadTtable} options={{ headerShown: false }}/>

      <Stack.Screen name="Showcomments" component={Showcomments} options={{ headerShown: false }}/>


      <Stack.Screen name="Att" component={Att} options={{ headerShown: false }}/>
      <Stack.Screen name="Attcreate" component={Attcreate} options={{ headerShown: false }}/>
      <Stack.Screen name="Insertatt" component={Insertatt} options={{ headerShown: false }}/>
      <Stack.Screen name="Attview" component={Attview} options={{ headerShown: false }}/>
      <Stack.Screen name="Pinenter" component={Pinenter} options={{ headerShown: false }}/>

      <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer></PaperProvider>
  );
}


export default App;







