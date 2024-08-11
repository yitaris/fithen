import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Link,router } from 'expo-router';

// Define the tabs
const TABS = [
  { title: 'Home', icon: 'home' },
  { title: 'Search', icon: 'search' },
  { title: 'Shop', icon: 'basket' },
  { title: 'User', icon: 'person' },
];

const HomeScreen = () => {
  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@userRegistered');
      await AsyncStorage.setItem('@userLogout', 'true');
      router.push('/Login')
    } catch (err) {
      console.log('Error @clearOnboarding', err);
    }
  };

  // Bottom tab bar state and animation values
  const [selectedTab, setSelectedTab] = useState('Home');
  const animations = useRef(
    TABS.reduce((acc, tab) => {
      acc[tab.title] = {
        scale: new Animated.Value(1),
        translateY: new Animated.Value(0),
      };
      return acc;
    }, {})
  ).current;

  const animateTab = (tab) => {
    if (tab === selectedTab) return;

    Animated.parallel([
      Animated.spring(animations[tab].scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(animations[tab].translateY, {
        toValue: -45,
        useNativeDriver: true,
      }),
      Animated.spring(animations[selectedTab].scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(animations[selectedTab].translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedTab(tab);
  };

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <TouchableOpacity onPress={clearOnboarding} style={styles.clearButton}>
        <Text>Clear Onboarding</Text>
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isSelected = selectedTab === tab.title;
          return (
            <TouchableOpacity
              key={tab.title}
              style={styles.tabItem}
              onPress={() => animateTab(tab.title)}
            >
              <Animated.View
                style={[
                  styles.bubble,
                  {
                    transform: [
                      { scale: animations[tab.title].scale },
                      { translateY: animations[tab.title].translateY },
                    ],
                  },
                ]}
              >
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={isSelected ? '#49328a' : 'white'}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
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
  clearButton: {
    marginTop: 20,
  },
  tabBar: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    width: '90%',
    height: 60,
    backgroundColor: 'rgba(0,0,0,1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    width: 50,
    height: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,1)',
  },
});

export default HomeScreen;
