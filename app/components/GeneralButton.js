import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../config/color';

function GeneralButton({ title, color = 'primary', handlePress }) {
  const buttonColor = colors[color] || colors.primary; 

  return (
    <TouchableOpacity style={[styles.appButton, { backgroundColor: buttonColor }]} onPress={handlePress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appButton: {
    width: '100%',
    height: 50, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25, 
    elevation: 3, 
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
  },
});

export default GeneralButton;
