import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import Screen from '../components/Screen';
import apiClient from '../services/apiClient';
import AuthContext from '../auth/authContext';

const SkeletonLoader = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonProfile}>
      <View style={[styles.skeletonBase, { width: 100, height: 100, borderRadius: 50, marginBottom: 15 }]} />
      <View style={[styles.skeletonBase, { width: 150, height: 24, marginBottom: 5 }]} />
      <View style={[styles.skeletonBase, { width: 200, height: 16 }]} />
    </View>
    <View style={styles.skeletonCourses}>
      <View style={[styles.skeletonBase, { width: 150, height: 20, marginBottom: 15 }]} />
      <View style={[styles.skeletonBase, { width: '100%', height: 60, borderRadius: 8, marginBottom: 10 }]} />
      <View style={[styles.skeletonBase, { width: '100%', height: 60, borderRadius: 8 }]} />
    </View>
  </View>
);

const AccountScreen = () => {
  const { user } = useContext(AuthContext);
  const userID = user?.id;
  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!userID) {
      setError('User not authenticated');
      return;
    }
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/user/', {
          params: { userID },
        });
        setProfile({ name: response.data.username, email: response.data.email });
        setEnrolledCourses(response.data.courses);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile or courses. Please try again.');
      }
    };
    fetchData();
  }, [userID]);

  const renderCourseItem = ({ item }) => (
    <View style={styles.courseItem}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/60' }}
        style={styles.courseImage}
      />
      <Text style={styles.courseText}>{item.title}</Text>
    </View>
  );

  if (!userID) {
    return (
      <Screen style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not authenticated</Text>
        </View>
      </Screen>
    );
  }

  if (!profile || !enrolledCourses) {
    return (
      <Screen style={styles.container}>
        <SkeletonLoader />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileContainer}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
        <View style={styles.coursesContainer}>
          <Text style={styles.sectionTitle}>Enrolled Courses</Text>
          {enrolledCourses.length > 0 ? (
            <FlatList
              data={enrolledCourses}
              renderItem={renderCourseItem}
              keyExtractor={(item) => item.courseId || `${item.title}-${Math.random()}`}
              style={styles.courseList}
            />
          ) : (
            <Text style={styles.noCourses}>No courses enrolled.</Text>
          )}
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  coursesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  courseList: {
    flexGrow: 0,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  courseText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  noCourses: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
  },
  skeletonContainer: {
    flex: 1,
    padding: 20,
  },
  skeletonProfile: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  skeletonCourses: {
    flex: 1,
  },
  skeletonBase: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default AccountScreen;
