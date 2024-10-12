import { View, Text } from 'react-native'
import React from 'react'

//This is the Like / Dislike displaying view 
const ChosenCard = ({type}:any) => {
  return (
    <View>
      <Text style={{
        color: type === 'Yes' ? '#00CC00' : '#CC0000',
        fontSize:40,
        borderWidth:4,
        borderColor: type === 'Yes' ? '#00CC00' : '#CC0000',
        paddingLeft:10,
        paddingRight:10}}>{type}</Text>
    </View>
  )
}

export default ChosenCard