import React from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

const SemesterDialog = ({ onSelect }) => {
  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.title}>Select Semester</Text>

      <ScrollView style={{ marginTop: 10 }}>
        {semesters.map((sem, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(sem)}   // same like semSelect
            style={{ paddingVertical: 12 }}
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
