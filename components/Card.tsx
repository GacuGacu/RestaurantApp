import {View, Text, Image, Dimensions, Animated} from 'react-native';
import React, { useCallback } from 'react';
import ChosenCard from './ChosenCard';

const {height, width} = Dimensions.get('window');//code below aligns the images and puts the behind each other
const Card = ({item, isFirst, swipe, ...rest }:any) => {
    const rotate = swipe.x.interpolate({ //this code rotates the card by 8 degrees depending on the movement to make the animation nicer
        inputRange:[-100, 0, 100],
        outputRange:['-8deg', '0deg', '8deg'],
    }); 
    const yesOpacity = swipe.x.interpolate({ //this code allows for the 'Yes' field to appear only when user swipes his/her right -->'
        inputRange:[10,100],
        outputRange:[0,1],
        extrapolate:'clamp',

    });
    const noOpacity = swipe.x.interpolate({ //this code allows for the 'No' field to appear only when user swipes his/her left <--'
        inputRange:[-100,-10],
        outputRange:[1,0],
        extrapolate:'clamp',

    });
    //Code below creates an instance of the Card view that later is plugged in to the card Display code
    const photoUrl = item.getPhotoUrl(800, 800, item.photos[0].photo_reference); //get the restaurants first picture
    const tinderSelection = useCallback(() =>{
    return (
        <>
        <Animated.View style={{
            position: 'absolute',
            top:60,
            right:20,
            opacity:noOpacity,
            transform:[{rotate:'20deg'}]
            }}>
            <ChosenCard type={'No'}/>
        </Animated.View>

        <Animated.View style={{
            position:'absolute',
            top:60,
            left:20,
            opacity:yesOpacity,
            transform:[{rotate:'-20deg'}]
            }}>
            <ChosenCard type={'Yes'}/>
        </Animated.View>
    </>
    );
},[]);
    //make the texts of info aligned
    const topMarginFirstText = 10;
    const fontSizeFirstText = 40;
    const paddingFirstText = 10;
    const borderRadiusFirstText = 10;
    return(

        <Animated.View
            style={[{
                width: width - 20, 
                height: height - 100,
                alignSelf: 'center',
                position: 'absolute',
                top: 40,
                borderRadius: 10,
                
                }, isFirst && {transform:[...swipe.getTranslateTransform(),{rotate:rotate}]}
            ]}
            {...rest}> 
            {console.log(item)}
            <Image source={{ uri: photoUrl } /*connect actual image not icon icon sucks */} style={{ width: '100%', height: '100%', borderRadius: 10 }} /> 

            <Text style={{
                position: 'absolute',
                top: topMarginFirstText,
                left: 10,
                color: '#fff',
                fontSize: fontSizeFirstText,
                backgroundColor: 'rgba(211,211,211, 0.7)',
                padding: paddingFirstText,
                borderRadius: borderRadiusFirstText,
                }}>
                {item.name} 
                
            </Text>

            <Text style={{
                position: 'absolute',
                top: topMarginFirstText + fontSizeFirstText + paddingFirstText * 4, // Set top position dynamically
                left: 10,
                color: '#fff',
                fontSize: 15,
                backgroundColor: 'rgba(211,211,211, 0.7)',
                padding: 10,
                borderRadius: 10,
                }}>
                {" Rating: " + item.rating + "\n"} {item.vicinity}
            </Text>
            {isFirst && tinderSelection()} 
        </Animated.View>
    );
};

export default Card;