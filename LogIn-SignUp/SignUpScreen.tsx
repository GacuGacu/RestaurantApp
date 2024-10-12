import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailVerify,setEmailVerify] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  //Server API handle sign up
  const handleSignUp = () => {
    if(email == "" || password == "" || username == ""){
      Alert.alert("Please fill in mandatory fields!");
      return; // if the fields are empty we can't allow the user to go further
    }
    // Check if passwords match
    if (password === confirmPassword) {
      setPasswordsMatch(true);
      //call the server api and creata a user 
      const userData = {
        username: username,
        email, 
        password,
        friends:[],
        currentRequests: [],
      };
      console.log(userData);
      axios.post("http:.../register",userData).then((res) =>{//request to the local server to get your IP use iconfig on mac
        console.log(res.data);

        if(res.data.status == "OK"){ //success
          Alert.alert("Registration succesful");
          navigation.navigate('Login' as never);
        } else {
          Alert.alert(JSON.stringify(res.data.data)); //failure, on the server side the errors are defined as sentences
        }
        
      }).catch((e) =>{
        console.log(e); //potential errors.
      });
    } else {
      setPasswordsMatch(false); //reset the password match variable
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Image source={require('../images/left-icon.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>Sign Up</Text>
      {/*add an image here */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          const emailVerify = text;
          setEmail(text);
          setEmailVerify(false);
          if(/^[\w.%+-]+@[\w.-]+\.[a-zA-z]{2,}$/.test(emailVerify)){
            setEmail(emailVerify);
            setEmailVerify(true);
          }
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      {!passwordsMatch && (
        <Text style={styles.errorMessage}>Passwords do not match. Please try again.</Text> // here we will also handle if username or email is already taken
      )}
      {!emailVerify && email != "" && (
        <Text style={styles.errorMessage}>The email provided is invalid.</Text>
      )}
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signUpButton}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001F3F', // Dark Blue background
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
  errorMessage: {
    color: 'red',
    marginBottom: 20,
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
  signUpButton: {
    fontSize: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFD700', // Yellow background
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    color: '#000',
  },
});

export default SignUpScreen;
