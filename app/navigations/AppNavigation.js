import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ListingScreen from '../screens/ListingScreen';
import LearnScreen from '../screens/LearnScreen';
import AskAi from '../screens/AskAi';
import QuestionScreen from '../screens/QuestionScreen';
import AccountScreen from '../screens/AccountScreen'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ListingNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Listing"
      component={ListingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Learn"
      component={LearnScreen}
    />
    <Stack.Screen
      name="Quiz"
      component={QuestionScreen}
    />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="AskAi"
      component={AskAi}
      options={{
        tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="chat-question-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Learn"
      component={ListingNavigation}
      options={{
        tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Account"
      component={AccountScreen}
      options={{
        tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="account" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

const AppNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainTabs"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Quiz"
      component={QuestionScreen}
      options={{ title: 'Quiz' }}
    />
  </Stack.Navigator>
);

export default AppNavigation;
