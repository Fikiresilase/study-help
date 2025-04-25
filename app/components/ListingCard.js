import { Text, View, StyleSheet ,Image,TouchableWithoutFeedback } from 'react-native';

import colors from '../config/color'


function ListingCard({title,subTitle,imageSrc,style,handlePress}) {
    return (
        <TouchableWithoutFeedback onPress={handlePress}>
        <View style={[styles.card,style]}>
            <Image style={styles.image} source={{uri:imageSrc}} />
            <View style={styles.titlesContainer}>
            <Text style={styles.title} >
                {title}
            </Text>
            <Text style={styles.subTitle}>
                {subTitle}
            </Text>
            </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 10,
        overflow: 'hidden'
       
        
    },
    image: {
        width: '100%',
        height: 200,
        
    },
    titlesContainer: {
        width:'100%',
        padding:10,    
    },
    title: {
        fontWeight:'700'

    },
    subTitle: {
        color:colors.secondary,
        fontWeight:'400'
        
    }
    
})

export default ListingCard;