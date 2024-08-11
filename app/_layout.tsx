import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './Onboarding'
import HomeScreen from './HomeScreen'
import SplashScreen from '../components/SplashScreen'
import Login from './Login'
import Register from './Register/Register'
import { Stack } from 'expo-router';

const App = () => {

  return (
    <Stack screenOptions={{
      gestureEnabled: true,
      headerShown: false,
    }}>
      <Stack.Screen name='index' options={{
        title: 'home',
      }} />
      <Stack.Screen name='Login' options={{
        title: 'log in',
      }} />
      <Stack.Screen name='Register/Register' options={{
        title: 'Register',
      }} />
    </Stack>
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
