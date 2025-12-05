import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  // Common Bg color
  whiteBg: {
    backgroundColor: '#FFFFFF',
  },

  // PageOne Dialog show
  dialog: {
    backgroundColor: '#F3F3F3',
  },
  title: {
    color: '#5E4F95',
    textAlign: 'center',
    fontWeight: '700',
  },
  itemText: {
    color: '#7B0202',
    fontSize: 18,
    marginVertical: 15,
    fontFamily: 'Philosopher',
  },

  // StudentTitle Style
  imageContainer: {
    boxShadow: '#0000003D 0 3 8',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  avaContainer: {
    marginVertical: 10,
    
    height: 75,
    width: 75,
    borderRadius: 50,
    boxShadow: '#0000003D 0 3 8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#007FFF"
  },
  dialogHeight: {
    height: '90%',
  },
  avatar:{
    height: 70,
    width: 70,
    borderRadius: 100,
  },
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
    marginRight: 10, // space between logo and text
  },
});

export default styles;
