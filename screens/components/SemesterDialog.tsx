import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import styles from './Style1'; 

const SemesterDialog = ({ visible, onDismiss, semSelect }) => {
  const semesters = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ];

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>Select Semester</Dialog.Title>
        <Dialog.Content>
          <ScrollView>
            {semesters.map((sem, index) => (
              <TouchableOpacity key={index} onPress={() => semSelect(sem)}>
                <Text variant="bodyMedium" style={styles.itemText}>
                  {sem}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default React.memo(SemesterDialog);
