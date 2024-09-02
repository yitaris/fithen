import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image
} from "react-native";
import { auth, getStorage, listAll, ref, getDownloadURL } from "firebase/storage";
import useUserStore from '../store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import LastActivity from "../components/LastActivity";
import WaterActivity from '../components/WaterActivity';
import OverallStatus from "../components/OverallStatus";

const FitHome = () => {
    const { email, lastName } = useUserStore();
    const [profileImageUrl, setProfileImageUrl] = useState(null);

    useEffect(() => {
        const RegisterComponent = async () => {
            await AsyncStorage.setItem('@userRegistered', 'true');
        }
        RegisterComponent();
    }, []);

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
        fetchProfileImage();
    }, []);

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false} // Dikey kaydırma çubuğunu gizlemek için
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => { router.push('/Profile') }}>
                        <Image
                            source={profileImageUrl ? { uri: profileImageUrl } : require('../image/profileicon.png')}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <View style={styles.textContainer}>
                        <Text>Welcome Back🎉</Text>
                        <Text style={styles.userName}>{lastName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { router.push('/Plus') }}>
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../image/bellicon.png')}
                                style={styles.bellIcon}
                            />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationText}>1</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.waterActivityContainer}>
                    <WaterActivity />
                </View>

                <LastActivity />

                <OverallStatus />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    scrollContainer: {
        padding: 15,
        paddingBottom: 200, // ScrollView içeriğinin alt kısmını görmek için ekstra boşluk eklenir
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 60,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    userName: {
        fontSize: 25,
        fontWeight: '600',
    },
    iconContainer: {
        position: 'relative',
    },
    bellIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    notificationBadge: {
        position: 'absolute',
        top: 15,
        right: 7,
        width: 23,
        height: 23,
        borderRadius: 12,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        color: '#fff',
    },
    waterActivityContainer: {
        width: '100%',
        height: 150, // Sabit yükseklik ayarı ile WaterActivity bileşeni
        marginBottom: 30,
    },
});

export default FitHome;
