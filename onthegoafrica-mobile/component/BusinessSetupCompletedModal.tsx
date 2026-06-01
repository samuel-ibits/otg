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

export default function BusinessSetupCompletedModal({ visible, onDone, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
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
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              </View>
            </View>

            <Text style={styles.title}>Business setup{'\n'}completed</Text>
            
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
const GREEN_LIGHT = '#4ADE80';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    minHeight: 450,
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
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 120,
    height: 120,
    backgroundColor: '#E8F5E8',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  checkmarkContainer: {
    width: 60,
    height: 60,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GREEN,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'RCB-Bold',
    textAlign: 'center',
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    color: TEXT,
    fontFamily: 'RCB-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: MUTED,
    fontFamily: 'RCB-Regular',
    textAlign: 'center',
    maxWidth: 300,
  },

  doneButton: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 4,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
  },
});