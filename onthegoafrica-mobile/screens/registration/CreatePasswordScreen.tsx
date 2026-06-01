import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

type Props = {
  onBack?: () => void;
  onSavePassword?: (password: string, confirmPassword: string) => void;
};

export default function CreatePasswordScreen({
  onBack,
  onSavePassword,
}: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSavePassword = () => {
    if (newPassword && confirmPassword) {
      onSavePassword?.(newPassword, confirmPassword);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create new password</Text>
          <Text style={styles.subtitle}>
            Your new password must be unique from those previously used.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor={PLACEHOLDER}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../../assets/icons/eye.png')}
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm new password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor={PLACEHOLDER}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../../assets/icons/eye.png')}
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveBtn} 
            onPress={handleSavePassword} 
            activeOpacity={0.9}
          >
            <Text style={styles.saveBtnText}>Save new password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BLUE = '#0145FE';
const TEXT = '#0A1220';
const MUTED = '#6C7A92';
const PLACEHOLDER = '#A8B5C8';
const INPUT_BG = '#F5F7FA';
const INPUT_BORDER = '#E8EDF5';

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: TEXT,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    color: TEXT,
    fontFamily: 'RCB-Bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: MUTED,
    fontFamily: 'RCB-Regular',
  },

  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: TEXT,
    fontFamily: 'RCB-Medium',
    marginBottom: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    color: TEXT,
    fontFamily: 'RCB-Regular',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: MUTED,
  },

  saveBtn: {
    backgroundColor: BLUE,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
  },
});