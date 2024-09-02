import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image,SafeAreaView } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db, storage } from '../firebaseConfig'; // Import storage from your firebaseConfig
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For Firebase Storage
import useUserStore from '../store';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';


const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const { firstName } = useUserStore();
    const { name } = useLocalSearchParams();

    // Alphabetically sorting user names for chat ID
    const sortedNames = [firstName.toLowerCase(), name.toLowerCase()].sort();
    const chatId = `${sortedNames[0]}_${sortedNames[1]}_messages`;

    useEffect(() => {
        const q = query(collection(db, chatId), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSend = async () => {
        if (text.trim().length > 0) {
            await addDoc(collection(db, chatId), {
                text: text,
                createdAt: new Date(),
                sender: firstName,
                saved: true, // All messages are now saved by default
            });
            setText('');
        }
    };

    // Function to upload image to Firebase Storage and return the public URL
    const uploadImageAsync = async (uri) => {
        const blob = await (await fetch(uri)).blob();
        const storageRef = ref(storage, `chat_images/${uuid.v4()}`); // Generate a unique name for the image

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    // Picking image and uploading to Firebase Storage
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            const downloadURL = await uploadImageAsync(selectedImageUri);

            await addDoc(collection(db, chatId), {
                imageUrl: downloadURL,
                createdAt: new Date(),
                sender: firstName,
                saved: true, // Images are saved by default
            });
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleSaveMessage(item.id)} // Handle save when pressed (for future use)
            onLongPress={() => Alert.alert("Message Long Pressed!")} // Example of long press handling
            style={[styles.messageContainer, item.sender === firstName ? styles.sentMessage : styles.receivedMessage]}
        >
            {item.text ? (
                <Text style={styles.messageText}>{item.text}</Text>
            ) : (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Type your message..."
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                    <Text style={styles.sendButtonText}>Image</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    messagesList: {
        padding: 10,
        paddingBottom: 100, // Space at the bottom
    },
    messageContainer: {
        padding: 10,
        borderRadius: 12,
        marginVertical: 5,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    sentMessage: {
        backgroundColor: '#0078fe',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: 'red',
    },
    messageText: {
        color: '#fff',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#333',
        marginBottom:100,
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#444',
        borderRadius: 10,
        color: '#fff',
        marginRight: 10,
    },
    sendButton: {
        padding: 10,
        backgroundColor: '#0078fe',
        borderRadius: 10,
    },
    imageButton: {
        padding: 10,
        backgroundColor: '#444',
        borderRadius: 10,
        marginLeft: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Chat;
