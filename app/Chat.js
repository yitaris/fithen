import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "firebase/storage";
import { db } from '../firebaseConfig';
import useUserStore from '../store';
import { useLocalSearchParams } from 'expo-router';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const { firstName } = useUserStore();
    const { name } = useLocalSearchParams();
    const storage = getStorage();

    const sortedNames = [firstName.toLowerCase(), name.toLowerCase()].sort();
    const chatId = `${sortedNames[0]}_${sortedNames[1]}_messages`;
    const storageRef = ref(storage, chatId);

    useEffect(() => {
        const q = query(collection(db, chatId), orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const fetchedMessages = [];
            for (let doc of snapshot.docs) {
                const message = doc.data();
                const storageMessageRef = ref(storageRef, `${doc.id}.txt`);
                const url = await getDownloadURL(storageMessageRef);
                fetchedMessages.push({
                    id: doc.id,
                    text: await fetch(url).then(res => res.text()), // Fetch text from storage
                    ...message,
                });
            }
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [chatId]);

    useEffect(() => {
        const onlineRef = doc(db, 'onlineUsers', firstName);
        const setOnlineStatus = async () => {
            await setDoc(onlineRef, { online: true, lastSeen: new Date() }, { merge: true });
        };

        const unsubscribe = onSnapshot(doc(db, 'onlineUsers', name), async (docSnapshot) => {
            if (docSnapshot.exists() && !docSnapshot.data().online) {
                await handleUserLeft();
            }
        });

        setOnlineStatus();

        return () => {
            setDoc(onlineRef, { online: false }, { merge: true });
            unsubscribe();
        };
    }, [name]);

    const handleUserLeft = async () => {
        const otherUserDoc = await getDoc(doc(db, 'onlineUsers', name));
        if (!otherUserDoc.exists() || !otherUserDoc.data().online) {
            // If both users are offline, delete all messages from Firestore
            const messageQuerySnapshot = await getDocs(collection(db, chatId));
            for (let docSnapshot of messageQuerySnapshot.docs) {
                const storageMessageRef = ref(storageRef, `${docSnapshot.id}.txt`);
                await deleteObject(storageMessageRef);
                await deleteDoc(docSnapshot.ref);
            }
        } else {
            // If only one user left, delete messages only from Storage
            const messageQuerySnapshot = await getDocs(collection(db, chatId));
            for (let docSnapshot of messageQuerySnapshot.docs) {
                const storageMessageRef = ref(storageRef, `${docSnapshot.id}.txt`);
                await deleteObject(storageMessageRef);
            }
        }
    };

    const handleSend = async () => {
        if (text.trim().length > 0) {
            const messageRef = await addDoc(collection(db, chatId), {
                createdAt: new Date(),
                sender: firstName,
            });
            const storageMessageRef = ref(storageRef, `${messageRef.id}.txt`);
            await uploadBytes(storageMessageRef, text);
            setText('');
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
        paddingBottom: 100,
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
        backgroundColor: 'red',
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
