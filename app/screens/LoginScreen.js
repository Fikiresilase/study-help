import React, { useContext } from 'react';
import { Image, StyleSheet, View, Text, Alert } from 'react-native';
import * as Yup from 'yup';
import AppFormField from '../components/forms/AppFormField';
import AppForm from '../components/forms/AppForm';
import Screen from '../components/Screen';
import { jwtDecode } from 'jwt-decode';
import AppButton from '../components/forms/AppButton';
import AuthContext from '../auth/authContext';
import authApi from '../services/authApi';
import authStorage from '../auth/storage';

const yupSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
});

function LoginScreen({ navigation }) {
  const authContext = useContext(AuthContext);

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await authApi.login(email, password);
      if (!response || !response.data) {
        throw new Error('No response data');
      }
      const token = response.data;
      const user = jwtDecode(token);
      authContext.setUser(user);
      console.log('Token stored:', token);
      authStorage.storeToken(token);
    
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.image} source={require('../assets/logo-1.png')} />
      </View>
      <View style={styles.fieldsContainer}>
        <AppForm
          initialValues={{ email: '', password: '' }}
          handleSubmit={handleLogin}
          validationSchema={yupSchema}
        >
          <AppFormField
            name="email"
            icon="email"
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <AppFormField
            name="password"
            icon="lock"
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          />
          <View style={styles.btnContainer}>
            <AppButton title={'LOGIN'} color="primary" />
          </View>
        </AppForm>
      </View>
      <Text style={styles.forgotPassword} onPress={() => console.log('Forgot Password')}>
        Forgot Password?
      </Text>
      <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 100,
    marginTop: 10,
    marginBottom: 30,
  },
  fieldsContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  btnContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  forgotPassword: {
    marginTop: 15,
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  registerText: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;