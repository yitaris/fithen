import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebaseConfig';
import useUserStore from '../store';
import { useLocalSearchParams } from 'expo-router';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const { firstName } = useUserStore(); // Kullanıcı 1'in adı
    const { name } = useLocalSearchParams(); // Kullanıcı 2'nin adı

    // Kullanıcı isimlerini alfabetik olarak sıralıyoruz
    const sortedNames = [firstName.toLowerCase(), name.toLowerCase()].sort();
    const chatId = `${sortedNames[0]}_${sortedNames[1]}_messages`; // Alfabetik olarak sıralanmış koleksiyon adı

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
            });
            setText(''); // Mesaj gönderildikten sonra input sıfırlanıyor
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.sender === firstName ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
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
        borderRadius: 15,
        marginVertical: 5,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    sentMessage: {
        backgroundColor: '#0078fe',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#f1f1f1',
    },
    messageText: {
        color: '#fff',
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
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Chat;
