import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from '../LogIn-SignUp/WelcomeScreen';
import HomeScreen from '../components/HomeScreen';
import LogInScreen from '../LogIn-SignUp/LogInScreen';
import SignUpScreen from '../LogIn-SignUp/SignUpScreen';
import RestaurantApp from './RestaurantSwipe';
import SearchScreen from './SearchScreen';
import SetUpFinderScreen from './SetUpFinderScreen';

const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Stack = createStackNavigator();
  const [start, setStart] = useState('Welcome');
  //This code is supposed to keep the user logged in for now it's not exactly working
  useLayoutEffect(() =>{
    async function getData() {
      try {
        const data = await AsyncStorage.getItem('isLogged');
        console.log(data, "This is data");
        // setStart(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
    console.log(start, "this is start");
    },[]);
    //CONNECT TO WEBSOCKET USED FOR NOTIFICATIONS AND STUFF
    useEffect(() => {
      const ws = new WebSocket('socket'); // Replace 'your-server-address' with your actual server address
  
      // Event listener for connection open
      ws.onopen = () => {
        console.log('Connected to WebSocket server');
      };
  
      // Event listener for incoming messages
      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        const parsedData = JSON.parse(event.data);
        
        if (parsedData.clientId) {
          const clientId = parsedData.clientId;
          AsyncStorage.setItem('WebSocketKey', clientId);
        } else {
          AsyncStorage.setItem('updatedInfo', 'true');
        }
      };
      
  
      // Event listener for connection close
      ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
      };
  
      // Clean up WebSocket connection on component unmount
      return () => {
        ws.close();
      };
    }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = 'Welcome' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LogInScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Swiper" component={RestaurantApp} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="SetUpFinderScreen" component={SetUpFinderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
