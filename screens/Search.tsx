import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ToastAndroid, Linking, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

  const searchData = [
    { key: "GCT College Official Website", link: "https://gct.ac.in/" },
    { key: "GCT College WiFi Form", link: "https://gct.ac.in/wi-fi-forms" },
    { key: "College Placement Statistics", link: "https://gct.ac.in/placement-statistics" },
    { key: "College Hostel Incharge", link: "https://gct.ac.in/hostel-incharge" },
    { key: "College COE Circulars", link: "https://gct.ac.in/coe-circulars" },
    { key: "College COE All Forms", link: "https://gct.ac.in/downloads-0" },
    { key: "SBI Collect", link: "https://www.onlinesbi.sbi/sbicollect/" },
    { key: "B.E Civil", link: "https://gct.ac.in/24/department-civil-engineering-about-department" },
    { key: "M.E Environmental Engineering", link: "https://gct.ac.in/56/me-environmental-engineering" },
    { key: "B.E Mechanical Engineering", link: "https://gct.ac.in/20/department-mechanical-engineering-about-department-0" },
    { key: "B.E EEE", link: "https://gct.ac.in/19/department-eee-about-department-1" },
    { key: "B.E ECE", link: "https://gct.ac.in/23/department-ece-about-department-0" },
    { key: "B.E Production", link: "https://gct.ac.in/22/department-production-engineering-facilities-0" },
    { key: "B.E EIE", link: "https://gct.ac.in/26/department-eie-engineering-about-department-0" },
    { key: "B.E CSE", link: "https://gct.ac.in/21/cse-about-department-0" },
    { key: "B.Tech IT", link: "https://gct.ac.in/47/about-department-it" },
    { key: "IBT", link: "https://gct.ac.in/25/department-bio-technology-about-department-0" },
    { key: "AIML", link: "https://gct.ac.in/66/aiml-about-department" },
    { key: "GCT Alumni Website", link: "https://www.gctalumni.org.in/" },
    { key: "Department HOD", link: "https://gct.ac.in/heads-department" },
    { key: "COE Fees Structure", link: "https://gct.ac.in/coe-fees-structure" },
    { key: "B.E Regulation 2022", link: "https://gct.ac.in/regulation-2022" },

  ];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);



  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setFilteredData([]);
    } else {
      const filtered = searchData.filter(item =>
        item.key.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handlePress = (item) => {
    setSearchQuery(item.key);
    setFilteredData([]);
    Linking.openURL(item.link);
  };

  const handleSearchIcon = () => {
    if (searchQuery.trim() === '') {
      ToastAndroid.show("Type Your Search Query", ToastAndroid.SHORT);
      return;
    }
    const matchedItem = searchData.find(item => item.key === searchQuery);
    if (matchedItem) {
      Linking.openURL(matchedItem.link);
    } else {
      ToastAndroid.show("No matching result found", ToastAndroid.SHORT);
    }
  };

  return (
    <Animatable.View
      style={{ flex: 1 }}
      animation={'zoomIn'}
      duration={1000} delay={400}
      useNativeDriver
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search GCT Quick Link"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
            placeholderTextColor="#B4B4B4"
            iconColor='#4B0082'
            theme={{ colors: { onSurfaceVariant: "#4B0082" } }}
            onIconPress={handleSearchIcon}
            inputStyle={{
    fontFamily: 'Philosopher',
    fontSize: 16,
  }}
          />

          {filteredData.length > 0 && (
            <ScrollView
              style={styles.autocompleteContainer}
              keyboardShouldPersistTaps="handled"
            >
              {filteredData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestion}
                  onPress={() => handlePress(item)}
                >
                  <Text style={styles.suggestionText}>{item.key}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding:5},
  
  searchContainer: { marginTop: 0,},
  
  searchbar: { backgroundColor: "#EEEEEE", borderRadius:15},
  autocompleteContainer: {
    marginTop: 10,
    backgroundColor: "#ffffffff",
    borderRadius: 15,
    maxHeight: 200,
    elevation:10
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  suggestionText: {
    color: "black",
    fontFamily: "Philosopher",
    fontSize: 15,
  },
});
