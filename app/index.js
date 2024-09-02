import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './Onboarding';
import SplashScreen from '../components/SplashScreen';
import Login from './Login';
import Register from './Register/Register';
import FitHome from './FitHome';
import BottomTabs from "../components/BottomTabs";

const App = () => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [userLogout, setUserLogout] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);

  const checkOnboardingAndRegistration = async () => {
    try {
      const registeredValue = await AsyncStorage.getItem('@userRegistered');
      const loginValue = await AsyncStorage.getItem('@userLogout');
      if (registeredValue !== null) {
        setUserRegistered(true);
      }
      if (loginValue !== null) {
        setUserLogout(true);
      }
    } catch (err) {
      console.log('error @checkOnboardingAndRegistration:', err);
    }
  };

  useEffect(() => {
    checkOnboardingAndRegistration();
  }, []);

  const handleAnimationFinish = () => {
    setAnimationFinished(true);
  };

  if (!animationFinished) {
    return <SplashScreen onAnimationFinish={handleAnimationFinish} />;
  }

  return (
    <View style={styles.container}>
    {userRegistered ? (
      <FitHome />
    ) : userLogout ? (
      <Login />
    ) : (
      <Onboarding />
    )}

  </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
});

export default App;
