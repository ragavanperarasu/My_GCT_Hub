import * as React from 'react';
import { BottomNavigation, Text, Icon } from 'react-native-paper';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
// import PageFour from './PageFour';
import Att from './Att';

import PageThree from './PageThree';
import About from '../About';
import { View, StyleSheet } from 'react-native';
import Icon1 from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/Feather'; // Example: Lucide not available, use Feather or others



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
    { key: 'music', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home'},
    { key: 'albums', title: 'Clubs', focusedIcon: 'people', unfocusedIcon:'people'},
    { key: 'news', title: 'Messages', focusedIcon: 'message-square', unfocusedIcon:'message-square'},
    // { key: 'recents', title: 'Hostel', focusedIcon: 'home-city', unfocusedIcon: 'home-city-outline'},
    // { key: 'notifications', title: 'Q-Links', focusedIcon: 'link-variant', unfocusedIcon: 'link-variant' },
    { key: 'attendane', title: 'Attendance', focusedIcon: 'mortar-board', unfocusedIcon: 'mortar-board' },
    { key: 'aabout', title: 'Profile', focusedIcon: 'person', unfocusedIcon: 'person' },
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
        {route.title === "Home" || route.title === "Profile" || route.title === "Clubs" || route.title === "Attendance" ? (
    <Icon1
      name={focused ? route.focusedIcon : route.unfocusedIcon}
      size={22}
      color={color}
    />
  ) : (
    <Icon2 
      name={focused ? route.focusedIcon : route.unfocusedIcon}
      size={22}
      color={color}
    />
  )}</View>
      )}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ fontSize: 12, color, marginTop: -18,textAlign:"center" , fontFamily:'Philosopher'}}>{route.title}</Text>
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


