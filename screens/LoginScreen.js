import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.0.102:8082/api/users/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      // Navigate user based on their role
      if (user.role === 'parent') {
        navigation.replace('ParentScreen', { user, token });
      } else if (user.role === 'teacher') {
        navigation.replace('TeacherScreen', { user, token });
      } else {
        ToastAndroid.show('Invalid user role', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Login failed. Please try again.', ToastAndroid.SHORT);
      console.error('Login error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;


// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   console.log("dsrtf");
  
//   const handleLogin = async () => {
//     if (!email || !password) {
//       Toast.show({
//         type: 'error',
//         text1: 'Validation Error',
//         text2: 'All fields are required',
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post('http://192.168.0.102:8082/api/users/login', {
//         email,
//         password,
//       });

//       const { token, user } = response.data;

//       Toast.show({
//         type: 'success',
//         text1: 'Login Successful',
//         text2: `Welcome back, ${user.name}!`,
//       });

//       setLoading(false);

//       // Navigate to Home Screen
//       navigation.navigate('Home', { user, token });
//     } catch (error) {
//       setLoading(false);

//       // Determine error message
//       const errorMessage =
//         error.response?.data?.message || 'An error occurred. Please try again.';

//       // Log the error for debugging
//       console.error('Login error:', error);

//       // Display error message as a toast
//       Toast.show({
//         type: 'error',
//         text1: 'Login Failed',
//         text2: errorMessage,
//       });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//       </TouchableOpacity>

//       {/* Toast Component */}
//       <Toast position="top" visibilityTime={3000} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 32,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'All fields are required');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post('http://192.168.0.102:8082/api/users/login', {
//         email,
//         password,
//       });

//       const { token, user } = response.data;

//       Alert.alert('Success', `Welcome ${user.name}`);
//       setLoading(false);

//       // Navigate based on user role
//       if (user.role === 'teacher') {
//         navigation.navigate('TeacherScreen', { user, token });
//       } else if (user.role === 'parent') {
//         navigation.navigate('ParentScreen', { user, token });
//       } else {
//         Alert.alert('Error', 'Unrecognized role. Please contact support.');
//       }
//     } catch (error) {
//       setLoading(false);
//       const errorMessage =
//         error.response?.data?.message || 'An error occurred. Please try again.';
//       Alert.alert('Login Failed', errorMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 32,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'All fields are required');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post('http://192.168.0.102:8081/api/users/login', {
//         email,
//         password,
//       });

//       const { token, user } = response.data;
//       Alert.alert('Success', `Welcome ${user.name}`);
//       setLoading(false);

//       // Navigate to Home Screen
//       navigation.navigate('Home', { user, token });
//     } catch (error) {
//       setLoading(false);
//       const errorMessage =
//         error.response?.data?.message || 'An error occurred. Please try again.';
//       Alert.alert('Login Failed', errorMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 32,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;
