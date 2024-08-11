import React, {useState,useRef,useEffect} from 'react'
import { StyleSheet,View,TouchableOpacity,TextInput,Text,Dimensions,Image,FlatList,useWindowDimensions } from 'react-native' 

const Onboardingitem = ({item}) => {
  
const  {width} = useWindowDimensions();

  return(
   <View style={[styles.container,{width}]}>
        <Image source={item.image} style={[styles.image,{width,resizeMode:'cover'}]}/>
        <View style={{flex:0.3}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.descrip}>{item.descrip}</Text>
        </View>
   </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:10
    },
    image:{
        flex:0.7,
        justifyContent:'center',
    },
    title:{
        fontWeight:'800',
        fontSize:28,
        color:'red',
        marginBottom:10,
        textAlign:'center',

    },
    descrip:{
       fontWeight:'300',
        color:'rgba(255,255,255,0.6)',
        paddingHorizontal:64,
        textAlign:'center',
    },
})
export default Onboardingitem;
