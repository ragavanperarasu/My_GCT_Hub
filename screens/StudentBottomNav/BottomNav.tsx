import * as React from 'react';
import { BottomNavigation, Text, Icon } from 'react-native-paper';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
// import PageFour from './PageFour';
import Att from './Att';

import PageThree from './PageThree';
import About from '../About';
import { View, StyleSheet } from 'react-native';


const MusicRoute = () => <PageOne/>;

const AlbumsRoute = () => <PageTwo/>;

// const RecentsRoute = () => <PageFour/>;

const NewsRoute = () => <PageThree/>;

const AttRoute = () => <Att/>;

 const AboutRoute = () => <About/>;

// const NotificationsRoute = () => <PageFive/>;

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'music', title: 'Resource', focusedIcon: 'book-open-page-variant', unfocusedIcon: 'book-open-page-variant-outline'},
    { key: 'albums', title: 'Clubs', focusedIcon: 'account-supervisor', unfocusedIcon:'account-supervisor-outline'},
    { key: 'news', title: 'Messages', focusedIcon: 'message-text', unfocusedIcon:'message-text-outline'},
    // { key: 'recents', title: 'Hostel', focusedIcon: 'home-city', unfocusedIcon: 'home-city-outline'},
    // { key: 'notifications', title: 'Q-Links', focusedIcon: 'link-variant', unfocusedIcon: 'link-variant' },
    { key: 'attendane', title: 'Attendance', focusedIcon: 'badge-account', unfocusedIcon: 'badge-account' },
    { key: 'aabout', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    news: NewsRoute,
    // recents: RecentsRoute,
    attendane:AttRoute,
    aabout:AboutRoute
    // notifications: NotificationsRoute,
  });

  return (

    <BottomNavigation
      navigationState={{ index, routes }}                                                                             
      onIndexChange={setIndex}
      renderScene={renderScene}
     barStyle={{backgroundColor:"#FFFFFF", height:55}}
     activeColor='#8266EF' 
     inactiveColor='#7B7B7B'
     activeIndicatorStyle={{height:0}}
     shifting={false} // Prevents active tab icons from becoming larger
      renderIcon={({ route, focused, color }) => (
        <View style={{ marginVertical: -10 }}>
        <Icon source={focused ? route.focusedIcon : route.unfocusedIcon} size={25} color={color}/></View>
      )}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ fontSize: 11, color, marginTop: -15,textAlign:"center" }}>{route.title}</Text>
      )}
      />
    
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // or match app background
  },
});

export default MyComponent;