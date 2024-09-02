import React from "react";
import { Image, View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const UsersList = () => {
    return (
        <View style={styles.container}>
            <View style={styles.btnContainer}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Cardio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Muscle Building</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Diet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Yoga</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={{ marginTop: 20 }}></View>

            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Cardio</Text>
                    <Text style={{ fontWeight: '600', fontSize: 30, marginTop: 5, }}>Yoga</Text>

                </View>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={require('../image/yoga.png')}
                    />
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Cardio</Text>
                    <Text style={{ fontWeight: '600', fontSize: 30, marginTop: 5, }}>Yoga</Text>

                </View>
                <View style={styles.imageContainer}>
                    <Image
                        style={[styles.image, { objectFit: 'cover', width: 200, height: 150 }]}
                        source={require('../image/runner.png')}
                    />
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Cardio</Text>
                    <Text style={{ fontWeight: '600', fontSize: 30, marginTop: 5, }}>Yoga</Text>

                </View>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={require('../image/yoga.png')}
                    />
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Cardio</Text>
                    <Text style={{ fontWeight: '600', fontSize: 30, marginTop: 5, }}>Yoga</Text>

                </View>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={require('../image/yoga.png')}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    btnContainer: {
        marginTop: 50,
    },
    scrollContent: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    btn: {
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 100,
        marginHorizontal: 5,
        backgroundColor: '#ddd',
    },
    btnText: {
        textAlign: 'center',
    },
    content: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#bfcd41',
        width: '95%',
        height: 180,
        borderRadius: 40,
        alignSelf: 'center',
    },
    textContainer: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: '50%',
    },
    titleText: {
        fontSize: 16,
    },
    imageContainer: {
        width: '50%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    image: {
        width: 180,
        height: 150,

    },
});

export default UsersList;
