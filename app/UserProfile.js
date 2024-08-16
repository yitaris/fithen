import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useUserStore from "../store";
import Feather from "react-native-vector-icons/Feather";
import {router} from "expo-router";

const UserProfile = () => {
    const { firstName, userEmail } = useLocalSearchParams();
    const { width } = useWindowDimensions();
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [postCount, setPostCount] = useState(0);
    const [followingCount,setFollowingCount] = useState(0);
    const [followersCount,setFollowersCount] = useState(0);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false); // Arkadaş olup olmadığını takip etmek için
    const [isRequestSent, setIsRequestSent] = useState(false); // İstek gönderilip gönderilmediğini takip etmek için
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
                setProfilePicture(null); // Eğer resim yoksa null veya varsayılan bir resim ayarlayın
            }
        } catch (error) {
            console.error("Profil resmi getirilirken hata oluştu: ", error);
        }
    };



    useEffect(() => {
        console.log("Kullanıcının adı:", firstName);
        fetchProfilePicture(); // Bileşen yüklendiğinde profil resmini getir
        checkIfFollowingOrRequested();// Arkadaş olup olmadığını veya istek gönderilip gönderilmediğini kontrol et
    }, [firstName]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const userDocRef = doc(firestore, `users/${userEmail}`);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const currentUserEmail = useUserStore.getState().email;

                // Postları al
                const q = query(collection(firestore, 'post'), where('userEmail', '==', userEmail));
                const querySnapshot = await getDocs(q);

                const imagesList = querySnapshot.docs.map(doc => doc.data().imageUrl);

                // Post sayısını her zaman güncelle
                setPostCount(imagesList.length);

                // Eğer kullanıcı arkadaş listesinde ise resimleri göster
                const friendsList = userData.followers || [];
                if (friendsList.includes(currentUserEmail)) {
                    setImages(imagesList);
                } else {
                    setImages([]); // Takip edilmiyorsa resimler boş
                }

                // Arkadaş sayısını çekme işlemi
                const docRef = doc(firestore, `users/${userEmail}`);
                const docSnap = await getDoc(docRef);

                const userDatas = docSnap.data();
                const friendsLength = userDatas.following || [];
                const followersLength = userDatas.followers || [];
                setFollowingCount(friendsLength.length);
                setFollowersCount(followersLength.length);
            } else {
                console.error("User document does not exist!");
                setImages([]);
                setPostCount(0);
                setFollowingCount(0);
                setFollowersCount(0)
            }
        } catch (error) {
            console.error("FetchImages Error:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        fetchImages();
    }, []);

    const checkIfFollowingOrRequested = async () => {
        try {
            const userDocRef = doc(firestore, `users/${userEmail}`);
            const userDocSnap = await getDoc(userDocRef);
            const { firstName, email } = useUserStore.getState();
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const friendsList = userData.followers || [];
                const requestList = userData.request || [];
                const currentUserEmail = firstName + ' ' + email;
                if (friendsList.includes(email)) {
                    setIsFollowing(true);
                } else if (requestList.includes(currentUserEmail)) {
                    setIsRequestSent(true);
                } else {
                    setIsFollowing(false);
                    setIsRequestSent(false);
                }
            }
        } catch (error) {
            console.error("Takip durumu kontrol edilirken hata oluştu: ", error);
        }
    };

    // Takip isteği güncelleme
    const updateFollowRequest = async () => {
        try {
            const { firstName, email } = useUserStore.getState();
            const userDocRef = doc(firestore, "users", userEmail);

            await updateDoc(userDocRef, {
                request: arrayUnion(firstName + ' ' + email)
            });

            setIsRequestSent(true);
            console.log("Takip isteği başarıyla güncellendi!");
        } catch (error) {
            console.error("Takip isteği güncellenirken hata oluştu: ", error);
        }
    };

    // Takip etme düğmesine basıldığında
    const handleFollowPress = () => {
        if (!isFollowing && !isRequestSent) {
            updateFollowRequest();
        }
    };

    useEffect(() => {
        fetchProfilePicture();
        checkIfFollowingOrRequested();
    }, [firstName, userEmail]);

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

        const itemWidth = width / 3 - 10;
        const itemHeight = width / 3;

        return images.map((item, index) => (
            <View key={index} style={[styles.imageContainer, { width: itemWidth, height: itemHeight }]}>
                <Image source={{ uri: item }} style={styles.image} />
            </View>
        ));
    };

    const navigation = ()=>{
        router.navigate('/Chat')
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom }}>
            <View style={styles.headerContainer}>
                <Image
                    style={styles.headerImage}
                    source={require('../image/bg.jpg')}
                />
                <View style={styles.profileAndStatsContainer}>
                    <View style={styles.profileImageWrapper}>
                        <Image
                            source={profilePicture ? { uri: profilePicture } : require('../image/profileicon.png')}
                            style={styles.profileImage}
                        />
                    </View>
                    <View style={styles.userStats}>
                        <TouchableOpacity onPress={() => {
                            router.push({
                                pathname: '/showFriend',
                                params: { userEmail: userEmail,check:'following'}
                            });
                        }} style={styles.statsItem}>
                            <Text style={styles.statsValue}>{followingCount}</Text>
                            <Text style={styles.statsLabel}>Following</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            router.push({
                                pathname: '/showFriend',
                                params: { userEmail: userEmail,check:'followers'}
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
                    <View style={{flexDirection:'row',width:'90%',justifyContent:'space-between'}}>
                        <TouchableOpacity
                            style={[
                                styles.followButton,
                                { backgroundColor: isFollowing ? '#270f0f' : isRequestSent ? 'orange' : '#950101' }
                            ]}
                            onPress={handleFollowPress}
                            disabled={isFollowing || isRequestSent} // Eğer kullanıcı takip ediyorsa veya istekte bulunduysa buton disable olsun
                        >
                            <Text style={styles.followButtonText}>
                                {isFollowing ? 'Already Following' : isRequestSent ? 'Request Sent' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigation}
                         style={[styles.followButton,{backgroundColor:'#5AB2FF'}]}>
                            <Text style={styles.followButtonText}>Messages</Text>
                        </TouchableOpacity>
                    </View>
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
    followButton: {
        alignSelf: 'baseline',
        borderRadius: 9,
        padding:14
    },
    followButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '500',
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
export default UserProfile;
