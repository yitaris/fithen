import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { router } from 'expo-router';

const Posts = () => {
    const [images, setImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            const imagesCollection = collection(firestore, 'post');
            const imagesSnapshot = await getDocs(imagesCollection);
            const imageItems = imagesSnapshot.docs.map(doc => ({
                imageUrl: doc.data().imageUrl,
                userName: doc.data().userName, // Assuming the userName field exists in the document
                userEmail: doc.data().userEmail, // Assuming the email field exists in the document
            }));
            setImages(imageItems);
        };

        fetchImages();
    }, []);

    const showInfo = (index) => {
        setSelectedImageIndex(index);
    }

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => showInfo(index)}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                />
                {selectedImageIndex === index &&
                    <BlurView intensity={30} tint='dark' style={styles.blurView}>
                        <TouchableOpacity onPress={() => {
                            router.push({
                                pathname: '/UserProfile',
                                params: {
                                    firstName: item.userName,
                                    userEmail: item.userEmail,
                                }
                            })
                        }}>
                            <Text style={styles.userNameText}>
                            {item.userName.charAt(0).toUpperCase() + item.userName.slice(1)}

                            </Text>
                        </TouchableOpacity>
                    </BlurView>
                }
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        borderWidth: 0,
        borderColor: 'rgba(142, 50, 51, .0)',
        width: '90%',
        height: 350,
        alignSelf: 'center',
        borderRadius: 24,
        marginVertical: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 21,
    },
    blurView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '20%',
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    userNameText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    }
});

export default Posts;
