import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './Onboarding'
import HomeScreen from './HomeScreen'
import SplashScreen from '../components/SplashScreen'
import Login from './Login'
import Register from './Register/Register'
import BottomTabs from '../components/BottomTabs';
import { Stack,Slot } from 'expo-router';

const App = () => {

  return (
      <>
        <Slot />
        <BottomTabs/>
      </>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADBC9F'
  },
})



export default App;
