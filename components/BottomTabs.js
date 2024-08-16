import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Link,router} from "expo-router";

const BottomTabs = () => {
    const [expanded, setExpanded] = useState(false);
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Shared values for animation
    const boxWidth = useSharedValue(60);
    const borderRadius = useSharedValue(30);
    const scale = useSharedValue(1.5);
    const rotation = useSharedValue(0);
    const leftIconOffset = useSharedValue(-100);
    const leftIconOffset2 = useSharedValue(-100);
    const rightIconOffset = useSharedValue(100);
    const rightIconOffset2 = useSharedValue(100);
    const opacity = useSharedValue(0);

    // Toggle the expansion and contraction
    const handlePress = () => {
        if (expanded) {
            boxWidth.value = withSpring(60, { damping: 20, stiffness: 90 });
            borderRadius.value = withSpring(30, { damping: 20, stiffness: 90 });
            scale.value = withSpring(1.3, { damping: 20, stiffness: 90 });
            rotation.value = withSpring(0, { damping: 20, stiffness: 90 });
            leftIconOffset.value = withTiming(-100, { duration: 300 });
            leftIconOffset2.value = withTiming(-100, { duration: 300 });
            rightIconOffset.value = withTiming(100, { duration: 300 });
            rightIconOffset2.value = withTiming(100, { duration: 300 });
            opacity.value = withTiming(0, { duration: 300 });
        } else {
            boxWidth.value = withSpring(260, { damping: 20, stiffness: 90 });
            borderRadius.value = withSpring(14, { damping: 20, stiffness: 90 });
            scale.value = withSpring(1, { damping: 20, stiffness: 90 });
            rotation.value = withSpring(45, { damping: 20, stiffness: 90 });
            leftIconOffset.value = withTiming(-50, { duration: 300 });
            leftIconOffset2.value = withTiming(-100, { duration: 300 });
            rightIconOffset.value = withTiming(50, { duration: 300 });
            rightIconOffset2.value = withTiming(100, { duration: 300 });
            opacity.value = withTiming(1, { duration: 300 });
        }
        setExpanded(!expanded);
    };

    // Animated style for the container
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: boxWidth.value,
            borderRadius: borderRadius.value,
            transform: [{ scale: scale.value }],
        };
    });

    // Animated style for the icon rotation
    const iconAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    // Animated styles for the additional icons
    const leftIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: leftIconOffset.value }],
            opacity: opacity.value,
        };
    });
    const leftIconStyle2 = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: leftIconOffset2.value }],
            opacity: opacity.value,
        };
    });

    const rightIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: rightIconOffset.value }],
            opacity: opacity.value,
        };
    });
    const rightIconStyle2 = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: rightIconOffset2.value }],
            opacity: opacity.value,
        };
    });

    return (
        <View style={[styles.outerContainer, { bottom: insets.bottom + 20 }]}>
            <Animated.View style={[styles.container, animatedStyle]}>
                <Animated.View style={[styles.sideIcon, leftIconStyle]}>
                    <TouchableOpacity onPress={() => {router.push('/Search')}}>
                        <Icon name={'search'} color={'#e5e5e5'} size={20} />
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={[styles.sideIcon, leftIconStyle2]}>
                    <TouchableOpacity onPress={() => {router.push('/Home')}}>
                        <Icon name={'home'} color={'#e5e5e5'} size={20} />
                    </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity onPress={handlePress} style={styles.bottomContainer}>
                    <Animated.View style={iconAnimatedStyle}>
                        <Icon name={'plus'} color={'#e5e5e5'} size={25} />
                    </Animated.View>
                </TouchableOpacity>
                <Animated.View style={[styles.sideIcon, rightIconStyle]}>
                    <TouchableOpacity onPress={() => {router.push('/Home')}}>
                        <Icon name={'camera'} color={'#e5e5e5'} size={20} />
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={[styles.sideIcon, rightIconStyle2]}>
                    <TouchableOpacity onPress={() => {router.push('/Profile')}}>
                        <Icon name={'user'} color={'#e5e5e5'} size={20} />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        zIndex: 1000,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'rgba(43,43,43,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        flexDirection: 'row',
    },
    bottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    sideIcon: {
        position: 'absolute',
    },
});

export default BottomTabs;
