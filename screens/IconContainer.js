import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';

const IconContainer = () => {
  const [expanded, setExpanded] = useState(false);

  // Shared values for animation
  const icon1Pos = useSharedValue(0);
  const icon1PosX = useSharedValue(0);

  const icon2Pos = useSharedValue(0);
  const icon2PosX = useSharedValue(0);

  const icon3Pos = useSharedValue(0);
  const icon3PosX = useSharedValue(0);



  // Toggle the expansion and contraction
  const handlePress = () => {
    if (expanded) {
      icon1Pos.value = withSpring(0, { damping: 10, stiffness: 100 });
      icon1PosX.value = withSpring(0, { damping: 10, stiffness: 100 });

      icon2Pos.value = withSpring(0, { damping: 10, stiffness: 100 });
      icon2PosX.value = withSpring(0, { damping: 10, stiffness: 100 });

      icon3Pos.value = withSpring(0, { damping: 10, stiffness: 100 });
      icon3PosX.value = withSpring(0, { damping: 10, stiffness: 100 });
    } else {
      icon1Pos.value = withSpring(90, { damping: 10, stiffness: 100 }); // Move up-left
      icon1PosX.value = withSpring(0, { damping: 10, stiffness: 100 }); // Move up-left

      icon2Pos.value = withSpring(90, { damping: 10, stiffness: 100 }); // Move up
      icon2PosX.value = withSpring(-90, { damping: 10, stiffness: 100 }); // Move up

      icon3Pos.value = withSpring(0, { damping: 10, stiffness: 100 });   // Center
      icon3PosX.value = withSpring(-90, { damping: 10, stiffness: 100 });   // Center

    }
    setExpanded(!expanded);
  };

  // Animated styles for each icon
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: icon1PosX.value }, { translateY: -icon1Pos.value }],
    };
  });
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -icon2Pos.value },{translateX:icon2PosX.value}],
    };
  });
  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -icon3Pos.value },{translateX:icon3PosX.value}],
    };
  });
  

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <TouchableOpacity onPress={handlePress} style={styles.centerButton}>
          <Icon name="location-arrow" size={30} color="#fff"/>
        </TouchableOpacity>
        <Animated.View style={[styles.icon, animatedStyle1]}>
          <Icon name="google" size={30} color="#fff" />
        </Animated.View>
        <Animated.View style={[styles.icon, animatedStyle2]}>
          <Icon name="facebook" size={30} color="#fff" />
        </Animated.View>
        <Animated.View style={[styles.icon, animatedStyle3]}>
          <Icon name="twitter" size={30} color="#fff" />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    left:30,
    top:30,
    borderRadius: 30,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    transform: [{ rotate: '-90deg' }],  // Rotate 180 degrees to the left
  },
  icon: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});

export default IconContainer;
