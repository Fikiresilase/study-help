import React from 'react';
import { StyleSheet,Text } from 'react-native';


function ErrorDisplay({ error, visible }) {
    if (!error || !visible) return 
    return (
       
            <Text style={styles.errorStyle}>
                {error}
            </Text>

    );
}
const styles = StyleSheet.create({
    errorStyle: {
        color: 'red' 
    }
    
})

export default ErrorDisplay;