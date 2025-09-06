import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import styles from './Style1'; 


const RegulationDialog= ({ visible, onDismiss }) =>{
  return (
          <Portal>
            <Dialog
              visible={visible}
              onDismiss={onDismiss} style={styles.dialog}>
              <Dialog.Title
                style={styles.title}>
                Select Regulation
              </Dialog.Title>
              <Dialog.Content>
                <ScrollView>
                  <TouchableOpacity onPress={onDismiss}>
                    <Text variant="bodyMedium" style={styles.itemText}>
                      2022
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </Dialog.Content>
            </Dialog>
          </Portal>
  )
}

export default React.memo(RegulationDialog);