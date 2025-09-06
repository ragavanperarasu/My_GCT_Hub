import React, {useEffect} from 'react';
import {Dialog, Portal} from 'react-native-paper';
import {TouchableOpacity, View, ScrollView} from 'react-native';
import Logo from '../../assets/images/accoun.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cache} from 'react-native-cache';

import styles from '../components/Style1';

import Male1 from '../../assets/images/male1.svg';
import Male2 from '../../assets/images/male2.svg';
import Male3 from '../../assets/images/male3.svg';
import Male4 from '../../assets/images/male4.svg';
import Male5 from '../../assets/images/male5.svg';
import Male6 from '../../assets/images/male6.svg';
import Male7 from '../../assets/images/male7.svg';
import Male8 from '../../assets/images/male8.svg';
import Female1 from '../../assets/images/female1.svg';
import Female2 from '../../assets/images/female2.svg';
import Female3 from '../../assets/images/female3.svg';

import Female5 from '../../assets/images/female5.svg';
import Female6 from '../../assets/images/female6.svg';
import Female7 from '../../assets/images/female7.svg';
import Female8 from '../../assets/images/female8.svg';
import Female9 from '../../assets/images/female9.svg';
import Female10 from '../../assets/images/female10.svg';

import A2 from '../../assets/images/a2.svg';
import A3 from '../../assets/images/a3.svg';
import A4 from '../../assets/images/a4.svg';
import A5 from '../../assets/images/a5.svg';
import A6 from '../../assets/images/a6.svg';
import A7 from '../../assets/images/a7.svg';
import A8 from '../../assets/images/a8.svg';

const cache = new Cache({
  namespace: 'mygct',
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

const avatarMap = {
  Logo: {Component: Logo, width: 85, height: 85},
  female1: {Component: Female1, width: 85, height: 85},
  female2: {Component: Female2, width: 85, height: 85},
  female3: {Component: Female3, width: 85, height: 85},
  female5: {Component: Female5, width: 85, height: 85},
  female6: {Component: Female6, width: 85, height: 85},
  female7: {Component: Female7, width: 85, height: 85},
  female8: {Component: Female8, width: 85, height: 85},
  female9: {Component: Female9, width: 85, height: 85},
  female10: {Component: Female10, width: 85, height: 85},
  male1: {Component: Male1, width: 85, height: 85},
  male2: {Component: Male2, width: 85, height: 85},
  male3: {Component: Male3, width: 85, height: 85},
  male4: {Component: Male4, width: 85, height: 85},
  male5: {Component: Male5, width: 85, height: 85},
  male6: {Component: Male6, width: 85, height: 85},
  male7: {Component: Male7, width: 85, height: 85},
  male8: {Component: Male8, width: 85, height: 85},
  a2: {Component: A2, width: 85, height: 85},
  a3: {Component: A3, width: 85, height: 85},
  a4: {Component: A4, width: 85, height: 85},
  a5: {Component: A5, width: 85, height: 85},
  a6: {Component: A6, width: 85, height: 85},
  a7: {Component: A7, width: 85, height: 85},
  a8: {Component: A8, width: 85, height: 85},
};

function StudentTitle() {
  const [visible1, setVisible1] = React.useState(false);
  const [avap, setAvap] = React.useState('Logo');

  const avatar = avatarMap[avap];

  async function setPcache(cname: String, cdata: String) {
    setAvap(cdata);
    await cache.set(cname, cdata);
  }

  function avatarProfile(aname: String) {
    setPcache('pava', aname);
    setVisible1(false);
  }

  useEffect(() => {
    const d = async () => {
      const rep = await cache.get('pava');
      if (rep !== undefined) {
        setAvap(rep);
      }
    };
    d();
  }, []);

  return (
    <TouchableOpacity style={styles.whiteBg} onPress={() => setVisible1(true)}>
      <Portal>
        <Dialog
          visible={visible1}
          style={styles.dialog}
          onDismiss={() => setVisible1(false)}>
          <Dialog.Title style={styles.title}>Select Your Avatar</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={styles.dialogHeight}>
              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('female1')}
                  style={styles.imageContainer}>
                  <Female1 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('female2')}
                  style={styles.imageContainer}>
                  <Female2 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('male7')}
                  style={styles.imageContainer}>
                  <Male7 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('male8')}
                  style={styles.imageContainer}>
                  <Male8 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('female3')}
                  style={styles.imageContainer}>
                  <Female3 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => avatarProfile('female5')}>
                  <Female5 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('male3')}
                  style={styles.imageContainer}>
                  <Male3 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('male4')}
                  style={styles.imageContainer}>
                  <Male4 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('female6')}
                  style={styles.imageContainer}>
                  <Female6 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('female7')}
                  style={styles.imageContainer}>
                  <Female7 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('male5')}
                  style={styles.imageContainer}>
                  <Male5 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('male6')}
                  style={styles.imageContainer}>
                  <Male6 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('female8')}
                  style={styles.imageContainer}>
                  <Female8 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('female9')}
                  style={styles.imageContainer}>
                  <Female9 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('male1')}
                  style={styles.imageContainer}>
                  <Male1 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('male2')}
                  style={styles.imageContainer}>
                  <Male2 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('female10')}
                  style={styles.imageContainer}>
                  <Female10 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('a2')}
                  style={styles.imageContainer}>
                  <A2 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('a3')}
                  style={styles.imageContainer}>
                  <A3 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('a4')}
                  style={styles.imageContainer}>
                  <A4 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('a5')}
                  style={styles.imageContainer}>
                  <A5 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('a6')}
                  style={styles.imageContainer}>
                  <A6 width={85} height={85} />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <TouchableOpacity
                  onPress={() => avatarProfile('a7')}
                  style={styles.imageContainer}>
                  <A7 width={85} height={85} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => avatarProfile('a8')}
                  style={styles.imageContainer}>
                  <A8 width={85} height={85} />
                </TouchableOpacity>
              </View>

            </ScrollView>
          </Dialog.Content>
        </Dialog>
      </Portal>

      <View style={styles.avaContainer}>
        {avatar ? (
          <avatar.Component width={avatar.width} height={avatar.height} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(StudentTitle);
