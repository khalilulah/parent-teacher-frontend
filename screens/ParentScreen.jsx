import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ParentScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Parent!</Text>
      <Text style={styles.text}>Here you can view updates about your child's performance, activities, and more.</Text>

      <Button
        title="Go to Messages"
        onPress={() => navigation.navigate('Messages')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default ParentScreen;
