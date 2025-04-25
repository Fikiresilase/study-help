import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import apiClient from '../services/apiClient';
import ProgressBar from '../components/ProgressBar';
import NoteSection from '../components/NoteSection';
import Card from '../components/Card';
import AppCodeEditor from '../components/AppCodeEditor';
import AppButton from '../components/AppButton';
import AuthContext from '../auth/authContext';
import useProgress from '../hooks/useProgress';
import useLesson from '../hooks/useLesson';
import color from '../config/color';

const SkeletonLoader = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonProgressContainer}>
      <View style={[styles.skeletonBase, { width: 300, height: 20 }]} />
    </View>
    <View style={styles.skeletonCard}>
      <View style={[styles.skeletonBase, { width: 200, height: 20, marginBottom: 15 }]} />
      <View style={[styles.skeletonBase, { width: '100%', height: 16, marginBottom: 10 }]} />
      <View style={[styles.skeletonBase, { width: '100%', height: 16, marginBottom: 10 }]} />
      <View style={[styles.skeletonBase, { width: '80%', height: 16 }]} />
    </View>
    <View style={styles.skeletonNote}>
      <View style={[styles.skeletonBase, { width: '90%', height: 14 }]} />
    </View>
  </View>
);

function LearnScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [myProgress, setMyProgress] = useState();
  const userId = user?.id;
  const courseId = route.params?.courseId;
  const { progress, track, loading: progressLoading, error: progressError } = useProgress(route);
  const { lessonTitle, content, codeExample, quizQuestion, shortNotice, loading: lessonLoading, error: lessonError, setError } = useLesson(route);

 

  const handleContinue = async () => {
    try {
      if (!userId) throw new Error('User not authenticated');
      if (!courseId) throw new Error('Missing courseId');
      if (!quizQuestion) throw new Error('No quiz question available');
      console.log('Posting completion:', { userID: userId, courseId, track });

      await apiClient.put('/user/course/completedLesson', {
        userID: userId,
        courseId,
        track: track || 0,
      });

      console.log('Navigating to Quiz:', { quizQuestion, courseId });
      navigation.navigate('Quiz', { quizQuestion, courseId , progress });
    } catch (err) {
      console.error('Error in handleContinue:', err.message);
      setError('Failed to proceed to quiz. Please try again.');
    }
  };

  if (!courseId || !userId) {
    console.log('Invalid params:', { courseId, userId });
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {courseId ? 'User not authenticated' : 'No course ID provided'}
        </Text>
      </View>
    );
  }

  const isLoading = progressLoading || lessonLoading;
  const error = progressError || lessonError;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonLoader />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={typeof progress === 'number' && !isNaN(progress) ? myProgress : 0} />
        </View>
        <Card style={styles.card} title={lessonTitle}>
          <Text style={styles.contentText}>{content}</Text>
        </Card>
        {codeExample ? <AppCodeEditor code={codeExample} style={styles.codeEditor} /> : null}
        <NoteSection>
          <Text>
            {typeof shortNotice === 'string' && shortNotice ? shortNotice : 'No notice available'}
          </Text>
        </NoteSection>
        <AppButton onPress={handleContinue} label="Continue" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  progressContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  skeletonContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  skeletonProgressContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  skeletonCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  skeletonNote: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  codeEditor: {
    flex: 1,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  skeletonBase: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default LearnScreen;