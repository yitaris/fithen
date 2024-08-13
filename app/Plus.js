import React, { useState } from 'react';
import { View, Button, Image, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, firestore, auth } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUserStore from '../store';

const Plus = () => {
    const [imageUri, setImageUri] = useState(null);
    const { email, firstName, day } = useUserStore();

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

    const sanitizeEmail = (email) => {
        return email.replace(/[@.]/g, '_');
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
                    userEmail:email,
                    userName: displayName,
                    imageUrl: downloadURL,
                    createdAt: new Date(),
                });

                Alert.alert('Success', 'Image uploaded successfully!');

            } catch (error) {
                console.error('Upload failed:', error);
                Alert.alert('Upload failed', error.message);
            }
        }

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
