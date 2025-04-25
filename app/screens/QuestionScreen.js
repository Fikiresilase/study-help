import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import AppCodeEditor from '../components/AppCodeEditor';
import AppButton from '../components/AppButton';
import { Modalize } from 'react-native-modalize';
import apiClient from '../services/apiClient';
  
const QuestionScreen = ({ navigation, route }) => {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const { quizQuestion, courseId } = route.params;
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState('');
  const [modelResponse, setModelResponse] = useState(null);

  const modalizeRef = useRef(null);

  const openModal = () => {
    modalizeRef.current?.open();
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer before submitting.');
      openModal();
      return;
    }

    try {
      setError(null);
      const response = await apiClient.post('/lesson/validateAnswer', {
        answer,
        question: quizQuestion,
      });
      setModelResponse(response.data);
      openModal();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to validate answer.');
      setModelResponse(null);
      openModal();
    }
  };

  const handleContinue = () => {
    navigation.navigate('Learn', { courseId });
  };

  const renderCodeBlock = (code) => {
    // Basic JavaScript tokenization
    const keywords = [
      'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'break', 'continue', 'class', 'new', 'try', 'catch',
    ];
    const lines = code.split('\n');
    const elements = [];

    lines.forEach((line, lineIndex) => {
      // Handle comments
      if (line.trim().startsWith('//')) {
        elements.push(
          <Text key={`comment-${lineIndex}`} style={styles.comment}>
            {line}
          </Text>
        );
        return;
      }

      // Split line into tokens
      const tokens = line.split(/(\s+|[\(\)\{\}\[\];,=+\-*/&|!<>?:])/).filter(Boolean);
      const parts = [];
      let isString = false;
      let stringQuote = null;

      tokens.forEach((token, tokenIndex) => {
        if (isString) {
          if (token === stringQuote) {
            isString = false;
            stringQuote = null;
            parts.push(
              <Text key={`string-${lineIndex}-${tokenIndex}`} style={styles.string}>
                {token}
              </Text>
            );
          } else {
            parts.push(
              <Text key={`string-${lineIndex}-${tokenIndex}`} style={styles.string}>
                {token}
              </Text>
            );
          }
        } else if ((token === '"' || token === "'") && !isString) {
          isString = true;
          stringQuote = token;
          parts.push(
            <Text key={`string-${lineIndex}-${tokenIndex}`} style={styles.string}>
              {token}
            </Text>
          );
        } else if (keywords.includes(token)) {
          parts.push(
            <Text key={`keyword-${lineIndex}-${tokenIndex}`} style={styles.keyword}>
              {token}
            </Text>
          );
        } else {
          parts.push(
            <Text key={`code-${lineIndex}-${tokenIndex}`} style={styles.codeText}>
              {token}
            </Text>
          );
        }
      });

      elements.push(
        <Text key={`line-${lineIndex}`} style={styles.codeLine}>
          {parts}
        </Text>
      );
    });

    return elements;
  };

  const renderFormattedText = (text) => {
    if (!text || typeof text !== 'string') return <Text style={styles.modalText}>No content available</Text>;

    const lines = text.split('\n');
    const elements = [];
    let isCodeBlock = false;
    let codeContent = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        if (!isCodeBlock) {
          isCodeBlock = true;
          codeContent = [];
        } else {
          isCodeBlock = false;
          elements.push(
            <View key={`code-block-${index}`} style={styles.codeBlock}>
              {renderCodeBlock(codeContent.join('\n'))}
            </View>
          );
        }
        return;
      }

      if (isCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Handle bold text (**text**) and inline code (`code`)
      const parts = [];
      let remainingText = line;
      let partIndex = 0;

      while (remainingText.length > 0) {
        const boldMatch = remainingText.match(/\*\*(.*?)\*\*/);
        const codeMatch = remainingText.match(/`(.*?)`/);

        if (boldMatch && (!codeMatch || boldMatch.index < codeMatch.index)) {
          if (boldMatch.index > 0) {
            parts.push(
              <Text key={`text-${index}-${partIndex}`} style={styles.modalText}>
                {remainingText.slice(0, boldMatch.index)}
              </Text>
            );
            partIndex++;
          }
          parts.push(
            <Text key={`bold-${index}-${partIndex}`} style={styles.boldText}>
              {boldMatch[1]}
            </Text>
          );
          partIndex++;
          remainingText = remainingText.slice(boldMatch.index + boldMatch[0].length);
        } else if (codeMatch) {
          if (codeMatch.index > 0) {
            parts.push(
              <Text key={`text-${index}-${partIndex}`} style={styles.modalText}>
                {remainingText.slice(0, codeMatch.index)}
              </Text>
            );
            partIndex++;
          }
          parts.push(
            <Text key={`inline-code-${index}-${partIndex}`} style={styles.inlineCode}>
              {codeMatch[1]}
            </Text>
          );
          partIndex++;
          remainingText = remainingText.slice(codeMatch.index + codeMatch[0].length);
        } else {
          parts.push(
            <Text key={`text-${index}-${partIndex}`} style={styles.modalText}>
              {remainingText}
            </Text>
          );
          remainingText = '';
        }
      }

      if (line.trim().startsWith('- ')) {
        elements.push(
          <View key={`list-${index}`} style={styles.listItem}>
            <Text style={styles.listBullet}>• </Text>
            <Text style={styles.modalText}>{parts}</Text>
          </View>
        );
      } else if (parts.length > 0) {
        elements.push(
          <Text key={`line-${index}`} style={styles.modalText}>
            {parts}
          </Text>
        );
      } else {
        elements.push(
          <Text key={`line-${index}`} style={styles.modalText}>
            {line}
          </Text>
        );
      }
    });

    return elements;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{quizQuestion || 'Connection error'}</Text>
        </View>

        <AppCodeEditor code={answer} setCode={setAnswer} style={styles.codeEditor} />
        <AppButton label="Submit" onPress={handleSubmit} style={styles.submitButton} />
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        modalHeight={SCREEN_HEIGHT * 0.5}
        modalStyle={styles.modal}
        handleStyle={styles.handle}
        onClose={() => console.log('Modal closed')}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {error ? 'Error' : modelResponse ? 'Response' : 'Processing'}
          </Text>
          <View style={styles.textContainer}>
            {renderFormattedText(error || modelResponse || 'Processing your answer...')}
          </View>
          {modelResponse && !error && (
            <AppButton
              label="Continue"
              onPress={handleContinue}
              style={styles.continueButton}
            />
          )}
        </ScrollView>
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  questionContainer: {
    flexDirection: 'row',
    minHeight: 40,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
  },
  codeEditor: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  submitButton: {
    marginBottom: 15,
  },
  modal: {
    backgroundColor: '#f4f4f4',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#999',
    borderRadius: 2,
    marginTop: 8,
  },
  modalContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  textContainer: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    fontWeight: '400',
  },
  boldText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#d32f2f',
    fontWeight: '500',
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  codeLine: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Courier New',
  },
  codeText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#333',
    fontFamily: 'Courier New',
  },
  keyword: {
    fontSize: 13,
    lineHeight: 18,
    color: '#007AFF',
    fontFamily: 'Courier New',
  },
  string: {
    fontSize: 13,
    lineHeight: 18,
    color: '#d32f2f',
    fontFamily: 'Courier New',
  },
  comment: {
    fontSize: 13,
    lineHeight: 18,
    color: '#2e7d32',
    fontFamily: 'Courier New',
  },
  inlineCode: {
    fontSize: 13,
    lineHeight: 20,
    color: '#007AFF',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Courier New',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  listBullet: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginRight: 5,
  },
  continueButton: {
    marginTop: 10,
    alignSelf: 'center',
    width: '50%',
  },
});

export default QuestionScreen;
