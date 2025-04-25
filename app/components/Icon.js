import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {View,StyleSheet} from 'react-native'
import color from '../config/color';
function Icon({
    name,
    size=40,
    backgroundColor='black',
    iconColor='white'
}) {
    return (
        <View style={{
            
                width: size,
                height: size,
                borderRadius: size*0.5,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor
            

        }}>
            <MaterialCommunityIcons name={name} size={size*0.5} color={iconColor} />


        </View>
        

    );
}

export default Icon;