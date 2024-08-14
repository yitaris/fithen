import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useUserStore from "../store";

const UserProfile = () => {
    const { firstName, userEmail } = useLocalSearchParams();
    const { width } = useWindowDimensions();
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [postCount, setPostCount] = useState(0);
    const [profilePicture, setProfilePicture] = useState(null);
    const insets = useSafeAreaInsets();

    const fetchProfilePicture = async () => {
        try {
            const storage = getStorage();
            const imageRef = ref(storage, `posts/${userEmail}/profilpicture/`);
            const result = await listAll(imageRef);

            if (result.items.length > 0) {
                const firstFileRef = result.items[0];
                const imageUrl = await getDownloadURL(firstFileRef);
                setProfilePicture(imageUrl);
            } else {
                setProfilePicture(null); // If no image is found, set it to null or a default image
            }
        } catch (error) {
            console.error("Error fetching profile picture: ", error);
        }
    };

    useEffect(() => {
        console.log("User's first name:", firstName);
        fetchProfilePicture(); // Fetch the profile picture when the component mounts
    }, [firstName]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const q = query(collection(firestore, 'post'), where('userEmail', '==', userEmail));
            const querySnapshot = await getDocs(q);

            const imagesList = querySnapshot.docs.map(doc => doc.data().imageUrl);

            setImages(imagesList);
            setPostCount(imagesList.length);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchImages();
    }, []);

    // Update followRequest field
    const updateFollowRequest = async () => {
        try {
            const { firstName } = useUserStore.getState();
            const { email} = useUserStore.getState();
            const userDocRef = doc(firestore, "users", userEmail);

            // Check if the user's first name already exists in the followRequest array
            await updateDoc(userDocRef, {
                notification: arrayUnion(firstName +" "+ email )
            });

            console.log("Follow request updated successfully!");
        } catch (error) {
            console.error("Error updating follow request: ", error);
        }
    };

    const handleFollowPress = () => {
        updateFollowRequest();
    };

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    const renderImages = () => {
        if (images.length === 0) {
            return (
                <View style={styles.noImagesContainer}>
                    <Text style={styles.noImagesText}>No photos available</Text>
                </View>
            );
        }

        const itemWidth = width / 3 - 10; // Width for 3 items in a row
        const itemHeight = width / 3;     // Height to maintain aspect ratio

        return images.map((item, index) => (
            <View key={index} style={[styles.imageContainer, { width: itemWidth, height: itemHeight }]}>
                <Image source={{ uri: item }} style={styles.image} />
            </View>
        ));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{ backgroundColor: 'black', height: 200 }}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={require('../image/bg.jpg')}
                />
                <View style={styles.profileImageContainer}>
                    <Image
                        source={profilePicture ? { uri: profilePicture } : require('../image/profileicon.png')}
                        style={styles.profileImage}
                    />
                </View>
            </View>
            <View style={{ marginTop: 60, alignSelf: 'center', width: '80%' }}>
                <Text style={{ fontWeight: '500', fontSize: 20, textAlign: 'center', color: 'white' }}>
                    {firstName}
                </Text>
                <Text style={{ textAlign: 'center', color: '#a9a9a9' }}>
                    I'm delighted to introduce myself as a professional model
                </Text>
            </View>
            <View style={styles.userInfoCt}>
                <View style={{ width: '33.33%', borderRightWidth: 0.3 }}>
                    <Text style={styles.userInfo}>357K</Text>
                    <Text style={{ textAlign: 'center', color: '#a9a9a9' }}>Following</Text>
                </View>
                <View style={{ width: '33.33%' }}>
                    <Text style={styles.userInfo}>357K</Text>
                    <Text style={{ textAlign: 'center', color: '#a9a9a9' }}>Followers</Text>
                </View>
                <View style={{ width: '33.33%', borderLeftWidth: 0.3 }}>
                    <Text style={styles.userInfo}>{postCount}</Text>
                    <Text style={{ textAlign: 'center', color: '#a9a9a9' }}>Posts</Text>
                </View>
            </View>
            <TouchableOpacity
                style={{ borderWidth: 1, width: '90%', paddingVertical: 10, backgroundColor: 'blue', alignSelf: 'center' }}
                onPress={handleFollowPress}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>Follow</Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
                <TouchableOpacity
                    style={{ width: 70, alignItems: 'center' }}
                    onPress={() => setSelectedIcon('heart')}
                >
                    <Icon name={'heart'} size={25} color={selectedIcon === 'heart' ? 'white' : '#a9a9a9'} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: 70, alignItems: 'center' }}
                    onPress={() => setSelectedIcon('videocam')}
                >
                    <Ionicons name={'videocam-outline'} size={25} color={selectedIcon === 'videocam' ? 'white' : '#a9a9a9'} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: 70, alignItems: 'center' }}
                    onPress={() => setSelectedIcon('heart2')}
                >
                    <Icon name={'heart'} size={25} color={selectedIcon === 'heart2' ? 'white' : '#a9a9a9'} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: 70, alignItems: 'center' }}
                    onPress={() => setSelectedIcon('bookmark')}
                >
                    <MaterialIcons name={'bookmark-outline'} size={25} color={selectedIcon === 'bookmark' ? 'white' : '#a9a9a9'} />
                </TouchableOpacity>
            </View>

            <View style={styles.imageGrid}>
                {renderImages()}
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    profileImageContainer: {
        alignItems: 'center',
        marginTop: -50, // To move the profile image up
    },
    profileImage: {
        borderWidth: 5,
        borderColor: 'white',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userInfoCt: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    userInfo: {
        fontWeight: '500',
        fontSize: 17,
        textAlign: 'center',
        paddingVertical: 2,
        width: '100%',
        color: 'white'
    },
    iconContainer: {
        flexDirection: 'row',
        width: '95%',
        justifyContent: 'space-around',
        borderBottomWidth: 0.2,
        borderColor: '#a9a9a9',
        paddingBottom: 10,
        alignSelf: 'center',
        marginTop: 20,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
    },
    imageContainer: {
        marginBottom: 10,
        marginHorizontal: 3
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noImagesText: {
        color: 'white'
    }
});

export default UserProfile;
