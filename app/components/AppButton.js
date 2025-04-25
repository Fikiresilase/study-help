import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import colors from '../config/color';




const AppButton = ({ onPress, label, color = 'primary', }) => {
  const buttonColor = colors[color] || colors.primary;

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]}  onPress={onPress}>
      <Text style={styles.buttonText}>{ label }</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppButton;
