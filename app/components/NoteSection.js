import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoteSection = ({ children }) => {

  const breakWord = (text, maxChars) => {
    return text.replace(new RegExp(`(\\S{${maxChars}})`, 'g'), '$1\u200B');
  };

  return (
    <View style={styles.noteSection}>
      <Text style={styles.lampIcon}>💡</Text>
      {<Text style={styles.noteText}>{children }</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  noteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFACD',
    borderRadius: 8,
    paddingRight: 10,
    marginBottom: 20,
  },
  lampIcon: {
    fontSize: 24,
  },
  noteText: {
    fontSize: 16,
    width: 250,
    color: '#333',
    padding: 10,
  },
});

export default NoteSection;
