import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const departments = [
  'Civil Engineering',
  'Computer Science Engineering',
  'Electronics And Communication Engineering',
  'Electrical And Electronics Engineering',
  'Electronics And Instrumentation Engineering',
  'Industrial Bio Technology',
  'Information Technology',
  'Mechanical Engineering',
  'Production Engineering',
];

function DepartmentDialog({onSelect, onClose}) {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Select Department</Text>

      {/* List */}
      <ScrollView style={{marginTop: 10}}>
        {departments.map((dept, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onSelect(dept);
              onClose(); // close sheet after selection
            }}
            style={styles.item}>
            <Text style={styles.itemText}>{dept}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default React.memo(DepartmentDialog);

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
    color: '#4B0082',
  },
});
