import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link,router } from 'expo-router';
///////////////////////////////////////////////////////////////
import { auth } from '../../firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
///////////////////////////////////////////////////////////////
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import IconContaiener from '../../screens/IconContainer'
import useUserStore from '../../store';


const Register = () => {
    const { firstName, setFirstName, lastName, setLastName} = useUserStore();
    //////////////////////////////////////////////////////////////
    const { width, height } = useWindowDimensions();
    //////////////////////////////////////////////////////////////
    const topImageAnim = useSharedValue(width)
    const bottomImageAnim = useSharedValue(-width)
    //////////////////////////////////////////////////////////////
    const textFirstAnim = useSharedValue(-height)
    const textFirstAnimX = useSharedValue(-width)
    //////////////////////////////////////////////////////////////
    const textSecondAnim = useSharedValue(-height)
    const textSecondAnimX = useSharedValue(-width)
    //////////////////////////////////////////////////////////////
    const footerAnim = useSharedValue(-height)
    useEffect(() => {
        topImageAnim.value = withSpring(0, { damping: 100, stiffness: 100 });
        bottomImageAnim.value = withSpring(0, { damping: 100, stiffness: 100 });
        textFirstAnim.value = withSpring(-height / 3, { damping: 50, stiffness: 100 });
        textFirstAnimX.value = withSpring(-width / 3.4, { damping: 50, stiffness: 100 });
        textSecondAnim.value = withSpring(-height / 4, { damping: 50, stiffness: 100 });
        textSecondAnimX.value = withSpring(-width / 5.3, { damping: 50, stiffness: 100 });
        footerAnim.value = withSpring(height / 2.3, { damping: 50, stiffness: 100 });
    }, [height]);
    //////////////////////////////////////////////////////////////
    // Top image animasyon stili
    const topImageStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: topImageAnim.value }], };
    });
    // Bottom image animasyon stili
    const bottomImageStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: bottomImageAnim.value }], };
    });
    // Text animasyon stili
    const textFirstStyle = useAnimatedStyle(() => {
        return { transform: [{ translateY: textFirstAnim.value }, { translateX: textFirstAnimX.value }], };
    });
    // Text animasyon stili
    const textSecondStyle = useAnimatedStyle(() => {
        return { transform: [{ translateY: textSecondAnim.value }, { translateX: textSecondAnimX.value }], };
    });
    const footerStyle = useAnimatedStyle(() => {
        return { transform: [{ translateY: footerAnim.value },{translateX:width / 3}], };
    });
    const handleFocus = () => {
        topImageAnim.value = withSpring(width, { damping: 100, stiffness: 100 });
        bottomImageAnim.value = withSpring(-width, { damping: 100, stiffness: 100 });
        textFirstAnim.value = withSpring(-height, { damping: 50, stiffness: 100 });
        textSecondAnim.value = withSpring(-height, { damping: 50, stiffness: 100 });
    };

    const handleBlur = () => {
        topImageAnim.value = withSpring(0, { damping: 100, stiffness: 100 });
        bottomImageAnim.value = withSpring(0, { damping: 100, stiffness: 100 });
        textFirstAnim.value = withSpring(-height / 3, { damping: 50, stiffness: 100 });
        textSecondAnim.value = withSpring(-height / 4, { damping: 50, stiffness: 100 });
    };
    //////////////////////////////////////////////////////////////

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
            <View style={styles.container}>
                {/* Image Animated */}
                <Animated.Image style={[styles.image, topImageStyle,]} source={require('../../image/topimage.png')} />
                <Animated.Image style={[styles.image, bottomImageStyle,]} source={require('../../image/bottomimage.png')} />
                {/* Text Animated */}
                <Animated.Text style={[styles.text, textFirstStyle, { color: 'white' }]}>Lets</Animated.Text>
                <Animated.Text style={[styles.text, textSecondStyle, { color: 'rgba(255,0,0,0.8)' }]}>Starting</Animated.Text>
                {/* Input Container */}

                <View style={{ width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                    
                    <Text style={{ color: 'rgba(255,255,255,0.9)', alignSelf: 'baseline' }}>Name</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor="rgba(255,255,255,0.7)"
                            value={firstName}
                            onChangeText={(text) => { setFirstName(text) }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', alignSelf: 'baseline' }}>Surname</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Surname"
                            placeholderTextColor="rgba(255,255,255,0.7)"
                            value={lastName}
                            onChangeText={(text) => { setLastName(text) }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={()=>{router.push('/Register/RegisterSecond')}}>
                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 20, textAlign: 'center' }}>Contuine  1/5</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', alignSelf: 'center', marginTop: 20 }}>Already have an account? <Link href="/Login"><Text style={{ color: 'rgba(255,255,255,1)', fontWeight: 'bold' }}>Sign In</Text></Link></Text>
                </View>
                {/* Footer */}
                <Animated.View style={[footerStyle,{position:'absolute'}]}>
                <IconContaiener/>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e'
    },
    topContainer: {
        flex: 1,
        width: '100%',
        height: '10%',
        position: 'absolute',
        backgroundColor: 'black',
        alignSelf: 'center',
        alignItems: 'baseline',
        justifyContent: 'center',
        padding: 16,
    },
    text: {
        fontSize: 50,
        textAlign: 'center',
        fontWeight: '700',
        position: 'absolute',
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(255,255,255,0.7)',
        borderWidth: 0.4,
        borderRadius: 10,
        paddingHorizontal: 5,
        marginVertical: 16,
        width: '80%',
        height: 50,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        color: 'white',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,0,0,0.6)',
        borderRadius: 16,
        width: '40%',
        padding: 13,
        marginTop: 15
    }
});

export default Register;