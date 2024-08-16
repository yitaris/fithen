import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { firestore } from "../firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";

const ShowFriend = () => {
    const { userEmail, check } = useLocalSearchParams();
    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                // Firestore'daki kullanıcı dökümanını çek
                const userDocRef = doc(firestore, `users/${userEmail}`);
                const userDocSnap = await getDoc(userDocRef);


                // Kullanıcı dökümanı var mı kontrol et
                if (userDocSnap.exists()) {
                    // following dizisini al
                    const userData = userDocSnap.data();
                    const followingData = userData.following || [];
                    const followersData = userData.followers || [];

                    console.log("Following Data:", followingData); // Debugging
                    setFollowingList(followingData);
                    setFollowersList(followersData)
                } else {
                    console.log("No such document!");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching following:", error);
                setLoading(false);
            }
        };

        fetchFollowing();
    }, [userEmail]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#bf2929" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {check === 'following' ? (
                <FlatList
                    data={followingList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.followingText}>{item}</Text>
                        </View>
                    )}
                />
            ) : (
                <FlatList
                    data={followersList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.followingText}>{item}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a', // Arka plan rengi
        justifyContent: 'center',
        padding: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    loadingText: {
        color: '#e5e5e5',
        fontSize: 18,
        marginTop: 10,
    },
    infoText: {
        fontSize: 20,
        color: '#e5e5e5',
        textAlign: 'center',
        marginTop: 20,
    },
    card: {
        backgroundColor: '#2b2b2b', // Kart rengi
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    followingText: {
        fontSize: 18,
        color: '#e5e5e5',
    }
});

export default ShowFriend;
