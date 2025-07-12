


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   Image
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import { useNavigation } from '@react-navigation/native';

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginError, setLoginError] = useState('');

//   const handleChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (loginError) setLoginError('');
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('http://192.168.42.158:5000/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           p_id: formData.username,
//           p_password: formData.password
//         })
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         Alert.alert('Login Success', 'Redirecting to dashboard...');
//         navigation.navigate('ViolationManagement');
//       } else {
//         throw new Error(data.message || 'Login failed');
//       }
//     } catch (err) {
//       setLoginError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.select({ ios: 'padding', android: null })}
//     >
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../assets/police.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>

//       <Text style={styles.title}>Traffic Violation Detection</Text>
//       <Text style={styles.subtitle}>Secure access for authorized personnel</Text>

//       {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

//       <View style={styles.inputGroup}>
//         <Icon name="user" size={20} color="#555" style={styles.icon} />
//         <TextInput
//           placeholder="Username"
//           style={styles.input}
//           value={formData.username}
//           onChangeText={(text) => handleChange('username', text)}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Icon name="lock" size={20} color="#555" style={styles.icon} />
//         <TextInput
//           placeholder="Password"
//           style={styles.input}
//           secureTextEntry={!showPassword}
//           value={formData.password}
//           onChangeText={(text) => handleChange('password', text)}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Icon
//             name={showPassword ? 'eye-off' : 'eye'}
//             size={20}
//             color="#555"
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={[styles.button, isLoading && { opacity: 0.6 }]}
//         onPress={handleSubmit}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Sign In</Text>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.footerText}>© {new Date().getFullYear()} Traffic Monitoring Authority</Text>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0b2b4c',
//     padding: 20,
//     justifyContent: 'center'
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//   },
//   title: {
//     fontSize: 24,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center'
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#ddd',
//     textAlign: 'center',
//     marginBottom: 30
//   },
//   inputGroup: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     paddingHorizontal: 10,
//     marginBottom: 12
//   },
//   icon: {
//     marginRight: 8
//   },
//   input: {
//     flex: 1,
//     height: 45
//   },
//   button: {
//     backgroundColor: '#2563eb',
//     paddingVertical: 12,
//     borderRadius: 6,
//     marginTop: 10,
//     alignItems: 'center'
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600'
//   },
//   errorText: {
//     color: '#ff6b6b',
//     marginBottom: 10,
//     fontSize: 12,
//     textAlign: 'center'
//   },
//   footerText: {
//     marginTop: 30,
//     textAlign: 'center',
//     fontSize: 12,
//     color: '#aaa'
//   }
// });

// export default LoginScreen;







// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import { useNavigation } from '@react-navigation/native';

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginError, setLoginError] = useState('');

//   const handleChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (loginError) setLoginError('');
//   };

//   const handleSubmit = async () => {
//     if (!formData.username || !formData.password) {
//       setLoginError('Please enter ID and password');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // const response = await fetch('http://192.168.119.116:5000/api/login', {
//             const response = await fetch('http://192.168.42.158:5000/api/login', {

//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert('Login Success', `Welcome Officer ${data.user.p_id}`);
//         // ✅ Pass policeId to next screen
//         navigation.navigate('ViolationManagement', { policeId: data.user.p_id });
//       } else {
//         throw new Error(data.message || 'Login failed');
//       }
//     } catch (err) {
//       setLoginError(err.message || 'Login failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.select({ ios: 'padding', android: null })}
//     >
//       <Text style={styles.title}>Traffic Violation Detection</Text>
//       <Text style={styles.subtitle}>Secure access for authorized personnel</Text>

//       {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

//       <View style={styles.inputGroup}>
//         <Icon name="user" size={20} color="#555" style={styles.icon} />
//         <TextInput
//           placeholder="Police ID"
//           style={styles.input}
//           value={formData.username}
//           onChangeText={(text) => handleChange('username', text)}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Icon name="lock" size={20} color="#555" style={styles.icon} />
//         <TextInput
//           placeholder="Password"
//           style={styles.input}
//           secureTextEntry={!showPassword}
//           value={formData.password}
//           onChangeText={(text) => handleChange('password', text)}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Icon
//             name={showPassword ? 'eye-off' : 'eye'}
//             size={20}
//             color="#555"
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={[styles.button, isLoading && { opacity: 0.6 }]}
//         onPress={handleSubmit}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Sign In</Text>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.footerText}>© {new Date().getFullYear()} Traffic Monitoring Authority</Text>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0b2b4c',
//     padding: 20,
//     justifyContent: 'center'
//   },
//   title: {
//     fontSize: 24,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center'
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#ddd',
//     textAlign: 'center',
//     marginBottom: 30
//   },
//   inputGroup: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     paddingHorizontal: 10,
//     marginBottom: 12
//   },
//   icon: {
//     marginRight: 8
//   },
//   input: {
//     flex: 1,
//     height: 45
//   },
//   button: {
//     backgroundColor: '#2563eb',
//     paddingVertical: 12,
//     borderRadius: 6,
//     marginTop: 10,
//     alignItems: 'center'
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600'
//   },
//   errorText: {
//     color: '#ff6b6b',
//     marginBottom: 10,
//     fontSize: 12
//   },
//   footerText: {
//     marginTop: 30,
//     textAlign: 'center',
//     fontSize: 12,
//     color: '#aaa'
//   }
// });

// export default LoginScreen;








import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image // ✅ Added for logo
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (loginError) setLoginError('');
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setLoginError('Please enter ID and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.42.158:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Login Success', `Welcome Officer ${data.user.p_id}`);
        navigation.navigate('ViolationManagement', { policeId: data.user.p_id });
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: null })}
    >
      {/* ✅ Logo inserted here */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/police.png')} // update path if needed
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Traffic Violation Detection</Text>
      <Text style={styles.subtitle}>Secure access for authorized personnel</Text>

      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

      <View style={styles.inputGroup}>
        <Icon name="user" size={20} color="#555" style={styles.icon} />
        <TextInput
          placeholder="Police ID"
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} color="#555" style={styles.icon} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>© {new Date().getFullYear()} Traffic Monitoring Authority</Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b2b4c',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 30
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    height: 45,
    minWidth: 0,
    flexShrink: 1
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
    fontSize: 12,
    textAlign: 'center'
  },
  footerText: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#aaa'
  }
});

export default LoginScreen;



