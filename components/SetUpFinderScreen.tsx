import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

const SetUpFinderScreen = () => {

    type RootStackParamList = {
        Home: { checkedFriends: [String] }; // Define the expected parameters for HomeScreen
      };

    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();

    const { checkedFriends } = route.params;
    console.log("This is the new view: ", checkedFriends); // Output: 'JohnDoe'

    const renderUserItem = (user:String, index:any) => {
        return (
          <View key={index} style={styles.userItem}>
            <Text style={{color:'#FFFFFF', fontSize:20}}>{user}</Text>
          </View>
        );
      };

      const handleCreate = () => {
        // call API sending the friends array and then the server works will create the new "Swipe"
      }; 

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => {navigation.navigate("Home" as never)}}>
            <Image source={require('../images/left-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>

    <View style={styles.userList}>
        {checkedFriends.map((user:any, index:any) => renderUserItem(user, index))}
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
        <TouchableOpacity style={styles.addButton} onPress={() => {handleCreate()}}>
            <Text style={styles.buttonText}>Create a new Swipe!</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

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
    userList: {
        paddingHorizontal: 16,
        paddingVertical: 8, 
        top: 40, //adjust later
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
      },
});

export default SetUpFinderScreen