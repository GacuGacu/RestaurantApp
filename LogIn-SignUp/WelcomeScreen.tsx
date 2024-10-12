import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';



const WelcomeScreen = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView style={{ backgroundColor: '#001F3F', flex: 1, justifyContent: 'space-between', padding: 20,}}>
    <Text style={{ color: '#fff', fontSize: 40, textAlign: 'center' ,top:40 }}>
        Let's get started!
    </Text>
    <Image source={require('../images/welcome-image.png')} style={{width:350, height:350}}/>
    <View style={{justifyContent: 'center', alignItems: 'center' }}>
    <TouchableOpacity onPress={() => navigation.navigate('Signup' as never)}>
        <Text style={{alignSelf: 'center', color: '#000', fontSize: 20, padding: 15, borderRadius: 10, backgroundColor: '#FFD700', textAlign: 'center' }}>
            {'                     '}Sign Up{'                     '}
        </Text>
    </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
        <Text style={{ color: '#fff', fontSize: 14, marginRight: 5 }}>
        Already a user?
        </Text>
        
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={{ color: '#FFD700', fontSize: 14, textDecorationLine: 'underline' }}>
                Log In
            </Text>
            </TouchableOpacity>
        </View>
    </View>
    </SafeAreaView>




  );
}


export default WelcomeScreen;
