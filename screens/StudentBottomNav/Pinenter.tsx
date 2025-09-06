import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Pressable, ToastAndroid, Vibration} from 'react-native';
import {TextInput, Surface, Icon} from 'react-native-paper';


import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootParam';
import {API_URL} from '@env';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Loading from '../components/Loading';




type SubShowScreenProp = StackNavigationProp<RootStackParamList, 'Pinenter'>;
export default function Pinenter({route}: {route: SubShowScreenProp}) {

  const navigation = useNavigation<SubShowScreenProp>();
  const {data, ftype} = route.params;

  const [pin, setPin] = useState('');
    const [load, setLoad] = useState(false);
  
  async function fetchData() {
    setLoad(true);
    const jsonData = {
      aid: data._id,
    };
    try {
      const url = API_URL + '/delatt';

      await axios.post(url, jsonData).then(res => {
        const resData = res.data;
        setLoad(false);
        if(resData === "done"){
          ToastAndroid.show(`Deleted Successfully`, ToastAndroid.LONG);
          Vibration.vibrate(100);
          navigation.navigate('StudentHome')
        }
        else{
          ToastAndroid.show(`Deleted Not Successfully`, ToastAndroid.LONG);
          Vibration.vibrate(100);
          navigation.navigate('StudentHome')
        }
        
      });
    } catch (error) {
      setLoad(false);
      ToastAndroid.show(`Server Connection Problem`, ToastAndroid.LONG);
      Vibration.vibrate(100);
    }
  }

 

  

  function handleClick() {
    if (pin === '' || pin.length !== 4) {
      ToastAndroid.show(`Please, Enter 4 Digit PIN`, ToastAndroid.LONG);
      Vibration.vibrate(100);
    }
    else if(data.pass !== pin) {
      ToastAndroid.show(`Access Denied`, ToastAndroid.LONG);
      Vibration.vibrate(500);
      setPin('')
    }
    else{
      setPin('')
      if(ftype === 'insert')
        navigation.navigate('Insertatt', {data: data});
      else if(ftype === 'view')
        navigation.navigate('Attview', {data: data});
      else if(ftype === 'delete')
        fetchData()
    }
  }


  if (load) {
      return (
       <Loading loadtext={"Connecting to server"} />
      );
    }





  return(
     <View style={{backgroundColor:"#F5F5F5"}}>

      <ScrollView style={styles.logincon2} keyboardShouldPersistTaps="handled">

        <Text
          style={{
            fontSize: 30,
            textAlign: 'center',
            fontWeight: '700',
            color: '#4B0082',
          }}>
          Access PIN
        </Text>
        <LottieView
          style={{width: '100%', height: 300}}
          source={require('../../assets/animations/d.json')}
          autoPlay
          loop
        />
     


        <TextInput
          mode="outlined"
          placeholder="Access PIN"
          onChangeText={text => {
            setPin(text);
          }}
          style={styles.input}
          activeOutlineColor="#6082B6"
          outlineColor='white'
          outlineStyle={{borderWidth:1.5,elevation:10}}
          secureTextEntry
          keyboardType="number-pad"
          placeholderTextColor={'#C0C0C0'}
          textColor="black"
          value={pin}
          theme={{
            roundness: 10
          }}
          left={<TextInput.Icon icon="lastpass" />}
          maxLength={4}
        />

        

        <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginTop:20}}>

<Pressable style={{ width: '45%' }} onPress={handleClick}>
  {({ pressed }) => (
    <Surface
      elevation={4}
      style={[
        styles.surface,
        pressed && { backgroundColor: '#6F2DA8' },
      ]}
    >
     <Text style={{color:"white", fontSize:16, fontWeight:700}}><Icon
    source="login"
    color={"white"}
    size={17}
  />  Submit</Text>
  </Surface>)}</Pressable>


<Pressable style={{ width: '45%' }} onPress={() => navigation.goBack()}>
  {({ pressed }) => (
    <Surface
      elevation={4}
      style={[
        styles.surface2,
        pressed && { backgroundColor: '#E5E4E2' },
      ]}
    >
      <Text style={{ color: '#4B0082', fontSize: 16, fontWeight: '700' }}>
        <Icon source="backburger" color="#4B0082" size={20} />  Back
      </Text>
    </Surface>
  )}
</Pressable>

        </View>



        


      </ScrollView>

    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: '90%',
  },
  logincon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    margin: 20,
  },
  logincon2: {
    height: '100%',
    borderRadius: 10,
    padding:20,
    width: '100%',
  },
  but: {
    backgroundColor: '#007FFF',
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 10,
    width: '45%',
    height: 45,
    elevation:10
  },
  but2: {
    backgroundColor: '#DE3163',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height: 45,
  },
  butlab: {
    color: 'white',
    fontSize: 16,
  
  },
  input: {
    marginVertical:20,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    height: 45,
  },
  surface: {
    padding: 8,
    height: 45,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
    backgroundColor: '#4B0082',
    
  },
    surface2: {
    padding: 8,
    height: 45,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
    backgroundColor: 'white',
    
  },
});