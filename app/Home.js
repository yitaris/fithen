import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, ImageBackground, ActivityIndicator, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig"; // config.js'den import
import useUserStore from '../store'; // Import the Zustand store
import Posts from "../components/Post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link,router } from "expo-router";

const Home = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [photo, setPhoto] = useState(null); // Başlangıçta null, çünkü tek bir fotoğraf göstereceğiz
    const [loading, setLoading] = useState(true);
    const [sideBarVisible, setSideBarVisible] = useState(false);

    const navigation = useNavigation();
    const { name } = useUserStore();

    const clearOnboarding = async () => {
        try {
          await AsyncStorage.removeItem('@userRegistered');
          await AsyncStorage.setItem('@userLogout', 'true');
          router.push('/Login')
        } catch (err) {
          console.log('Error @clearOnboarding', err);
        }
      };

    const user = auth.currentUser; // Giriş yapmış kullanıcıyı al
    console.log(user);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setModalVisible(false);
    };

    const showSideBar = () => {
        setSideBarVisible(true);
        Animated.timing(sidebarPosition, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const closeSideBar = () => {
        Animated.timing(sidebarPosition, {
            toValue: -80, // Match this value to sidebar's width
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start(() => setSideBarVisible(false));
    };



    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderRadius: 100, paddingVertical: 2 }}>
                        <FontAwesome name={'heartbeat'} size={30} color={'#bf2929'} style={styles.icons} />
                        <FontAwesome name={'heartbeat'} size={30} color={'#bf2929'} style={styles.icons} />
                    </View>
                </View>
                <View style={styles.storyCt}>
                    <ScrollView horizontal={true}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ borderWidth: 2, borderRadius: 32, borderColor: '#142037' }}>
                                <View style={[styles.myStory, { backgroundColor: 'rgba(142, 50, 51, .4)' }]}>
                                    <Text style={{ color: 'white', fontSize: 30 }}>+</Text>
                                </View>
                            </View>
                            <Text style={{ color: 'white', marginTop: 4, fontSize: 15 }}>Add Story</Text>
                        </View>
                        <View style={styles.userStory}>
                            <View style={{ borderWidth: 3, borderRadius: 32, }}>
                                <View style={styles.myStory}>
                                    <Image source={require('../image/diet.png')} style={styles.userStoryImage} />
                                </View>
                            </View>
                            <Text style={{ color: 'white', marginTop: 4, fontSize: 15 }}>Samera</Text>
                        </View>
                        <View style={styles.userStory}>
                            <View style={{ borderWidth: 3, borderRadius: 32, }}>
                                <View style={styles.myStory}>
                                    <Image source={require('../image/running.png')} style={styles.userStoryImage} />
                                </View>
                            </View>
                            <Text style={{ color: 'white', marginTop: 4, fontSize: 15 }}>Dream</Text>
                        </View>
                        <View style={styles.userStory}>
                            <View style={{ borderWidth: 3, borderRadius: 32, }}>
                                <View style={styles.myStory}>
                                    <Image source={require('../image/football.png')} style={styles.userStoryImage} />
                                </View>
                            </View>
                            <Text style={{ color: 'white', marginTop: 4, fontSize: 15 }}>Gansta</Text>
                        </View>
                        <View style={styles.userStory}>
                            <View style={{ borderWidth: 3, borderRadius: 32, }}>
                                <View style={styles.myStory}>
                                    <Image source={require('../image/trainer.png')} style={styles.userStoryImage} />
                                </View>
                            </View>
                            <Text style={{ color: 'white', marginTop: 4, fontSize: 15 }}>Samera</Text>
                        </View>
                        <View style={styles.userStory}>
                            <View style={{ borderWidth: 3, borderRadius: 32, borderColor: '#bf2929' }}>
                                <View style={styles.myStory}>
                                    <Image source={require('../image/trainer.png')} style={styles.userStoryImage} />
                                </View>
                            </View>
                            <Text style={{ color: 'white', marginTop: 4, fontSize: 15 }}>Dream</Text>
                        </View>
                        <View style={styles.userStory}>
                            <View style={{ borderWidth: 3, borderRadius: 32, borderColor: '#d3a08b' }}>
                                <View style={styles.myStory}>
                                    <Image source={require('../image/diet.png')} style={styles.userStoryImage} />
                                </View>
                            </View>
                            <Text style={{ color: 'white', marginTop: 4, fontSize: 15 }}>Gansta</Text>
                        </View>
                    </ScrollView>
                </View>
                <View>
                    <Posts />
                </View>
            </ScrollView>
            <TouchableOpacity onPress={clearOnboarding}>
                <Text style={{color:'#fff',alignSelf:'center'}}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {router.push('/Plus')}}>
                <Text style={{color:'#fff',alignSelf:'center',padding:20}}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    safeArea: {
        backgroundColor: '#1e1e1e',
        flex: 1
    },
    headerContainer: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        paddingTop: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
    },
    storyCt: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    myStory: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#bf2929',
        width: 70,
        height: 70,
        backgroundColor: '#142037',
        borderRadius: 32,
    },

    userStoryImage: {
        width: 60, height: 60, borderRadius: 32
    },
    sideBar: {
        paddingVertical: 10,
        right: 0,
        position: 'absolute',
        top: '20%',
        backgroundColor: 'rgba(255,255,255, 0.1)',
        width: 80,
        height: '60%',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },
    userStory: {
        justifyContent: 'center', alignItems: 'center', marginLeft: 10
    },
    post: {
        marginTop: 15,
        borderWidth: 1,
        borderColor: 'white',
        width: 400, height: 500,
        objectFit: 'cover',
    },
    userProfileImage: {
        borderRadius: 100,
        paddingHorizontal: 15,
        width: 50, height: 50,
    },
    usernameCt: {
        borderRadius: '100%',
        alignSelf: 'center',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
    },
    icons:{
        margin:5,
    }

});

export default Home;