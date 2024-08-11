import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Animated, useWindowDimensions,TextInput, ImageBackground,KeyboardAvoidingView,Platform,Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import slide from '../slide';
import Onboardingitem from '../screens/Onboardingitem';
import Paginator from '../components/Paginator';
import Nextbutton from '../components/Nextbutton';
import Finishbutton from '../components/Finishbutton';
import { Link , router} from 'expo-router'; 

const Onboarding = () => {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContuine, setShowContuine] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const slideRef = useRef(null);
  
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slide.length - 1) {
      slideRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem('@viewedOnboarding', 'true');
        // Optional: Navigate to the main screen or perform another action
      } catch (err) {
        console.log('Error @setItem:', err);
      }
    }
  };

  const handleShowSignUp = () => {
    setShowContuine(true);
    router.push('/Register/Register')
  };

  return (
    <View style={styles.container}>
        <Animated.View style={{ flex: 3}}>
          <FlatList
            data={slide}
            renderItem={({ item }) => <Onboardingitem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slideRef}
          />
        </Animated.View>
      <Paginator data={slide} scrollX={scrollX} />
      
      {currentIndex > slide.length - 2 &&(
        <Finishbutton handleShowSignUp={handleShowSignUp} scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slide.length)} />
      )}
      {currentIndex < slide.length - 1 &&(
        <Nextbutton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slide.length)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    position: 'absolute',
    backgroundColor: '#ADBC9F',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:60,
    overflow: 'hidden',
  },
});

export default Onboarding;
