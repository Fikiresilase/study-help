import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ children, title }) => {
  return (<>
    <View style={{ flexDirection:'row',width:'100%',gap:"10px"}}><Text style={styles.title}>{title}</Text></View> 
    <View style={styles.card}>
       {children}
    </View></>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10, 
  
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    
  },
  decoration: {
    backgroundColor: '#000',
    width: 200,
    height: 10,
    marginLeft: 10
    

  }
});

export default Card;
