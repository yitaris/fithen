import React, {useState,useRef,useEffect} from 'react'
import { StyleSheet,View,TouchableOpacity,TextInput,Text,Dimensions,ImageBackground } from 'react-native' 
import Animated,{
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withRepeat,
  ReduceMotion,
} from 'react-native-reanimated'

const Login = () => {
  const windowHeight = Dimensions.get('window').height;
  const duration = 800;
  const linear = useSharedValue(windowHeight);
  const linearSag = useSharedValue(-windowHeight);
  const linearSol = useSharedValue(-windowHeight);

  const animatedChanged = useAnimatedStyle(() => ({
    transform: [{ translateY: linear.value }],
  }));
  const animatedChangedSag = useAnimatedStyle(() => ({
    transform: [{ translateY: linearSag.value }],
  }));
  const animatedChangedSol = useAnimatedStyle(() => ({
    transform: [{ translateY: linearSol.value }],
  }));

  const handlePress = () =>{
    linear.value = withTiming(windowHeight/2, {
      duration,
      easing: Easing.elastic(1.5),
      reduceMotion: ReduceMotion.System,
    });
  }
  const negativeHandlePress = () => {
    linear.value = withTiming(windowHeight, {
      duration,
      easing: Easing.elastic(1.5),
      reduceMotion: ReduceMotion.System,
    });
  }
  const handleTextChange = () => {
    linear.value = withTiming(windowHeight/10, {
      duration,
      easing: Easing.elastic(1.5),
      reduceMotion: ReduceMotion.System,
    });
  }
    useEffect(() => {
      linearSag.value = withTiming(-windowHeight*-0.0001, {
        duration:1300,
        easing: Easing.elastic(1.2),
        reduceMotion: ReduceMotion.System,
      });
      linearSol.value = withTiming(-windowHeight*-0.0001, {
        duration:1500,
        easing: Easing.elastic(1.2),
        reduceMotion: ReduceMotion.System,
      });
    },[]);

  return(
    <ImageBackground source={require('../image/denemearkaplan.png')} style={{flex:1,width:'100%',height:'100%'}}> 
    <View style={styles.container}>
       <Animated.View style={[styles.animatedImageContainer, animatedChangedSol]}>
        <ImageBackground source={require('../image/sol.png')}
        style={[styles.imageBackground]}>
          
        </ImageBackground>
      </Animated.View>
      <Animated.View style={[styles.animatedImageContainer, animatedChangedSag]}>
        <ImageBackground source={require('../image/sag.png')}
        style={[styles.imageBackground]}>
          
        </ImageBackground>
      </Animated.View>
     
      <View style={styles.normalContainer}>
      <View style={{flex:1}} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text>log in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.animatedContainer,animatedChanged,{height:windowHeight}]}>
        <ImageBackground source={require('../image/loginbackground.png')} style={styles.imageBackground}>
          <View style={{flex:0.15}}>
              <TouchableOpacity style={{borderRadius:200,padding:10}} onPress={negativeHandlePress}>
                <Text style={{fontSize:30,color:'darkorange',fontWeight:'bold'}}>V</Text>
              </TouchableOpacity>
          </View>
          <View style={{flex:0.85,justifyContent:'flex-start'}}>
            <Text style={styles.text}>Log In</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#ccc"
              onChangeText={handleTextChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              onChangeText={handleTextChange}
            />
            </View>
        </ImageBackground>
      </Animated.View>
    </View>
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItem:'center',
  },
  normalContainer:{
    flex: 1,
    justifyContent: 'flex-end',
  },
  animatedContainer:{
    flex:1,
    position:'absolute',
    width:'100%',
    backgroundColor:'darkgrey',
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
    overflow: 'hidden',
  },
  text:{
    color:'darkorange',
    textAlign:'center',
    fontSize:40,
    fontWeight:'bold',
    marginBottom:20,
  },
  button:{
    justifyContent:'center',
    alignSelf: 'center',
    alignItems:'center',
    width:100,
    padding:10,
    borderRadius:10,
    borderWidth:1,
  },
  buttonContainer:{
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 100, // Butonun alttan mesafesi
    flexDirection:'row',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input:{
    width: 200,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 14,
    marginVertical: 20,
    backgroundColor: 'white',
  },
  animatedImageContainer:{
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
})
export default Login;
