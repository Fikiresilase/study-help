
import { SafeAreaView,Platform,StyleSheet } from 'react-native';

function Screen({children,style}) {
    return (
        <SafeAreaView style={[styles.screen,style]}>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: Platform.OS === 'android' ? 20 : 30 ,
        
    }
})
export default Screen;