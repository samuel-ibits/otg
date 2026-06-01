// components/CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const CustomHeader = ({ title = 'My App' }) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
      
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomHeader;