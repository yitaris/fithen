import React, { useState, useEffect, useRef } from 'react';
import { safeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const OverallStatus = () => {

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={{ fontSize: 25, fontWeight: '500' }}>Overall Status</Text>
                <TouchableOpacity style={styles.button}>
                    <Text>See more</Text>
                    <Image
                        source={require('../image/seemoreicon.png')}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', height: '70%', width: '100%', justifyContent: 'space-between' }}>
    <View style={{ backgroundColor: 'white', width: '100%', borderRadius: 20, padding: 15, justifyContent: 'space-around' }}>
        
        {/* Push-ups */}
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Icon yerine resim */}
                <Image
                    source={require('../image/fireicon.png')}
                    style={{ width: 50, height: 50, resizeMode: 'cover', marginRight: 10 }}
                />
                <View>
                    <Text style={{ fontWeight: '500', fontSize: 20 }}>Calories Loss</Text>
                    <Text>12.100 Kcal</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
                        source={require('../image/progressicon.png')}
                        style={styles.profileImage}
                    /> 
            </View>
        </View>

        {/* Squads */}
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Icon yerine resim */}
                <Image
                    source={require('../image/weighticon.png')}
                    style={{ width: 50, height: 50, resizeMode: 'cover', marginRight: 10 }}
                />
                <View>
                    <Text style={{ fontWeight: '500', fontSize: 20 }}>Weight Loss</Text>
                    <Text>10.2 Kg</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
                        source={require('../image/progressicon.png')}
                        style={styles.profileImage}
                    /> 
            </View>
        </View>

        {/* Lunges */}
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Icon yerine resim */}
                <Image
                    source={require('../image/faticon.png')}
                    style={{ width: 50, height: 50, resizeMode: 'cover', marginRight: 10 }}
                />
                <View>
                    <Text style={{ fontWeight: '500', fontSize: 20 }}>Fat Loss</Text>
                    <Text>205 Gr</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
                        source={require('../image/progressicon.png')}
                        style={styles.profileImage}
                    /> 
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
    },
    profileImage:{
        width:60,
        height:60,
        borderRadius:60
    }
})

export default OverallStatus;