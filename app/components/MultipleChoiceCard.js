import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';

const MultipleChoiceCard = ({ question, selectedOption, onOptionSelect }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.questionText}>{question.text}</Text>
      <RadioButton.Group
        onValueChange={onOptionSelect}
        value={selectedOption}
      >
        {question.options.map((option, index) => (
          <View key={index} style={styles.radioContainer}>
            <RadioButton value={option} />
            <Text style={styles.radioLabel}>{option}</Text>
          </View>
        ))}
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '95%',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 14,
    color: '#555',
  },
});

export default MultipleChoiceCard;
