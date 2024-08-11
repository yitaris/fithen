import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const Finishbutton = ({ percentage, scrollTo ,handleShowSignUp}) => {
  const size = 128;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  const heartAnim = useRef(new Animated.Value(1)).current;

  const anim = (toValue) => {
    return Animated.timing(progressAnim, {
      toValue,
      duration: 250,
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    anim(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnim.addListener((value) => {
      const strokeDashoffset = circumference - (circumference * value.value) / 100;

      if (progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset
        });
      }
    });

    return () => {
      progressAnim.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, {
          toValue: 1.03,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(heartAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: heartAnim }]}}>
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: heartAnim }] }]}>
        <TouchableOpacity onPress={handleShowSignUp} style={styles.button} activeOpacity={0.6}>
          <Text style={styles.buttonText}>Sign Up </Text>
          <Icon name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 20,
    width:200
  },
  button: {
    padding: 20,
    flexDirection:'row',
    justifyContent:'space-between',
  },
  buttonText: {
    fontWeight: '800',
    color: '#Fff',
    fontSize: 20,
  }
});

export default Finishbutton;
