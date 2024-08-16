import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebaseConfig';
import useUserStore from '../store';
import { useLocalSearchParams } from 'expo-router';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const { firstName } = useUserStore();
    const { name } = useLocalSearchParams();

    // Combine the initials of firstName and name
    const initials = `${firstName[0]}${name[0]}`.toUpperCase();
    console.log("Initials:", initials);

    useEffect(() => {
        const collectionName = `${initials}_messages`;
        const q = query(collection(db, collectionName), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messages);
        });

        return () => unsubscribe();
    }, [initials]);

    const handleSend = async () => {
        if (text.length > 0) {
            const collectionName = `${initials}_messages`;
            await addDoc(collection(db, collectionName), {
                text: text,
                createdAt: new Date(),
                sender: firstName,
            });
            setText('');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.message}>
            <Text>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text>{firstName}</Text>
            <Text>{name}</Text>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Type your message..."
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    message: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
        marginVertical: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        marginBottom: 100,
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
        marginRight: 10,
    },
    sendButton: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Chat;
