
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LearnScreen from './app/screens/LearnScreen';
import QuestionSCreen from './app/screens/QuestionScreen';
import WelcomePage from './app/screens/WelcomePage';
import LoginScreen from './app/screens/LoginScreen';
import RegistrationScreen from './app/screens/RegistrationScreen';
import ListingScreen from './app/screens/ListingScreen';
import color from './app/config/color';
import AuthContext from './app/auth/authContext';
import authStorage from './app/auth/storage';
import { jwtDecode } from 'jwt-decode';
import navigationTheme from './app/navigations/navigationTheme';
import AuthNavigation from './app/navigations/AuthNavigation';
import AppNavigation from './app/navigations/AppNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState()

  const restoreToken = async () => {
    const token = await authStorage.getToken()
    let temp = jwtDecode(token).id
    console.log(temp)
    setUser(temp.id)

  }

  useEffect(() => {
    restoreToken()
  },[])


  return (
     <AuthContext.Provider value={{user,setUser}}>
      <NavigationContainer theme={navigationTheme} >
       { !user ? <AuthNavigation/> : <AppNavigation/>}
       {/* <Stack.Navigator initialRouteName="WelcomePage" >
         <Stack.Screen name="WelcomePage" component={WelcomePage}  /> */}
            {/* <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Courses" component={ListingScreen} />
            <Stack.Screen name="Register" component={RegistrationScreen} />
            <Stack.Screen name="Learn" component={LearnScreen} />
            <Stack.Screen name="Quiz" component={QuestionSCreen} /> */}
         
       {/* </Stack.Navigator> */}
      </NavigationContainer>
      </AuthContext.Provider>
   );
 }
 
