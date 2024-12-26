import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TeacherScreen from './screens/TeacherScreen';
import LoginScreen from './screens/LoginScreen';
import ParentScreen from './screens/ParentScreen';
import HomeScreen from './screens/HomeScreen';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TeacherScreen" component={TeacherScreen} />
        <Stack.Screen name="ParentScreen" component={ParentScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
     <Toast 
      position="top"
  visibilityTime={3000}
  autoHide={true}
  topOffset={50}
  bottomOffset={40}
     />
     </>
  );
};

export default App;


