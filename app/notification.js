import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, firestore, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import useUserStore from '../store';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [requests, setRequests] = useState([]);
    const { email, firstName } = useUserStore();
    const router = useRouter();
    const [focus, setFocus] = useState(false);
    const [profilePictures, setProfilePictures] = useState({});

    const showRequest = () => {
        setFocus(true);
    };

    const allowFriends = async (friendEmail) => {
        try {
            const words = friendEmail.split(' ');
            const emailWord = words[1];
            const docRef = doc(firestore, `users/${email}`);
            const docSecondRef = doc(firestore, `users/${emailWord}`);

            await updateDoc(docRef, {
                followers: arrayUnion(emailWord),
                request: arrayRemove(friendEmail),
            });
            await updateDoc(docSecondRef, {
                following: arrayUnion(email),
                notification: arrayUnion(`${firstName} accepted your follow request`)
            });

            setRequests(prevRequests =>
                prevRequests.filter(request => request !== friendEmail)
            );

        } catch (e) {
            console.error(e);
        }
    };

    const cancelFriends = async (friendEmail) => {
        try {
            const docRef = doc(firestore, `users/${email}`);

            await updateDoc(docRef, {
                request: arrayRemove(friendEmail)
            });

            setRequests(prevRequests =>
                prevRequests.filter(request => request !== friendEmail)
            );

        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const docRef = doc(firestore, `users/${email}`);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const notificationList = userData.notification || [];
                    const requestList = userData.request || [];
                    setNotifications(notificationList.reverse());
                    setRequests(requestList.reverse());

                    await Promise.all(requestList.map(request => fetchProfilePicture(request)));
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        const fetchProfilePicture = async (notification) => {
            const words = notification.split(' ');
            const secondWord = words[1];

            if (secondWord && secondWord.includes('@')) {
                try {
                    const profilePictureRef = ref(storage, `posts/${secondWord}/profilpicture/`);
                    const listResult = await listAll(profilePictureRef);

                    if (listResult.items.length > 0) {
                        const firstItemRef = listResult.items[0];
                        const url = await getDownloadURL(firstItemRef);

                        setProfilePictures(prevState => ({
                            ...prevState,
                            [notification]: url,
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching profile picture:", error);
                }
            }
        };

        fetchNotifications();
    }, [email]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Notifications</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => setFocus(false)} style={[styles.iconButton, !focus && styles.iconButtonActive]}>
                    <Ionicons name="heart" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={showRequest} style={[styles.iconButton, focus && styles.iconButtonActive]}>
                    <Ionicons name="book" size={24} color="white" />
                </TouchableOpacity>
            </View>
            {focus === false && (
                <View style={{width:'80%'}}>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <View style={styles.requestContainer}>
                            <Text key={index} style={styles.notificationText}>{notification}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.notificationText}>No notifications available</Text>
                    )}
                </View>
            )}
            {focus === true && (
                <>
                    {requests.length > 0 ? (
                        requests.map((request, index) => {
                            const firstWord = request.split(' ')[0];
                            const profilePictureUrl = profilePictures[request];

                            return (
                                <View key={index} style={styles.requestContainer}>
                                    {profilePictureUrl ? (
                                        <Image source={{ uri: profilePictureUrl }} style={styles.profileImage} />
                                    ) : (
                                        <Image source={require('../image/profileicon.png')} style={styles.profileImage} />
                                    )}
                                    <Text style={styles.requestText}>{firstWord}</Text>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity onPress={() => { allowFriends(request) }} style={styles.actionButton}>
                                            <FontAwesome6 name={'check'} size={25} color={'white'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { cancelFriends(request) }} style={styles.actionButton}>
                                            <FontAwesome6 name={'x'} size={25} color={'white'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={styles.notificationText}>No requests available</Text>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 60,
        textAlign: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: 20,
    },
    iconButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    iconButtonActive: {
        backgroundColor: '#333',
    },
    notificationText: {
        fontSize: 16,
        color: 'white',
        width: '100%',
        textAlign: 'start',
    },
    requestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        marginVertical: 10,
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 30,
    },
    requestText: {
        fontSize: 16,
        color: 'white',
        flex: 1,
        marginLeft: 15,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '30%',
    },
    actionButton: {
        padding: 10,
        backgroundColor: '#555',
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default Notification;
