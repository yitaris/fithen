import React, { useState } from 'react';
import { View, Button, Image, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, firestore } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUserStore from '../store';

const Plus = () => {
    const [imageUri, setImageUri] = useState(null);
    const { email, firstName } = useUserStore();

    const requestPermissions = async () => {
        const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        return mediaLibraryStatus.status === 'granted' && cameraStatus.status === 'granted';
    };

    const pickImage = async () => {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) {
            Alert.alert('Sorry, we need camera and gallery permissions to make this work!');
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

    const takePhoto = async () => {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) {
            Alert.alert('Sorry, we need camera and gallery permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
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

        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const storageRef = ref(storage, `posts/${email}/images/${filename}`);

            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            console.log('File available at', downloadURL);

            await addDoc(collection(firestore, 'post'), {
                userEmail: email,
                userName: displayName,
                imageUrl: downloadURL,
                createdAt: new Date(),
            });

            Alert.alert('Success', 'Image uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            Alert.alert('Upload failed', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Upload a Photo</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Text style={styles.buttonText}>Take a Photo</Text>
                </TouchableOpacity>
            </View>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <Text style={styles.userInfo}>Username: {firstName}</Text>
            <Text style={styles.userInfo}>Email: {email}</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#333',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 20,
    },
    userInfo: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
});

export default Plus;
