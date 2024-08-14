import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, firestore, storage } from "../firebaseConfig"; // Firebase config
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import { getDownloadURL, ref, listAll } from "firebase/storage"; // Firebase Storage imports
import useUserStore from '../store'; // Zustand store import
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const { email } = useUserStore(); // Get user email from Zustand
    const router = useRouter(); // Use Expo Router to navigate
    const [focus, setFocus] = useState(false);
    const [profilePictures, setProfilePictures] = useState({}); // State to store profile pictures

    const showRequest = () => {
        setFocus(true);
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const docRef = doc(firestore, `users/${email}`);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const notificationList = userData.notification || [];
                    setNotifications(notificationList);

                    // Fetch profile pictures for each notification
                    await Promise.all(notificationList.map(notification => fetchProfilePicture(notification)));
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        const fetchProfilePicture = async (notification) => {
            const words = notification.split(' ');
            const secondWord = words[1]; // Kullanıcı emailini varsayarak ikinci kelimeyi alıyoruz

            if (secondWord && secondWord.includes('@')) {
                try {
                    const profilePictureRef = ref(storage, `posts/${secondWord}/profilpicture/`);

                    // Klasördeki tüm dosyaları listele
                    const listResult = await listAll(profilePictureRef);

                    if (listResult.items.length > 0) {
                        // İlk dosyanın referansını al
                        const firstItemRef = listResult.items[0];

                        // Dosyanın URL'sini al
                        const url = await getDownloadURL(firstItemRef);

                        setProfilePictures(prevState => ({
                            ...prevState,
                            [notification]: url, // URL'yi bildirime göre ilişkilendiriyoruz
                        }));
                    } else {
                        console.log("No profile picture found.");
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
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '80%', paddingVertical: 15 }}>
                <TouchableOpacity onPress={() => setFocus(false)} style={{ borderRightWidth: 0.5, borderColor: 'white', flex: 0.5 }}>
                    <Ionicons name="heart" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={showRequest} style={{ borderLeftWidth: 0.5, borderColor: 'white', flex: 0.5, alignItems: 'flex-end' }}>
                    <Ionicons name="book" size={24} color="white" />
                </TouchableOpacity>
            </View>
            {focus === false && (
                <>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <Text key={index} style={styles.notificationText}>{notification}</Text>
                        ))
                    ) : (
                        <Text style={styles.notificationText}>No notifications available</Text>
                    )}
                </>
            )}
            {focus === true && (
                <>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => {
                            const firstWord = notification.split(' ')[0]; // İlk kelimeyi al

                            const profilePictureUrl = profilePictures[notification]; // Bildirime göre profil resim URL'sini al

                            return (
                                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                                    {profilePictureUrl ? (
                                        <Image source={{ uri: profilePictureUrl }} style={{ width: 60, height: 60, borderRadius: 32, flex: 0.2 }} />
                                    ) : (
                                        <Image source={require('../image/profileicon.png')} style={{ width: 60, height: 60, borderRadius: 32, flex: 0.2 }} />
                                    )}
                                    <Text style={styles.notificationText}>{firstWord}</Text>
                                    <View style={{ flexDirection: 'row', flex: 0.2 }}>
                                        <TouchableOpacity style={{ flex: 0.5 }}>
                                            <FontAwesome6 name={'check'} size={25} color={'white'} style={styles.icons} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flex: 0.5 }}>
                                            <FontAwesome6 name={'x'} size={25} color={'white'} style={styles.icons} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={styles.notificationText}>No notifications available</Text>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 45,
    },
    notificationText: {
        flex: 0.3,
        fontSize: 16,
        color: 'white',
        textAlign: 'start',
        marginVertical: 20,
    },
});

export default Notification;
