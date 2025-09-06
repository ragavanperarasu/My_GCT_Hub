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
    fontWeight: 700,
    fontSize: 18,
    marginVertical: 15,
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
    marginVertical: 20,
    marginLeft: 10,
    height: 85,
    width: 85,
    borderRadius: 50,
    boxShadow: '#0000003D 0 3 8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogHeight: {
    height: '90%',
  },
});

export default styles;
