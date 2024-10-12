import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YourComponent = () => {
  const navigation = useNavigation();
  const userProfilePicture = require("../images/user-icon.png")
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState<any>(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post("http:.../search", { searchQuery: searchQuery });
      console.log('Response Data:', response.data.data); // Log response data
        if(response.data.status != "OK"){
            Alert.alert(response.data.data);
        } else {
            setUserData(response.data.data);
        }   
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAddFriend = async () => {
    if(userData != null){
        const adder = await AsyncStorage.getItem('current-username');
        if(adder == userData.username){
            return Alert.alert("The same username!");
        }
        try {
            const response = await axios.post("http.../add-friend", { friendlyUsername: userData.username, adder:adder});
            Alert.alert(response.data.data);   
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
  }
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => { navigation.navigate('Home' as never); }}>
        <Image source={require('../images/left-icon.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>
      {userData != null && (
        <View style={styles.userDataContainer}>
          <Image source={userProfilePicture} style={styles.modalProfilePicture} />
          <Text style={styles.userInfoText}>{userData?.username}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => {
            handleAddFriend();
          }}>
            <Text style={styles.buttonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#001F3F',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backIcon: {
    width: 40,
    height: 40,
    tintColor: '#FFD700',
  },
  searchContainer: {
    alignItems: 'center', // Center the search container horizontally
    left:20,
  },
  searchBar: {
    height: 40,
    width: '80%', // Adjusted width to leave space for the search button
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginRight: 10, // Added margin to separate the search button
  },
  searchButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  searchButtonText: {
    fontSize: 16,
    color: '#000',
  },
  userDataContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  modalProfilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    tintColor: '#fff',
  },
  userInfoText: {
    fontSize: 16,
    marginTop: 10,
    color: '#fff',
    
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default YourComponent;
