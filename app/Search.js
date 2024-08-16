import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { router } from "expo-router";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "users"));
                const storage = getStorage();
                const userList = await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const email = doc.id;
                    const { firstName } = doc.data();
                    const imageRef = ref(storage, `posts/${email}/profilpicture/`);
                    try {
                        const result = await listAll(imageRef);
                        let imageUrl = null;
                        if (result.items.length > 0) {
                            const firstFileRef = result.items[0];
                            imageUrl = await getDownloadURL(firstFileRef);
                        }
                        return { email, firstName, imageUrl };
                    } catch (error) {
                        console.error("Error fetching image URL: ", error);
                        return { email, firstName, imageUrl: null };
                    }
                }));
                setUsers(userList);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers([]);
        } else {
            const filtered = users.filter(user =>
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>User Emails</Text>
            <TextInput
                placeholder="Search Emails"
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                style={styles.searchBar}
                placeholderTextColor="#ccc"
            />
            {searchQuery.trim() !== '' && (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                            router.push({
                                pathname: '/UserProfile',
                                params: { userEmail: item.email, firstName: item.firstName }
                            });
                        }}>
                            <View style={styles.emailContainer}>
                                <Image
                                    source={item.imageUrl ? { uri: item.imageUrl } : require('../image/profileicon.png')}
                                    style={styles.profileImage}
                                />
                                <Text style={styles.emailText}>{item.email}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: '#1a1a1a',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#f2f2f2',
    },
    searchBar: {
        height: 45,
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#333',
        color: '#fff',
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        backgroundColor: '#2a2a2a',
        borderRadius: 15,
        marginBottom: 10,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    emailText: {
        fontSize: 18,
        color: '#f2f2f2',
    }
});

export default UsersList;
