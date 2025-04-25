import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import apiClient from '../services/apiClient';
import Screen from '../components/Screen';
import AppTextInput from '../components/forms/AppTextInput';
import { MaterialIcons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import LottieView from 'lottie-react-native';

const parseMarkdown = (text) => {
  const elements = [];
  const lines = text.split('\n');
  let currentText = '';
  let inBold = false;
  let inItalic = false;

  lines.forEach((line, lineIndex) => {
    if (line.trim().startsWith('- ')) {
      if (currentText) {
        elements.push(renderText(currentText, inBold, inItalic));
        currentText = '';
      }
      elements.push(
        <Text key={`list-${lineIndex}`} style={styles.listItem}>
          • {line.replace('- ', '')}
        </Text>
      );
    } else {
      const chars = line.split('');
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === '*' && chars[i + 1] === '*' && !inItalic) {
          if (currentText) {
            elements.push(renderText(currentText, inBold, inItalic));
            currentText = '';
          }
          inBold = !inBold;
          i++;
        } else if (chars[i] === '*' && !inBold) {
          if (currentText) {
            elements.push(renderText(currentText, inBold, inItalic));
            currentText = '';
          }
          inItalic = !inItalic;
        } else {
          currentText += chars[i];
        }
      }
      if (currentText) {
        elements.push(renderText(currentText, inBold, inItalic));
        currentText = '';
      }
      if (lineIndex < lines.length - 1) {
        elements.push(<Text key={`break-${lineIndex}`}>{'\n'}</Text>);
      }
    }
  });

  return elements;
};

const renderText = (text, bold, italic) => (
  <Text
    key={text + Math.random()}
    style={[
      styles.messageText,
      bold && styles.boldText,
      italic && styles.italicText,
    ]}
  >
    {text}
  </Text>
);

function AskAi({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [sessionId] = useState(uuidv4());

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleSend = async () => {
    if (!message && !image) return;

    const userMessage = {
      type: 'user',
      text: message || (image ? 'Image sent' : ''),
      image: image || null,
      timestamp: new Date().toISOString(),
    };
    setConversation((prev) => [...prev, userMessage]);

    setIsUploading(true);
    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'upload.jpg',
        });
      }
      if (message) {
        formData.append('prompt', message);
      }

      const response = await apiClient.post(`/chat?sessionId=${sessionId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const aiMessage = {
        type: 'ai',
        text: response.data.message,
        timestamp: new Date().toISOString(),
      };
      setConversation((prev) => [...prev, aiMessage]);

      setMessage('');
      setImage(null);
    } catch (error) {
      console.log('Error sending message:', error);
      alert('Failed to get AI response. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Screen style={{ flex: 1 }}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
       
        
      >
        {conversation.length === 0 ? (
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../assets/helloBot.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.lottieText}>Start the conversation!</Text>
          </View>
        ) : (
          conversation.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.type === 'user' ? styles.userMessage : styles.aiMessage,
              ]}
            >
              {msg.image && (
                <Image source={{ uri: msg.image }} style={styles.messageImage} />
              )}
              {msg.type === 'ai' ? (
                parseMarkdown(msg.text)
              ) : (
                <Text style={styles.messageText}>{msg.text}</Text>
              )}
              <Text style={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <MaterialIcons name="image" size={24} color="#666" />
        </TouchableOpacity>

        <AppTextInput
          style={styles.chatInput}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message && !image) || isUploading ? styles.sendButtonDisabled : styles.sendButtonActive,
          ]}
          onPress={handleSend}
          disabled={isUploading || (!message && !image)}
        >
          <MaterialIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeImage}
            onPress={() => setImage(null)}
          >
            <MaterialIcons name="cancel" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  lottieContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  lottieText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    color: '#fff',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  listItem: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  messageImage: {
    width: 150,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  imageButton: {
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  chatInput: {
    marginRight: 10,
    maxHeight: 60,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
    alignItems: 'center',
    zIndex: 2,
  },
  previewImage: {
    width: 100,
    height: 75,
    borderRadius: 5,
  },
  removeImage: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
});

export default AskAi;
