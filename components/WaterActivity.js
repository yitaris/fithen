import React, { useState, useEffect, useRef } from 'react';
import { safeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const WaterActivity = () => {

    return (
        <View style={styles.container}>
          <View style={{}}>
          <Text style={{color:'#fff',fontSize:22,fontWeight:'600',marginBottom:10}}>Workout Progress</Text>
          <Text style={{color:'#fff'}}>12 Exercise left</Text>
          </View>
          <View>
          <Image
                        source={require('../image/progressicon.png')}
                        style={styles.profileImage}
                    /> 
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor:'rgba(0,0,0,0.90)',
      width:'100%',
      height:'100%',
      borderRadius:30,
      justifyContent:'space-between',
      alignItems:'center',
      flexDirection:'row',
      padding:30,
    },
    profileImage:{
      width:100,
      height:100,
      borderRadius:60,
      resizeMode:'cover'
  }
})

export default WaterActivity;