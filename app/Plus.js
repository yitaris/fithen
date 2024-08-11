import React, { useState, useEffect } from 'react';
import { View, Button, Image, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, firestore, auth } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, doc, getDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUserStore from '../store';

const Plus = () => {
    const [imageUri, setImageUri] = useState(null);
    const { email, firstName, day, setFirstName } = useUserStore(); // Zustand'dan kullanıcı bilgilerini alın
    const [set,setSet] = useState(true);
    useEffect(() => {
        const fetchUserData = async () => {
            if (set) {
                try {
                    const docRef = doc(firestore, "users", email);
                    const docData = await getDoc(docRef);

                    if (docData.exists()) {
                        setFirstName(docData.data().firstName);
                        console.log("First Name: ", docData.data().firstName);
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            }
        };

        fetchUserData();
    }, [email]);

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
            uploadImage(result.assets[0].uri);
        }
    };

    const sanitizeEmail = (email) => {
        return email.replace(/[@.]/g, '_');
    };

    const uploadImage = async (uri) => {
        const user = auth.currentUser;
        if (user) {
            const email = sanitizeEmail(user.email);
            const displayName = firstName || "Anonymous"; // Zustand'dan kullanıcı adını alın

            const response = await fetch(uri);
            const blob = await response.blob();

            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const storageRef = ref(storage, `posts/${email}/images/${filename}`);

            uploadBytes(storageRef, blob).then(async (snapshot) => {
                console.log('Uploaded a blob or file!', snapshot);
                const downloadURL = await getDownloadURL(snapshot.ref);
                console.log('File available at', downloadURL);

                // Firestore'a fotoğraf URL'sini ve kullanıcı adını ekleyin
                await addDoc(collection(firestore, 'photos'), {
                    userEmail: user.email,
                    userName: displayName,
                    imageUrl: downloadURL,
                    createdAt: new Date(),
                });
            }).catch((error) => {
                console.error('Upload failed:', error);
                Alert.alert('Upload failed', error.message);
            });
        } else {
            console.error('No user is signed in.');
        }
    };

    return (
        <SafeAreaView>
            <View>
                <Text>Fotoğraf Yükle</Text>
                <Button title="Choose Image" onPress={pickImage} />
                {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}

                {/* Giriş yapan kullanıcının bilgilerini ekranda göster */}
                <Text style={{ color: '#1e1e1e' }}>Kullanıcı Adı: {firstName}</Text>
                <Text>Email: {email}, Day: {day}</Text>
            </View>
        </SafeAreaView>
    );
};

export default Plus;
