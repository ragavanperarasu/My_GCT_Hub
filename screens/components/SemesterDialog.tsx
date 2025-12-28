import React from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

const SemesterDialog = ({ onSelect }) => {
  const semesters = [
    "2022",
    "2018-a",
  ];

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.title}>Select Semester</Text>

      <ScrollView style={{ marginTop: 10 }}>
        {semesters.map((sem, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(sem)}   // same like semSelect
            style={styles.item}
          >
            <Text style={styles.itemText}>{sem}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(SemesterDialog);


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: '#1560BD',
    fontFamily: 'Momo Trust Display',
    textAlign: 'center',
  },
  item: {
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Philosopher',
    color: '#b9009aff',
  },
});
