import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';

const IconContainer = () => {
  const [expanded, setExpanded] = useState(false);

  // Shared values for animation
  const width = useSharedValue(60);
  const height = useSharedValue(60);
  const borderRadius = useSharedValue(30);

  // Positions for icons
  const iconPositions = useSharedValue([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);

  // Toggle the expansion and contraction
  const handlePress = () => {
    if (expanded) {
      width.value = withSpring(60);
      height.value = withSpring(60);
      borderRadius.value = withSpring(30);
      iconPositions.value = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
    } else {
      width.value = withSpring(180);
      height.value = withSpring(60);
      borderRadius.value = withSpring(20);
      iconPositions.value = [
        { x: -50, y: 0 },
        { x: 50, y: 0 },
        { x: -100, y: 0 },
        { x: 100, y: 0 },
      ];
    }
    setExpanded(!expanded);
  };

  // Animated style for the container
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      borderRadius: borderRadius.value,
    };
  });

  // Animated styles for each icon
  const animatedIconStyles = iconPositions.value.map((position, index) =>
      useAnimatedStyle(() => {
        return {
          transform: [
            { translateX: withSpring(position.x) },
            { translateY: withSpring(position.y) },
          ],
          opacity: expanded ? withSpring(1) : withSpring(0),
        };
      })
  );

  return (
      <View style={styles.container}>
        <Animated.View style={[styles.animatedContainer, animatedContainerStyle]}>
          <TouchableOpacity onPress={handlePress} style={styles.centerButton}>
            <Icon name="ellipsis-h" size={30} color="#fff" />
          </TouchableOpacity>
          <Animated.View style={[styles.icon, animatedIconStyles[0]]}>
            <Icon name="google" size={30} color="#fff" />
          </Animated.View>
          <Animated.View style={[styles.icon, animatedIconStyles[1]]}>
            <Icon name="facebook" size={30} color="#fff" />
          </Animated.View>
          <Animated.View style={[styles.icon, animatedIconStyles[2]]}>
            <Icon name="twitter" size={30} color="#fff" />
          </Animated.View>
          <Animated.View style={[styles.icon, animatedIconStyles[3]]}>
            <Icon name="instagram" size={30} color="#fff" />
          </Animated.View>
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
  animatedContainer: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
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
