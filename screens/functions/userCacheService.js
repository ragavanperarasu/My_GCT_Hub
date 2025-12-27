import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Cache} from 'react-native-cache';

const BASE_URL = "http://192.168.150.104:5000";


const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

export const fetchUserAndUpdateCache = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/app/users/${userId}`
    );
    const userData = response.data;
    if(userData.status === 'success'){
        await cache.set('userdata', userData.user);
        return userData.user.name;
    }else{
        return "error"
    }

  } catch (error) {
    throw error; // let caller handle error
  }
};
