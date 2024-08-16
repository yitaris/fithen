import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, RefreshControl, SafeAreaView, Animated } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // For diagonal arrow
import Ionicons from '@expo/vector-icons/Ionicons'; // For notification bell
import {auth, firestore, storage} from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import useUserStore from '../store';
import Posts from "../components/Post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {getDownloadURL, listAll, ref} from "firebase/storage";

const Home = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);

    useEffect(() => {
        const RegisterComponent = async() => {
            await AsyncStorage.setItem('@userRegistered','true')
        }


        RegisterComponent();
    }, []);
    const { email } = useUserStore();
    const scrollY = useRef(new Animated.Value(0)).current;

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const user = auth.currentUser;
    console.log(user);

    // Optimized Firebase data retrieval
    const fetchNotifications = async () => {
        try {
            const docRef = doc(firestore, `users/${email}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const notificationList = userData.notification || [];
                setNotifications(notificationList);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };


    // Handle scroll direction to show/hide the header
    const handleScroll = (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;

        // Prevent hiding the header when at the very top of the scroll view
        if (currentScrollY > 0) {
            if (currentScrollY > lastScrollY && headerVisible) {
                setHeaderVisible(false); // Scrolling down - hide header
            } else if (currentScrollY < lastScrollY && !headerVisible) {
                setHeaderVisible(true); // Scrolling up - show header
            }
        } else {
            // Always show the header when at the top
            setHeaderVisible(true);
        }

        setLastScrollY(currentScrollY);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Animated Header */}
            {headerVisible && (
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={()=>{router.push('/Plus')}}>
                        <FontAwesome name={'plus'} size={30} color={'#bf2929'} style={styles.icons} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{router.push('/notification')}}>
                        <Ionicons name={'notifications'} size={30} color={'#bf2929'} style={styles.icons} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{router.push('/Arrow')}}>
                        <MaterialIcons name={'arrow-forward-ios'} size={30} color={'#bf2929'} style={styles.icons} />
                    </TouchableOpacity>
                </View>
            )}

            {/* ScrollView Content */}
            <Animated.ScrollView
                onScroll={handleScroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                scrollEventThrottle={16}
            >
                <View>
                    <Posts />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#1a1a1a',
        flex: 1,
    },
    headerContainer: {
        position: 'absolute',
        height:'10%',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'flex-end',
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: 'rgba(43,43,43,0.7)',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        zIndex: 1000,
    },
    icons: {
        margin: 5,
        color: '#e5e5e5',
    },
    storyCt: {
        marginTop: 10,
        width: '80%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignSelf: 'center',
        marginBottom: 10,
        backgroundColor: '#2b2b2b',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
    },
    modalContent: {
        width: '80%', // Responsive width
        padding: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#e5e5e5',
    },
    notificationText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#e5e5e5',
    },
    closeButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#bf2929',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Home;
