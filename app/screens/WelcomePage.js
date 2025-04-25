import React from 'react'

import { useDeviceOrientation } from '@react-native-community/hooks';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import AppButton from '../components/AppButton';
import color from '../config/color';

function WelcomePage({ navigation }) {
  const { portrait } = useDeviceOrientation();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo-1.png')} style={styles.logo} />
        <Text style={styles.tagLine}>Study Smart</Text>
        <Text style={styles.description}>
          Easy studying with AI-driven tools that make learning faster, easier, and more effective. Unlock your potential today!
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton label="Login" onPress={() => navigation.navigate('Login')} />
        <AppButton label="Register" color='secondary' onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 26 : 0,
    
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  tagLine: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15, 
  },
});

export default WelcomePage;
