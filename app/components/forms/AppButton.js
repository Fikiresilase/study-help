import React from 'react';
import { TouchableOpacity, Text ,StyleSheet } from 'react-native';

import colors from '../../config/color'
import { useFormikContext } from 'formik';

function AppButton({ title,color = 'primary' }) {
    const {handleSubmit} =useFormikContext()
    return (
        <TouchableOpacity style={[styles.button,{ backgroundColor:colors[color]}]} onPress={handleSubmit}>
           <Text style={styles.buttonText}>{title}</Text> 
        </TouchableOpacity>
    );
}

export default AppButton;
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
      },
    
})