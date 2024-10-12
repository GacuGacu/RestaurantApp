/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Restaurant from './RestaurantClass';
import RestaurantData from './RestaurantData';

import {
  Animated,
  Image,
  PanResponder,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Card from './Card';


function RestaurantApp(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  //
  const [data, setData] = useState([
    {image: require('../images/No_image.jpeg'), id: 1, title: 'No restaurant found'}, // an object with instance of image, id, title. To be changed later
    {image: require('../images/Res2.webp'), id:2, title:'Cool restaurant'}
  ]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const swipe = useRef(new Animated.ValueXY()).current; //Animated XY values

  //change this to make another request
  useEffect(() => {
    if(!data.length ){
      setData([
        {image: require('../images/No_image.jpeg'), id: 1, title: 'No restaurant found'}, // an object with instance of image, id, title. To be changed later
        {image: require('../images/Res2.webp'), id:2, title:'Cool restaurant'}
      ]);
    }
  },[data]) //this code resets the values in the case of API it will get more restaurants.

  const panResponder = PanResponder.create(
    {
      onMoveShouldSetPanResponder:() => true,
      onPanResponderMove:(_,{dx,dy}) =>{
        // console.log("dx"+dx+" dy"+dy);
        swipe.setValue({x:dx,y:dy}); //sets value of constant swipe. Passed to the card view this way we move only card 
        // not the whole screen
      },
      onPanResponderRelease:(_,{dx,dy}) =>{
        // console.log("released" + "dx"+dx+" dy"+dy);
        let direction = Math.sign(dx);
        let isActionActive = Math.abs(dx) > 150; // check if the dx of card is too far to right/left has been swipped
        if(isActionActive){
          Animated.timing(swipe,{
            toValue:{x:500*dx,y:dy}, //big value go away from the screen
            useNativeDriver:true,
            duration:500,
          }).start(removeCard);
        } else {
          Animated.spring(swipe,{
            toValue:{x:0,y:0}, //value 0 is the start
            useNativeDriver:true,
            friction:5,
          }).start(); //code above introduces animation which makes the card go back if it's not swiped enough to be dismissed 
        }
      }
    });
  const removeCard = useCallback(()=>{ //removes the card from the list
    setRestaurants(prepState=>prepState.slice(1));
    swipe.setValue({x:0,y:0});
  },[swipe]);

  const handleSelection = useCallback((direction:any) => {
    Animated.timing(swipe,{
      toValue:{x:direction *500,y:0}, //big value go away from the screen
      useNativeDriver:true,
      duration: 500,
    }).start(removeCard);
  },
  [removeCard]);

  //API
  const apiKey = "API KEY";
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => { //useEffect allows to decrease the API use
    const fetchData = async () => {
      try {
        const location = 'location coordinates'; // coordinates
        const radius = 10000; // in meters small distance for easier operations
        const keyword = 'restaurants';

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&key=${apiKey}`;

        const response = await fetch(url); //make request
        const result = await response.json(); // get response
        if (result.status === 'OK') {
          const formattedData = result.results.map((place:any, index:number) => new Restaurant(place, index + 1));
// format data to conform to the normal format
          setRestaurants(formattedData); // set the restaurants array to the formated
          console.log(restaurants);
        } else {
          console.error('API request failed with status:', result.status); // handle error
        }
        // Process the data as needed  
      } catch (error) {
        console.error('Error fetching data:', error); // handle error with make request
      }
    };
    fetchData();
  }, []);

  //Main screen of the swiping 
  return (
    <View style={{flex:1}}>
      {restaurants.map((restaurant, index) => {
        let isFirst = index === 0;
        let dragHandlers = isFirst ? panResponder.panHandlers : {};
        return <Card item={restaurant} isFirst={isFirst} swipe={swipe}  {...dragHandlers}  />;
      }).reverse()}
      <View style={{
        width:'100%',
        height:100,
        position:'absolute',
        bottom:0,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        }}>
        <TouchableOpacity style={{ //create circular button with X
          width:60,
          height:60,
          backgroundColor:'#fff',
          elevation:5,
          borderRadius:30,
          justifyContent:'center',
          alignItems:'center'
          }} onPress={ ()=>{
            handleSelection(-1); //handle button selection 'No'
          }}>
            <Image source={require('../images/cancel.png')} style={{width:34,height:34}}/>
        </TouchableOpacity>
        <TouchableOpacity style={{ //create circular button with a heart
          width:60,
          height:60,
          backgroundColor:'#fff',
          elevation:5,
          borderRadius:30,
          justifyContent:'center',
          alignItems:'center'
          }} onPress={ ()=>{
            handleSelection(1); //handle button selection 'Yes'
          }}>
            <Image source={require('../images/heart.png')} style={{width:40,height:40,tintColor:'#00CC00'}}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default RestaurantApp;
