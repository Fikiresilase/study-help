import React from 'react'

import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/LoginScreen"
import RegistrationScreen from "../screens/RegistrationScreen"
import WelcomePage from "../screens/WelcomePage"
import color from "../config/color"
const Stack = createStackNavigator()

 AuthNavigation = () => (
    <Stack.Navigator>
        <Stack.Screen name="Welcome" component ={WelcomePage}  />
        <Stack.Screen name="Login" component={LoginScreen } />
        <Stack.Screen name="Register" component={RegistrationScreen} />
    </Stack.Navigator>

)

export default AuthNavigation