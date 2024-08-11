import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Animated, useWindowDimensions,TextInput, ImageBackground,KeyboardAvoidingView,Platform,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import slide from '../slide';
import Onboardingitem from './Onboardingitem';
import Paginator from '../components/Paginator';
import Nextbutton from '../components/Nextbutton';
import Finishbutton from '../components/Finishbutton';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconContainer from '../screens/IconContainer';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'firebase/auth';
import useUserStore from '../store'

const Onboarding = () => {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContuine, setShowContuine] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [buttonState,setButtonState]= useState('#436850')
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const { name, email, password, setName, setEmail, setPassword } = useUserStore();
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully!');
    } catch (err) {
      setError(err.message);
    }
  };
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User log in successfully!');
    } catch (err) {
      setError(err.message);
    }
  };
  const scrollX = useRef(new Animated.Value(0)).current;
  const regAnim = useRef(new Animated.Value(width)).current;
  const cookiesAnim = useRef(new Animated.Value(height)).current;
  const cookiesAnimLogin = useRef(new Animated.Value(height)).current;
  const loginAnim = useRef(new Animated.Value(width)).current;
  const cloudAnim = useRef(new Animated.Value(-height/2)).current;
  const bottomAnim = useRef(new Animated.Value(height)).current;
  const textPosition1 = useRef(new Animated.Value(-height / 2.85)).current;
  const textPosition2 = useRef(new Animated.Value(-height / 3.65)).current;

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
    Animated.sequence([
      Animated.timing(regAnim, {
        toValue: 0, // Başlangıç değeri yukarıdan başlamak için
        duration: 600, // Daha yavaş bir geçiş için süreyi artırabilirsiniz
        useNativeDriver: true,
      }),
      Animated.timing(regAnim, {
        toValue: -width / (width*4), // Nihai konum değeri
        duration: 600, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
    ]).start();
    Animated.parallel([
      Animated.timing(cloudAnim,{
        toValue:0,
        duration:1000,
        useNativeDriver:true,
      }),
      Animated.timing(cloudAnim,{
        toValue:-height/(height/10),
        duration:1000,
        useNativeDriver:true,
      }),
      Animated.timing(cookiesAnim, {
        toValue: height/3.75, // Nihai konum değeri
        duration: 1000, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnim,{
        toValue: -height / 5, // Nihai konum değeri
        duration: 1000, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      })
    ]).start();
  };
  const handleShowSignIn = () => {
    setShowContuine(true);
    setShowLogin(true);
    Animated.parallel([
      Animated.timing(bottomAnim,{
        toValue: height, // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.timing(cloudAnim,{
        toValue: -height/2, // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.timing(cookiesAnim, {
        toValue: height, // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
    ]).start();
    Animated.sequence([
      Animated.timing(regAnim, {
        toValue: width, // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.timing(loginAnim, {
        toValue: -width / (width*4), // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(bottomAnim,{
          toValue: -height / 5, // Nihai konum değeri
          duration: 650, // Yavaş inme için süreyi ayarlayın
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnim,{
          toValue: -height/(height/10), // Nihai konum değeri
          duration: 650, // Yavaş inme için süreyi ayarlayın
          useNativeDriver: true,
        }),
        Animated.timing(cookiesAnimLogin, {
          toValue: height/4.7, // Nihai konum değeri
          duration: 650, // Yavaş inme için süreyi ayarlayın
          useNativeDriver: true,
        }),
      ])
    ]).start();
  };
  const handleShowSignUpAgain = () => {
    setShowContuine(true);
    Animated.parallel([
      Animated.timing(bottomAnim,{
        toValue: height, // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.timing(cloudAnim,{
        toValue: -height/2, // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.timing(cookiesAnimLogin, {
        toValue: height, // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
    ]).start();
    Animated.sequence([
      Animated.timing(loginAnim, {
        toValue: width, // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.timing(regAnim, {
        toValue: -width / (width*4), // Nihai konum değeri
        duration: 650, // Yavaş inme için süreyi ayarlayın
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cloudAnim,{
          toValue:-height/(height/10),
          duration:650,
          useNativeDriver:true,
        }),
        Animated.timing(cookiesAnim, {
          toValue: height/3.75, // Nihai konum değeri
          duration: 650, // Yavaş inme için süreyi ayarlayın
          useNativeDriver: true,
        }),
        Animated.timing(bottomAnim,{
          toValue:-height / 5,
          duration: 650,
          useNativeDriver:true,
        }),
      ])
    ]).start();
  };
  const handleInputFocus = () => {
    Animated.parallel([
      Animated.timing(cloudAnim, {
        toValue: -height,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textPosition1, {
        toValue: -height,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textPosition2, {
        toValue: -height,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const handleInputFocusLogin = () => {
    Animated.parallel([
      Animated.timing(cloudAnim, {
        toValue: -height,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textPosition1, {
        toValue: -height,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textPosition2, {
        toValue: -height,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleInputBlur = () => {
    Animated.parallel([
      Animated.timing(cloudAnim, {
        toValue: -height/(height/10),
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textPosition1, {
        toValue: -height / 2.85,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textPosition2, {
        toValue: -height / 3.65,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };



  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
    <View style={styles.container}>

      <Animated.View style={{flex:1,width: width / 1 ,backgroundColor:'transparent',pointerEvents:'none',zIndex:100,height:height / 1,position:'absolute',transform: [{translateY:cloudAnim}]}}>
        <ImageBackground source={require('../image/backgrounds.png')} style={{flex:1,width:width,height:height}}></ImageBackground>
      </Animated.View>
      <Animated.View style={{flex:1,width: width / 1 ,backgroundColor:'transparent',pointerEvents:'none',zIndex:100,height:height / 2,position:'absolute',transform: [{translateY:bottomAnim}]}}>
        <ImageBackground source={require('../image/bottomBackground.png')} style={{flex:1,width:width,height:height}}></ImageBackground>
      </Animated.View>

      <Animated.View style={[styles.animatedView, { height: height / 0.9, width: width / 1,transform: [{ translateX: regAnim}]}]}>
        <ImageBackground  style={{flex:1,width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>


          <Animated.Text style={[styles.loginText,{transform:[{translateY:textPosition1 },{translateX:-width/8}]}]}>Lets</Animated.Text>
          <Animated.Text style={[styles.loginText,{transform:[{translateY: textPosition2},{translateX:-width/8}]}]}>Started...</Animated.Text>
     
       

        <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="rgb(108, 148, 111)" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#1e1e1e"
              onChangeText={(text)=> setUserName(text)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="rgb(108, 148, 111)" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#1e1e1e"
              onChangeText={(text)=> setEmail(text)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="rgb(108, 148, 111)" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#1e1e1e"
              onChangeText={(text)=> setPassword(text)}
              secureTextEntry
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="rgb(108, 148, 111)" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Re-password"
              placeholderTextColor="#1e1e1e"
              secureTextEntry
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </View>
          
            <TouchableOpacity style={[styles.button,{backgroundColor:buttonState}]} onPress={handleRegister}>
                <Text style={{fontWeight:'500',fontSize:23,color:'rgb(108, 148, 111)',textAlign:'center'}}>Sign Up</Text>
            </TouchableOpacity>
            
            <Text style={{textAlign:'center',color:'#000',fontWeight:'400'}}>
                If you already have acc!{' '}
          <TouchableOpacity onPress={handleShowSignIn}>
           <Text style={{textAlign:'center',top:3,color:'#12372A',fontWeight:'800'}}>Sign In here</Text>
          </TouchableOpacity>
        </Text>
        </ImageBackground>
      </Animated.View>


      <Animated.View style={[styles.animatedView, { height: height / 14, width: width/1 ,transform: [{ translateY: cookiesAnim},],borderRadius:50,backgroundColor:'rgba(255,255,255,0)'}]}>
      <IconContainer />
      </Animated.View>
      

{showLogin == true && (
  <Animated.View style={[styles.animatedView, { height: height / 0.9, width: width / 1,transform: [{ translateX: loginAnim}] }]}>
  <ImageBackground  style={{flex:1,width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>

          <Animated.Text style={[styles.loginText,{transform:[{translateY:textPosition1 },{translateX:-width/10}]}]}>Thanks</Animated.Text>
          <Animated.Text style={[styles.loginText,{transform:[{translateY: textPosition2},{translateX:-width/10}]}]}>For Coming</Animated.Text>

  <View style={styles.inputContainer}>
      <Icon name="user" size={20} color="rgb(108, 148, 111)" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        placeholderTextColor="#1e1e1e"
        onChangeText={(text)=> setEmail(text)}
        onFocus={handleInputFocusLogin}
        onBlur={handleInputBlur}
      />
    </View>

    <View style={styles.inputContainer}>
      <Icon name="lock" size={20} color="rgb(108, 148, 111)" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#1e1e1e"
        secureTextEntry
        onChangeText={(text)=> setPassword(text)}
        onFocus={handleInputFocusLogin}
        onBlur={handleInputBlur}
      />
    </View>

      <TouchableOpacity style={[styles.button,{backgroundColor:buttonState}]} onPress={handleLogin}>
          <Text style={{fontWeight:'500',fontSize:23,color:'rgb(108, 148, 111)',textAlign:'center'}}>Log In</Text>
      </TouchableOpacity>
      
      <Text style={{textAlign:'center',color:'#000',fontWeight:'400'}}>
          If you dont have acc!{' '}
    <TouchableOpacity onPress={handleShowSignUpAgain}>
     <Text style={{textAlign:'center',top:3,color:'#12372A',fontWeight:'800'}}>Sign Up here</Text>
    </TouchableOpacity>
  </Text>
  </ImageBackground>
</Animated.View>
)}

{showLogin == true && (
 <Animated.View style={[styles.animatedView, { height: height / 14, width: width/1 ,transform: [{ translateY: cookiesAnimLogin},],borderRadius:50,backgroundColor:'rgba(255,255,255,0)'}]}>
 <IconContainer />
 </Animated.View>
)}
     















      {showContuine === false &&(
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
      )}
      
      {showContuine === false &&(
      <Paginator data={slide} scrollX={scrollX} />
      )}

      {currentIndex > slide.length - 2 && showContuine === false &&(
        <Finishbutton handleShowSignUp={handleShowSignUp} scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slide.length)} />
      )}
      {currentIndex < slide.length - 1 && showContuine === false &&(
        <Nextbutton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slide.length)} />
      )}
    </View>
    </KeyboardAvoidingView>
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
  loginButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText:{
    fontWeight:'800',
    color:'#436850',
    fontSize:40,
    alignSelf:'flex-end',
    position:'absolute'
  },
  input:{
    width: 200,
    height: 40,
    borderRadius:12,
    paddingHorizontal: 14,
    marginVertical: 20,
    backgroundColor: 'rgba(255,255,255,0)',
  },
  button:{
    width:'30%',
    padding:10,
    borderRadius:10,
    marginVertical:20,
  },
  signUp:{
    flex:1,
    padding:20,
    marginVertical:20,
    backgroundColor:'rgba(73, 50, 138, 1)',
    width:120,
    borderRadius:10,
    justifyContent:'center',
    alignSelf:'flex-end',
    height:50
  },
  iconContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor:'transparent'
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'rgba(255,255,255,0.5)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    width:250,
    height:50
  },
});

export default Onboarding;
