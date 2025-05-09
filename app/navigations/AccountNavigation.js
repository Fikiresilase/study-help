import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AccountScreen from '../screens/AccountScreen'
import MessagesScreen from '../screens/MessagesScreen'
const AccountNavigation = () => {
    const Stack= createStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Screen name='Account' component={AccountScreen}  options={{headerShown:false}} />
            <Stack.Screen name='Message' component={MessagesScreen} />
 
      </Stack.Navigator>
    
  )
}

export default AccountNavigation
