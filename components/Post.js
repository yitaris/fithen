import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const Posts = () => {
    const [images, setImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            const imagesCollection = collection(firestore, 'photos');
            const imagesSnapshot = await getDocs(imagesCollection);
            const imageItems = imagesSnapshot.docs.map(doc => ({
                imageUrl: doc.data().imageUrl,
                userName: doc.data().userName, // Assuming the userName field exists in the document
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
                        <Text style={styles.userNameText}>{item.userName}</Text>
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
        borderWidth: 7,
        borderColor: 'rgba(142, 50, 51, .3)',
        width: '90%',
        alignSelf: 'center',
        height: 350,
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
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        paddingLeft:10,
        justifyContent: 'center', // Center the text
        alignItems: 'flex-start', // Center the text
    },
    userNameText: {
        color: 'white', // Make the text white for better visibility
        fontWeight: 'bold',
        fontSize: 20,
    }
});

export default Posts;