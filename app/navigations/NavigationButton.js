import React from 'react';

import Screen from '../components/Screen';
import color from '../config/color';
import { View, StyleSheet,TouchableOpacity } from 'react-native';
import {MaterialCommunityIcons}  from '@expo/vector-icons'


function NavigationButton({handlePress}) {
    return (
        <Screen style={styles.container}>
        <TouchableOpacity onPress={handlePress}>
        <View style={styles.btn} >
                <MaterialCommunityIcons name='home' size={30} color={color.white} />
        </View>
       </TouchableOpacity>


        </Screen>
    );
}
const styles = StyleSheet.create({
   
    btn:
        {   alignItems:'center',
            backgroundColor: color.primary,
            borderWidth:10,
            borderColor:'#eee',
            width: 74,
            height: 74,
            borderRadius:37,
            bottom: 40,
            justifyContent:'center',
            elevation:3,
            
    }
    
    
    
})

export default NavigationButton;