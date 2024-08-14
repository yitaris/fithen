import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, RefreshControl, SafeAreaView } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { auth, firestore } from "../firebaseConfig"; // Firebase config
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import useUserStore from '../store'; // Zustand store import
import Posts from "../components/Post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Home = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const { email } = useUserStore(); // Get user email from store

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const clearOnboarding = async () => {
        try {
            await AsyncStorage.removeItem('@userRegistered');
            await AsyncStorage.setItem('@userLogout', 'true');
            router.push('/Login');
        } catch (err) {
            console.log('Error @clearOnboarding', err);
        }
    };

    const user = auth.currentUser; // Get the current user
    console.log(user);

    // Fetch notifications from Firestore
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

    // Open modal and fetch notifications
    const openModal = async () => {
        setModalVisible(true);
        await fetchNotifications();
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.headerContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderRadius: 100, paddingVertical: 2 }}>
                        <TouchableOpacity onPress={()=>{router.push('/notification')}}>
                            <FontAwesome name={'heartbeat'} size={30} color={'#bf2929'} style={styles.icons} />
                        </TouchableOpacity>
                        <FontAwesome6 name={'message'} size={30} color={'#bf2929'} style={styles.icons} />
                    </View>
                </View>

                <View style={styles.storyCt}>
                    <ScrollView horizontal={true}>
                        {/* Add stories here */}
                    </ScrollView>
                </View>
                <View>
                    <Posts />
                </View>
            </ScrollView>

            {/* Modal to display notifications */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Notifications</Text>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <Text key={index} style={styles.notificationText}>{notification}</Text>
                            ))
                        ) : (
                            <Text style={styles.notificationText}>No notifications available</Text>
                        )}
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#000',
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
    icons: {
        margin: 5,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    notificationText: {
        fontSize: 16,
        marginBottom: 10,
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
