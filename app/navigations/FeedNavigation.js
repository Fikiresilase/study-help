import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ListingScreen from '../screens/ListingScreen'
import SelectedListingScreen from '../screens/SelectedListingScreen'
import AccountScreen from '../screens/AccountScreen'
const FeedNavigation = () => {
    const Stack= createStackNavigator()
  return (
      <Stack.Navigator mode="modal" options={{headerShown:false}}>
          <Stack.Screen name='Listing' component={ListingScreen} options={{headerShown:false}} />
          <Stack.Screen name='SelectedListing' component={SelectedListingScreen} />
         
          
    </Stack.Navigator>
  )
}

export default FeedNavigation
