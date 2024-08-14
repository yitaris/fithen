import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import useUserStore from "../store";
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
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
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const { email, firstName } = useUserStore();
    const insets = useSafeAreaInsets();
    const [imageUri, setImageUri] = useState(null);

    const logOut =  async () => {
        await AsyncStorage.setItem('@userLogout', 'false');
        router.replace('/Login')
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
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchProfileImage = async () => {
        const storage = getStorage();
        const profileImageRef = ref(storage, `posts/${email}/profilpicture/`); // Profil resmi klasörü

        try {
            const listResult = await listAll(profileImageRef);

            if (listResult.items.length > 0) {
                // İlk resmi alıyoruz
                const firstImageRef = listResult.items[0];
                const url = await getDownloadURL(firstImageRef);
                setProfileImageUrl(url);
            } else {
                console.error("No images found in the profilpicture folder.");
                setProfileImageUrl(null); // Default resim gösterebiliriz
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
            setProfileImageUrl(null); // Eğer resim alınamazsa, default resim gösterilebilir
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

        const itemWidth = width / 3 - 10; // Width for 3 items in a row
        const itemHeight = width / 3;     // Height to maintain aspect ratio

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
            await uploadImage(result.assets[0].uri); // await ekleyin
        }
    };

    const uploadImage = async (uri) => {
        const displayName = firstName || "Anonymous";
        const storage = getStorage();
        const profilePicturesRef = ref(storage, `posts/${email}/profilpicture/`);

        try {
            // Delete all existing profile pictures before uploading the new one
            const listResult = await listAll(profilePicturesRef);

            await Promise.all(listResult.items.map(itemRef => deleteObject(itemRef)));

            // Upload the new image
            const response = await fetch(uri);
            const blob = await response.blob();

            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const newProfileImageRef = ref(storage, `posts/${email}/profilpicture/${filename}`);

            await uploadBytes(newProfileImageRef, blob);
            const downloadURL = await getDownloadURL(newProfileImageRef);

            console.log('File available at', downloadURL);
            Alert.alert('Success', 'Image uploaded successfully!');
            setProfileImageUrl(downloadURL);

        } catch (error) {
            console.error('Upload failed:', error);
            Alert.alert('Upload failed', error.message);
        }
    };


    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }}>
            <View style={{ backgroundColor: 'black', height: 200 }}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={require('../image/bg.jpg')}
                />
                <TouchableOpacity onPress={pickImage}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={profileImageUrl ? { uri: profileImageUrl } : require('../image/profileicon.png')}
                            style={styles.profileImage}
                        />
                        <Icon style={{ position: 'absolute', zIndex: 99, bottom: -10, }} name={'pen'} size={25} color={selectedIcon === 'heart' ? 'white' : 'red'} />
                    </View>
                </TouchableOpacity>
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

            <TouchableOpacity onPress={logOut}>
                        <Text style={{color:'white'}}>Çıkış yap</Text>
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
};

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
        borderWidth: 1,
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
