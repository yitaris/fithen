import React, { useState, useEffect, useRef } from 'react';
import { safeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LastActivity = () => {

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={{ fontSize: 25, fontWeight: '500' }}>Last's Activity</Text>
                <TouchableOpacity style={styles.button}>
                    <Text>Edit</Text>
                    <Image
                        source={require('../image/editicon.png')}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', height: '70%', width: '100%', justifyContent: 'space-between' }}>
                <View style={{ width: '30%', borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../image/caloriback.png')} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }} />
                    <Image source={require('../image/caloriesicon.png')} style={{ width: '50%', height: '20%', top: 20, position: 'absolute', zIndex: 1 }} />
                    <Text style={{ fontSize: 20, zIndex: 2, color: '#fff' }}>1.350</Text>
                    <Text style={{ fontSize: 20, zIndex: 2, color: '#fff' }}>Calories</Text>
                </View>

                <View style={{ backgroundColor: 'white', width: '65%', borderRadius: 20, padding: 10,justifyContent:'space-around' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'orange', width: 10, height: 20, borderRadius: 3, marginRight: 10,bottom:5 }}></View>
                            <View>
                                <Text style={{ fontWeight: '500', fontSize: 20 }}>Push-ups</Text>
                                <Text>Biceps, triceps, shoulders</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, marginRight: 5 }}>15</Text>
                            <Text>x3</Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'red', width: 10, height: 20, borderRadius: 3, marginRight: 10,bottom:5 }}></View>
                            <View>
                                <Text style={{ fontWeight: '500', fontSize: 20 }}>Squads</Text>
                                <Text>calves, legs, thighs</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, marginRight: 5 }}>25</Text>
                            <Text>x3</Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'blue', width: 10, height: 20, borderRadius: 3, marginRight: 10,bottom:5 }}></View>
                            <View>
                                <Text style={{ fontWeight: '500', fontSize: 20 }}>Lunges</Text>
                                <Text>calves, hamstrings, glutes</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, marginRight: 5 }}>15</Text>
                            <Text>x3</Text>
                        </View>
                    </View>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height:'40%',
        marginBottom:30,
        backgroundColor:'transparent'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom:20,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default LastActivity;