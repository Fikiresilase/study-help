import React from 'react';
import * as Progress from 'react-native-progress';
import { StyleSheet } from 'react-native';

const ProgressBar = ({progress}) => {
  return (
    <Progress.Bar
      progress={progress}
      width={null}
      height={10}
      color="#4CAF50"
      style={styles.progressBar}

    />
  );
};

const styles = StyleSheet.create({
  progressBar: {
    marginBottom: 20,
    marginTop: 20,
  },
});

export default ProgressBar;
