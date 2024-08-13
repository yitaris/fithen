import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Image } from "react-native";
import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        // Firestore'dan emailleri ve profil resimlerini çekme
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "users"));
                const storage = getStorage(); // Firebase Storage referansı
                const userList = await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const email = doc.id; // Her belgenin ID'si email adresi
                    const imageRef = ref(storage, `posts/${email}/profilpicture/`); // Firebase Storage'daki resim yolu

                    try {
                        // Klasördeki tüm dosyaları listele
                        const result = await listAll(imageRef);
                        let imageUrl = null;

                        // Eğer klasörde dosya varsa, ilk dosyanın URL'sini al
                        if (result.items.length > 0) {
                            const firstFileRef = result.items[0];
                            imageUrl = await getDownloadURL(firstFileRef);
                        }
                        return { email, imageUrl };
                    } catch (error) {
                        console.error("Error fetching image URL: ", error);
                        return { email, imageUrl: null }; // Resim yoksa imageUrl null olur
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
        // Arama sorgusuna göre kullanıcıları filtreleme
        if (searchQuery.trim() === '') {
            setFilteredUsers([]); // Arama çubuğu boşken listeyi temizle
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
            />
            {searchQuery.trim() !== '' && (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.emailContainer}>
                            <Image
                                source={item.imageUrl ? { uri: item.imageUrl } : require('../image/profileicon.png')} // Profil resmi ya da default resim
                                style={styles.profileImage}
                            />
                            <Text style={styles.emailText}>{item.email}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    emailText: {
        fontSize: 18,
        color: '#333',
    }
});

export default UsersList;
