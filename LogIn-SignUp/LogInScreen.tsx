import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LogInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wrongPassword,setWrongPassword] = useState(false);
  
  const handleLogin = async () => {
    // Here will be the server connection that checks if user's log in and password match if not then, we can print a label or alert
    console.log(email,password);
    const userData ={
      email:email,
      password:password,
      webkey: await AsyncStorage.getItem('WebSocketKey'),
    }
    setWrongPassword(false);
    axios.post("http:.../login",userData).then(res =>{
      console.log("here");
      console.log(res.data);
      if(res.data.status == "OK"){
        Alert.alert("Log in successful!");
        AsyncStorage.setItem("token",res.data.data);
        AsyncStorage.setItem('isLogged', 'Home');
        console.log("here2");
        navigation.navigate('Home' as never);
      } else if(res.data.status == "WPASS"){
        setWrongPassword(true);
      }else {
        Alert.alert(JSON.stringify(res.data.data));
      }
    })
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleForgotPassword = () => {
    // Handle the "Forgot My Password" action here
    // For example, you could navigate to a screen for password recovery
    console.log('Forgot My Password clicked');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Image source={require('../images/left-icon.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>Log In</Text>
      {/*add an image here */}
      <TextInput style={styles.input} placeholder="email address" value={email}
        onChangeText={(text) => {
          setEmail(text);
        }} />

      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password}
        onChangeText={(text) => {
          setWrongPassword(false);
          setPassword(text);
        }} />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      {wrongPassword && password != "" && (
        <Text style={styles.errorMessage}>Passwords is incorrect.</Text> 
      )}
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginButton}>{'                      '}Log In{'                      '}</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
        <Text style={{ color: '#fff', fontSize: 14, marginRight: 5 }}>
        Don't have an account?
        </Text>
        
            <TouchableOpacity onPress={() => navigation.navigate('Signup'as never)}>
            <Text style={{ color: '#FFD700', fontSize: 14, textDecorationLine: 'underline' }}>
                Sign up
            </Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001F3F', 
  },
  title: {
    fontSize: 40,
    color: '#fff', // White color
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  forgotPassword: {
    color: '#FFD700', // Yellow color
    fontSize: 12,
    marginBottom: 20,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
  },
  loginButton: {
    fontSize: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFD700', // Yellow background
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    color: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#001F3F', // Dark Blue background
    borderRadius: 20,
    padding: 10,
  },
  backIcon: {
    width: 40,
    height: 40,
    tintColor: '#FFD700', // Yellow tint
  },
});

export default LogInScreen;