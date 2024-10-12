import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';


const HomeScreen = () => {
  //user info modal
  const [isModalVisible, setModalVisible] = useState<any>(false);
  const [userData, setUserData] = useState<any>(null);
  const userProfilePicture = require("../images/user-icon.png");
  const bellpicture = require("../images/bell.png");
  const navigation = useNavigation<any>();

  //Friends array modal
  const [modalVisible, setModalFriendsVisible] = useState<boolean>(false);
  const [requestsContent, setRequestsContent] = useState<any>([]);
  const [hiddenUsernames, setHiddenUsernames] = useState<any>([]);

  //Friends to choose with
  const [checkedItems, setCheckedItems] = useState<any>([]);

  let previousValue = 'false';
  let variable = 'false'

  const getUpdate = async() => {
    const value = await AsyncStorage.getItem('updatedInfo');
    console.log(value);
    variable = value;
  }
 
  function checkForUpdate() { // this function allows to constantly check for updates when the user is checking the app. Very usefull for the game making.
    // Check if variable has been updated
    getUpdate();
    if (variable !== previousValue) {
      previousValue = variable; 
      AsyncStorage.setItem('updatedInfo','false');
      fetchData();
    } 
  }

  const intervalId = setInterval(checkForUpdate, 5000);//checks interval and updates the home screen every 5s

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      //my IP :192.168.2.7
      //EMMA IP: 192.168.178.242
      const response = await axios.post("http.../user-data", { token });
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleSignOut = () => {
    AsyncStorage.setItem('isLogged', 'Welcome');
    navigation.navigate('Welcome' as never);
  }
  const deleteAccount = async () => {
    if(userData!= null){
      
      const response = await axios.post("http://192.168.2.7:5001/delete-account", { me: userData.username });
      console.log(response.data);
      
    }
  }
  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel pressed')
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            console.log('OK pressed');
            deleteAccount();
            navigation.navigate('Welcome' as never);
          },
        },
      ],
      { cancelable: false } // Prevents tapping outside the alert to dismiss it
    );
  }

  useEffect(() => {
    const fetchDataAndFriends = async () => {
      try {
        const data = await fetchData(); // Assuming fetchData returns userData
        if (data != null) {
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchDataAndFriends();
  }, []);

  const handleAddFriends = () => {
    if(userData != null){
      AsyncStorage.setItem('current-username', userData.username );
    }
    navigation.navigate("SearchScreen" as never);
  }

  const handleBellButtonClick = () => {
    setModalFriendsVisible(true);
    // Assuming currentRequests is an array of strings
    if(userData != null){
      setRequestsContent(userData.currentRequests);
    } 
  };

  const handleCloseModal = () => {
    fetchData();
    setModalFriendsVisible(false);
  };

  const handleAccept = async (friend:String) => {
    console.log("accepted");
    if(userData != null){
    const response = await axios.post("https.../accept-friend", {me: userData.username, friend: friend});
    console.log(response.data);
    setHiddenUsernames([...hiddenUsernames, friend]);
    }
  }
  const handleReject = async (friend:string) => {
    console.log("rejected");
    if(userData != null){
      console.log(userData.username);
      
      const response = await axios.post("https.../reject-friend", {me: userData.username, friend: friend});
      console.log(response.data);
    setHiddenUsernames([...hiddenUsernames, friend]);
    }
  }

  //Checkbox functions
  const handleCheckboxChange = (username: String) => {
    console.log("Checked items before:", checkedItems);
    
    var newItems = checkedItems;
    if (!checkedItems.find((user:String) => user === username)) {
      newItems = [...checkedItems, username];
    } else {
      newItems = checkedItems.filter((item:String) => item !== username);
    }
    console.log("Checked items after:", newItems)
    setCheckedItems(newItems);
  };
  //handle the table render
  const renderUserItem = (user:String, index:any) => {
    return (
      <View key={index} style={styles.userItem}>
        <Text style={{color:'#FFFFFF', fontSize:20}}>{user}</Text>
        <CheckBox
            onPress={() => {
              handleCheckboxChange(user)
              console.log(checkedItems);
            }}
            checked={checkedItems.includes(user)}
            
            containerStyle={styles.checkboxContainer}
            checkedIcon={ <Image source={require('../images/right-icon.png')} style={[{height:25,width:30, tintColor:'#FFD700' }]} />}
            uncheckedIcon={<Image source={require('../images/right-icon.png')} style={[{height:25, width:30,tintColor:'#FFFFFF' }]} />}
            textStyle={styles.checkboxText}
            checkedColor="#FFD700"
          />
        
      </View>
    );
  };

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileButton} onPress={toggleModal}>
        <Image source={userProfilePicture} style={styles.profilePicture} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.bellButton} onPress={handleBellButtonClick}>
        <Image source={bellpicture} style={styles.bellPicture} />
        { userData != null && userData.currentRequests.length > 0 && (
          <View style={styles.redDot}></View>
        )}
      </TouchableOpacity>
        <>
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity style={styles.overlay} onPress={handleCloseModal}>
          <View style={{height: '50%',width:'50%',top: -170, right:-60, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius:7}}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Friend Requests</Text>
                {requestsContent.map((request:any, index:any) => (
                  <View key={index} style={styles.requestContainer}>
                    
                    <View style={styles.buttonsContainer}>
                    {!hiddenUsernames.includes(request) && (
                      <TouchableOpacity style={styles.yesButton} onPress={() => {
                        handleAccept(request);
                      }}>
                        <Image source={require("../images/heart.png")} style={styles.yesPicture}/>
                      </TouchableOpacity>
                      )}
                      {!hiddenUsernames.includes(request) && (
                      <TouchableOpacity style={styles.noButton} onPress={() => {
                        handleReject(request);
                      }}>
                      <Image source={require("../images/cancel.png")} style={styles.noPicture}/>
                      </TouchableOpacity>
                      )}
                    </View>
                    {!hiddenUsernames.includes(request) && (
                      <Text style={styles.requestText}>{request}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
      </Modal>
      </>

      <Text style={styles.title}>Welcome!</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => {
        handleAddFriends();
      }}>
        <Text style={styles.buttonText}>Add Friends</Text>
      </TouchableOpacity>

      <View style={styles.userList}>
        {userData.friends.map((user:any, index:any) => renderUserItem(user, index))}
      </View>

      <View style={{
        width: '100%',
        height: 100,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center',
        left:14
      }}>
        <TouchableOpacity style={{
          width: 60,
          height: 60,
          backgroundColor: '#fff',
          elevation: 5,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={() => { console.log("Started the finding process"); navigation.navigate("SetUpFinderScreen",{checkedFriends:checkedItems}); }}>
          <Image source={require("../images/cancel.png")} style={{ width: 34, height: 34, transform: [{ rotate: '45deg' }], tintColor: 'green' }} />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Image source={require('../images/left-icon.png')} style={styles.backIcon} />
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <Image source={userProfilePicture} style={styles.modalProfilePicture} />
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.modalButtonEditText}>Edit Profile Picture</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{userData?.username}</Text>
            <Text style={styles.userInfoText}>{userData?.email}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleSignOut}>
              <Text style={styles.modalButtonText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.modalButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/*modal responsible for the user view information*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#001F3F',
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  bellButton: {
    position: 'absolute',
    top: 20,
    right: 70,
  },
  redDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 15,
    height: 15,
    borderRadius: 7,
    backgroundColor: 'red',
  },  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent black color
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    tintColor: '#fff',
  },
  bellPicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    tintColor: '#fff',
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalProfilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    tintColor: '#fff',
  },
  modalContent: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  userInfoText: {
    fontSize: 16,
    marginTop: 10,
    color: '#fff',
  },
  modalButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    marginTop: 20,
    padding: 10,
  },
  editProfileButton: {
    marginTop: 10,
  },
  modalButtonEditText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
  },
  modalButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  requestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  yesButton: {
    padding: 10,
    marginRight: 5,
    left:70
  },
  noButton: {
    padding: 10,
    left:60
  },
  requestText: {
    color: 'white',
    fontSize: 20,
    right: 120,
    top: 5, 
  },
  yesPicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    tintColor: 'green',
  },
  noPicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    tintColor: 'red',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  userList: {
    paddingHorizontal: 16, // Adjust horizontal padding as needed
    paddingVertical: 8, // Adjust vertical padding as needed
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default HomeScreen;