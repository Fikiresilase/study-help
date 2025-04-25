import { TextInput, View, StyleSheet } from 'react-native';

import color from '../../config/color';
import Icon from '../Icon';

function AppTextInput({ icon, ...textProps }) {
  
    return (
       
        <View style={styles.container}>
            <Icon
                 name={icon}
                 size={40}
                 iconColor='#000'
                 backgroundColor='none'
                />
                <TextInput  style={styles.textInput}
                    {...textProps}
                />
            </View>
     
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'relative',
        borderRadius:30,
        backgroundColor: color.white,
        
    },
    textInput: {
        flexDirection: 'row',
        width:'100%',
        flex: 1,
    }
    
})

export default AppTextInput;