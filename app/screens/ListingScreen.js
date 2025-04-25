import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import ListingCard from '../components/ListingCard';
import Screen from '../components/Screen';
import colors from '../config/color';
import apiClient from '../services/apiClient';
import useProgress from '../hooks/useProgress';

function SkeletonLoader() {
  return (
    <View style={styles.listingCard}>
      <View style={styles.skeletonImage} />
      <View style={{ marginTop: 10 }}>
        <View style={styles.skeletonText} />
        <View style={[styles.skeletonText, { width: '40%', marginTop: 6 }]} />
      </View>
    </View>
  );
}

function ListingScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    apiClient
      .get('/courses')
      .then((response) => {
        setCourses(response.data);
        console.log('Courses fetched:', response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error.message);
        setIsLoading(false);
      });
  }, []);

  return ( 
    <Screen style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Explore Courses</Text>
        <Text style={styles.subHeader}>Pick a course to start learning today!</Text>
      </View>
      <FlatList
        data={isLoading ? Array(3).fill({}) : courses}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) =>
          isLoading ? (
            <SkeletonLoader />
          ) : (
            <ListingCard
              title={item.title || 'Untitled'}
              subTitle={` ${item.price} `}
              imageSrc={item.image || 'https://via.placeholder.com/150'}
              style={styles.listingCard}
              handlePress={() => {
                try {
                  console.log('Card clicked:', { id: item._id, title: item.title });
                  navigation.navigate('Learn', { courseId: item._id });
                  console.log('Navigation attempted to Learn');
                } catch (error) {
                  console.error('Error on card click:', error.message, error.stack);
                }
              }}
            />
          )
        }
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={false}
      />
    </Screen>
  );
}

export default ListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: colors.medium,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  listingCard: {
    marginRight: 15,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'flex-start',
  },
  skeletonImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.lightGray || '#E0E0E0',
    borderRadius: 10,
  },
  skeletonText: {
    width: '60%',
    height: 20,
    backgroundColor: colors.lightGray || '#E0E0E0',
    borderRadius: 4,
  },
  additionalSection: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  additionalHeader: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
})