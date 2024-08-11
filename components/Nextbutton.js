import React,{useEffect, useRef,useState} from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Animated } from 'react-native';
import Svg, {G,Circle} from 'react-native-svg'
import { AntDesign } from '@expo/vector-icons';

const Nextbutton = ({percentage,scrollTo}) => {

    const size = 128;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2-strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
  
    const progressAnim = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);

    const anim = (toValue) => {

        return Animated.timing(progressAnim, {
            toValue,
            duration:250,
            useNativeDriver:true
        }).start()
    }

    useEffect(()=>{
        anim(percentage);
    },[percentage])

    useEffect(()=>{
        progressAnim.addListener((value) => {
            const strokeDashoffset = circumference - (circumference * value.value) / 100;
        
            if (progressRef?.current){
                progressRef.current.setNativeProps({
                    strokeDashoffset
                })
            }
        },[percentage])

        return () => {
            progressAnim.removeAllListeners();
        }
    },[])
  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation={"-90"} origin={center}>
        <Circle stroke={"transparent"}
         cx={center}
         cy={center}
         r={radius}
         strokeWidth={strokeWidth}
        />
        <Circle 
        ref={progressRef}
        fill={'red'}
        stroke={"white"}
         cx={center}
         cy={center}
         r={radius} 
         strokeWidth={strokeWidth}
         strokeDasharray={circumference}
        />
        </G>
      </Svg>

      <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={0.6}>
        
          <AntDesign name="arrowright" size={32} color="white" />

      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  button:{
    position:'absolute',
    backgroundColor:'transparent',
    borderRadius:100,
    padding:20
  }
});

export default Nextbutton;