import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc, where, getDocs, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import useUserStore from '../store';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const { firstName } = useUserStore();
    const { name } = useLocalSearchParams();

    // Kullanıcı isimlerini alfabetik olarak sıralıyoruz
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

            // Eğer son mesajı gönderen kullanıcı kendisi değilse ve mesaja dokunmamışsa süre başlat
            if (fetchedMessages.length > 0) {
                const lastMessage = fetchedMessages[fetchedMessages.length - 1];
                if (lastMessage.sender !== firstName && !lastMessage.saved) {
                    startDeletionTimer(lastMessage.id);
                }
            }
        });

        return () => unsubscribe();
    }, [chatId]);

    // Dokunulmamış mesajları silme işlemi
    useEffect(() => {
        const deleteUnsavedMessages = async () => {
            const unsavedMessagesQuery = query(collection(db, chatId), where('saved', '==', false));
            const querySnapshot = await getDocs(unsavedMessagesQuery);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        };

        deleteUnsavedMessages(); // Dokunulmamış mesajları uygulama başladığında sil
    }, [chatId]);

    const handleSend = async () => {
        if (text.trim().length > 0) {
            await addDoc(collection(db, chatId), {
                text: text,
                createdAt: new Date(),
                sender: firstName,
                saved: false, // Mesaj başlangıçta kaydedilmemiş olarak başlar
            });
            setText('');
        }
    };

    const handleSaveMessage = async (messageId) => {
        const messageRef = doc(db, chatId, messageId);
        await updateDoc(messageRef, { saved: true }); // Mesaja dokunulduğunda 'saved' alanını true yapar
    };

    // Mesaj silme zamanlayıcısı
    const startDeletionTimer = (messageId) => {
        setTimeout(async () => {
            const messageRef = doc(db, chatId, messageId);
            const messageSnapshot = await getDoc(messageRef);

            if (messageSnapshot.exists()) {
                const messageData = messageSnapshot.data();
                if (!messageData.saved) {
                    await deleteDoc(messageRef); // Mesajı sil
                }
            }
        }, 3600000); // 1 saat sonra sil (3600000 ms = 1 saat)
    };

    // Resim seçme ve gönderme işlemi
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0].uri;
            await addDoc(collection(db, chatId), {
                imageUrl: selectedImage,
                createdAt: new Date(),
                sender: firstName,
                saved: false, // Mesaj başlangıçta kaydedilmemiş olarak başlar
            });
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleSaveMessage(item.id)} // Mesaja dokunulduğunda kaydet
            onLongPress={() => Alert.alert("Message Long Pressed!")} // Uzun basma işlemi örneği
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
        paddingBottom: 100, // Alt kısımda boşluk bırakmak için
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
