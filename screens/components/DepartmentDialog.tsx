import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Portal, Dialog, Text } from 'react-native-paper';
import styles from './Style1';

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

function DepartmentDialog({ visible, onClose, onSelect }) {
  return (
    <Portal>
      <Dialog visible={visible} style={styles.dialog} onDismiss={onClose}>
        <Dialog.Title style={styles.title}>
          Select Department
        </Dialog.Title>
        <Dialog.Content>
          <ScrollView>
            {departments.map((dept, index) => (
              <TouchableOpacity key={index} onPress={() => onSelect(dept)}>
                <Text variant="bodyMedium" style={styles.itemText}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

export default React.memo(DepartmentDialog);
