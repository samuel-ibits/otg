import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

type Props = {
  visible: boolean;
  onDone?: () => void;
  onClose?: () => void;
};

export default function AccountCreatedModal({ visible, onDone, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Image
              source={require('../assets/icons/close.png')}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Image
                  source={require('../assets/icons/checkmark.png')}
                  style={styles.checkmarkIcon}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={styles.title}>Account Created Successfully</Text>
            
            <Text style={styles.message}>
              Lorem ipsum dolor sit amet consectetur.{'\n'}
              Urna odio non blandit feugiat et nulla.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.doneButton} 
            onPress={onDone}
            activeOpacity={0.9}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const BLUE = '#0145FE';
const TEXT = '#0A1220';
const MUTED = '#6C7A92';
const GREEN = '#16A34A';
const GREEN_BG = '#DCFCE7';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    minHeight: 400,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: MUTED,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBackground: {
    width: 80,
    height: 80,
    backgroundColor: GREEN,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GREEN,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  checkmarkIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFFFFF',
  },

  title: {
    fontSize: 24,
    lineHeight: 30,
    color: TEXT,
    fontFamily: 'RCB-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
    fontFamily: 'RCB-Regular',
    textAlign: 'center',
    maxWidth: 280,
  },

  doneButton: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
  },
});