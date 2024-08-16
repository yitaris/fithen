import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import useUserStore from "../store";
import { collection, query, where, getDocs,doc,getDoc} from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { getStorage, ref, listAll, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const Profile = () => {
    const { width } = useWindowDimensions();
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [postCount, setPostCount] = useState(0);
    const [followingCount,setFollowingCount] = useState(0);
    const [followersCount,setFollowersCount] = useState(0);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const { email, firstName } = useUserStore();
    const insets = useSafeAreaInsets();
    const [imageUri, setImageUri] = useState(null);

    const logOut = async () => {
        await AsyncStorage.setItem('@userLogout', 'false');
        await AsyncStorage.removeItem('@userRegistered')
        router.replace('/Login');
    }

    useEffect(() => {
        console.log("User's first name:", firstName);
    }, [firstName]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const q = query(collection(firestore, 'post'), where('userEmail', '==', email));
            const querySnapshot = await getDocs(q);
            const imagesList = querySnapshot.docs.map(doc => doc.data().imageUrl);
            setImages(imagesList);
            setPostCount(imagesList.length);
            // Arkadaş sayısını çekme işlemi
            const docRef = doc(firestore, `users/${email}`);
            const docSnap = await getDoc(docRef);

            const userDatas = docSnap.data();
            const friendsLength = userDatas.following || [];
            const followersLength = userDatas.followers || [];
            setFollowingCount(friendsLength.length);
            setFollowersCount(followersLength.length)
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchProfileImage = async () => {
        const storage = getStorage();
        const profileImageRef = ref(storage, `posts/${email}/profilpicture/`);

        try {
            const listResult = await listAll(profileImageRef);
            if (listResult.items.length > 0) {
                const firstImageRef = listResult.items[0];
                const url = await getDownloadURL(firstImageRef);
                setProfileImageUrl(url);
            } else {
                setProfileImageUrl(null);
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
            setProfileImageUrl(null);
        }
    };

    useEffect(() => {
        fetchImages();
        fetchProfileImage();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchImages();
        fetchProfileImage();
    }, []);

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
                    <Feather name={'camera-off'} size={50} color={'#a9a9a9'} />
                    <View style={{ height: 30 }}></View>
                    <Text style={styles.noImagesText}>No photos available</Text>
                </View>
            );
        }

        const itemWidth = width / 3 - 10;
        const itemHeight = width / 3;

        return images.map((item, index) => (
            <View key={index} style={[styles.imageContainer, { width: itemWidth, height: itemHeight }]}>
                <Image source={{ uri: item }} style={styles.image} />
            </View>
        ));
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            await uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri) => {
        const displayName = firstName || "Anonymous";
        const storage = getStorage();
        const profilePicturesRef = ref(storage, `posts/${email}/profilpicture/`);

        try {
            const listResult = await listAll(profilePicturesRef);
            await Promise.all(listResult.items.map(itemRef => deleteObject(itemRef)));

            const response = await fetch(uri);
            const blob = await response.blob();

            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const newProfileImageRef = ref(storage, `posts/${email}/profilpicture/${filename}`);

            await uploadBytes(newProfileImageRef, blob);
            const downloadURL = await getDownloadURL(newProfileImageRef);

            Alert.alert('Success', 'Image uploaded successfully!');
            setProfileImageUrl(downloadURL);

        } catch (error) {
            console.error('Upload failed:', error);
            Alert.alert('Upload failed', error.message);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }}>
            <View style={styles.headerContainer}>
                <Image
                    style={styles.headerImage}
                    source={require('../image/bg.jpg')}
                />
                <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
                    <Feather name={'settings'} size={25} color={'white'} />
                </TouchableOpacity>
                <View style={styles.profileAndStatsContainer}>
                        <View style={styles.profileImageWrapper}>
                            <Image
                                source={profileImageUrl ? { uri: profileImageUrl } : require('../image/profileicon.png')}
                                style={styles.profileImage}
                            />
                            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
                                <Icon  name={'pen'} size={15} color={'white'} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userStats}>
                            <TouchableOpacity onPress={() => {
                                router.push({
                                    pathname: '/showFriend',
                                    params: { userEmail: email,check:'following'}
                                });
                            }} style={styles.statsItem}>
                                <Text style={styles.statsValue}>{followingCount}</Text>
                                <Text style={styles.statsLabel}>Following</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                router.push({
                                    pathname: '/showFriend',
                                    params: { userEmail: email,check:'followers'}
                                });
                            }} style={styles.statsItem}>
                                <Text style={styles.statsValue}>{followersCount}</Text>
                                <Text style={styles.statsLabel}>Followers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.statsItem}>
                                <Text style={styles.statsValue}>{postCount}</Text>
                                <Text style={styles.statsLabel}>Posts</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

            </View>
            <View style={styles.userInfoContainer}>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{firstName}</Text>
                    <Text style={styles.profileBio}>Kullanıcının kendisini açıkladığı kısım bu kısım</Text>
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setSelectedIcon('heart')}>
                        <Icon name={'heart'} size={25} color={selectedIcon === 'heart' ? 'white' : '#a9a9a9'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setSelectedIcon('videocam')}>
                        <Ionicons name={'videocam-outline'} size={25} color={selectedIcon === 'videocam' ? 'white' : '#a9a9a9'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setSelectedIcon('bookmark')}>
                        <MaterialIcons name={'bookmark-outline'} size={25} color={selectedIcon === 'bookmark' ? 'white' : '#a9a9a9'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.imageGrid}>
                {renderImages()}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    profileAndStatsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal:15,
    },
    profileImageWrapper: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        bottom:50,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editIcon: {
        position:'absolute',
        alignSelf:'flex-end',
        backgroundColor:'rgba(0,0,0,0.7)',
        padding:5,
        borderRadius:20,
        bottom:-12
    },
    userStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    statsItem: {
        alignItems: 'center',
        flex: 1,
    },
    statsValue: {
        fontWeight: '500',
        fontSize: 17,
        textAlign: 'center',
        color: 'white',
    },
    statsLabel: {
        textAlign: 'center',
        color: '#a9a9a9',
    },
    headerContainer: {
        backgroundColor: 'black',
        height: 200,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    profileImageContainer: {
        alignItems: 'center',
    },
    userInfoContainer: {
        marginTop: 60,
        alignSelf: 'center',
        width: '80%',
    },
    profileInfo: {
        alignItems: 'baseline',
        borderColor:'white',
        borderWidth:0
    },
    profileName: {
        fontWeight: '500',
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    profileBio: {
        textAlign: 'center',
        color: '#a9a9a9',
        marginVertical: 10,
    },
    logoutButton: {
        position:'absolute',
        alignSelf:'flex-end',
        padding:20,
        top:30
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
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
    iconButton: {
        width: 70,
        alignItems: 'center',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
    },
    imageContainer: {
        marginBottom: 10,
        marginHorizontal: 3,
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
    noImagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
        marginTop: 20,
    },
    noImagesText: {
        color: '#a9a9a9',
        fontSize: 16,
    },
});

export default Profile;


