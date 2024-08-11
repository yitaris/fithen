import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import useUserStore from '../../store';

const RegisterSecond = () => {
    const {day,month,year,setDay,setMonth,setYear} = useUserStore();
    const { width, height } = useWindowDimensions();
    const [date, setDate] = useState(null);
    const [showContinue, setShowContinue] = useState(false);


    const topImageAnim = useSharedValue(width);
    const bottomImageAnim = useSharedValue(-width);
    const textFirstAnim = useSharedValue(-height);
    const textFirstAnimX = useSharedValue(-width);
    const textSecondAnim = useSharedValue(-height);
    const textSecondAnimX = useSharedValue(-width);

    useEffect(() => {
        topImageAnim.value = withSpring(0, { damping: 100, stiffness: 100 });
        bottomImageAnim.value = withSpring(0, { damping: 100, stiffness: 100 });
        textFirstAnim.value = withSpring(-height / 3, { damping: 50, stiffness: 100 });
        textFirstAnimX.value = withSpring(-width / 3, { damping: 50, stiffness: 100 });
        textSecondAnim.value = withSpring(-height / 4, { damping: 50, stiffness: 100 });
        textSecondAnimX.value = withSpring(-width / 10, { damping: 50, stiffness: 100 });
    }, [height]);

    const topImageStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: topImageAnim.value }] };
    });

    const bottomImageStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: bottomImageAnim.value }] };
    });

    const textFirstStyle = useAnimatedStyle(() => {
        return { transform: [{ translateY: textFirstAnim.value }, { translateX: textFirstAnimX.value }] };
    });

    const textSecondStyle = useAnimatedStyle(() => {
        return { transform: [{ translateY: textSecondAnim.value }, { translateX: textSecondAnimX.value }] };
    });

    const handleFocus = () => {
        topImageAnim.value = withSpring(width, { damping: 100, stiffness: 100 });
        bottomImageAnim.value = withSpring(-width, { damping: 100, stiffness: 100 });
        textFirstAnim.value = withSpring(-height, { damping: 50, stiffness: 100 });
        textSecondAnim.value = withSpring(-height, { damping: 50, stiffness: 100 });
    };

    const handleBlur = () => {
        topImageAnim.value = withSpring(0, { damping: 100, stiffness: 100 });
        bottomImageAnim.value = withSpring(0, { damping: 100, stiffness: 100 });
        textFirstAnim.value = withSpring(-height / 3, { damping: 50, stiffness: 100 });
        textSecondAnim.value = withSpring(-height / 4, { damping: 50, stiffness: 100 });
    };

    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            // Extract day, month, and year
            const day = selectedDate.getDate();
            const month = selectedDate.getMonth() + 1; // Months are zero-based in JavaScript
            const year = selectedDate.getFullYear();

            setDay(day)
            setMonth(month)
            setYear(year);
            setShowContinue(true);
        }
    };

    const handleContinue = () => {
        // Burada date değerini kaydedebiliriz
        const birthDate = `${day}/${month}/${year}`;
        console.log("Birth Date:", birthDate);
        router.push('/Register/RegisterThird');
    };

    const handleDayChange = (text) => {
        if (text.length <= 2) {
            setDay(text);
        }
    };

    const handleMonthChange = (text) => {
        if (text.length <= 2) {
            setMonth(text);
        }
    };

    const handleYearChange = (text) => {
        if (text.length <= 4) {
            setYear(text);
        }
    };


    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
            <View style={styles.container}>
                <Animated.Image style={[styles.image, topImageStyle]} source={require('../../image/topimage.png')} />
                <Animated.Image style={[styles.image, bottomImageStyle]} source={require('../../image/bottomimage.png')} />
                <Animated.Text style={[styles.text, textFirstStyle, { color: 'white' }]}>For</Animated.Text>
                <Animated.Text style={[styles.text, textSecondStyle, { color: 'rgba(255,0,0,0.8)', fontSize: 40 }]}>Birthday Party</Animated.Text>

                <View style={{ width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                    {Platform.OS === 'ios' && (
                        <>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date || new Date()}
                                mode="date"
                                display="inline"
                                onChange={onDateChange}  // Tarih değiştiğinde çağrılır
                                accentColor="red"
                            />
                            {showContinue && (
                                <TouchableOpacity style={styles.button} onPress={handleContinue}>
                                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 20, textAlign: 'center' }}>Continue 2/5</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {Platform.OS === 'android' && (
                        <>
                            <Text style={styles.label}>Enter Birth Date:</Text>
                            <View style={styles.dateInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="DD"
                                    placeholderTextColor="rgba(255,0,0,0.5)"
                                    keyboardType="numeric"
                                    value={day}
                                    onChangeText={handleDayChange}
                                    maxLength={2}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                                <Text style={styles.separator}>/</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="MM"
                                    placeholderTextColor="rgba(255,0,0,0.5)"
                                    keyboardType="numeric"
                                    value={month}
                                    onChangeText={handleMonthChange}
                                    maxLength={2}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                                <Text style={styles.separator}>/</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY"
                                    placeholderTextColor="rgba(255,0,0,0.5)"
                                    keyboardType="numeric"
                                    value={year}
                                    onChangeText={handleYearChange}
                                    maxLength={4}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                                <Text style={styles.buttonText}>Continue 2/5</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e'
    },
    text: {
        fontSize: 50,
        textAlign: 'center',
        fontWeight: '700',
        position: 'absolute',
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    label: {
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,0,0,0.5)',
        color: 'white',
        fontSize: 18,
        padding: 5,
        width: 50,
        textAlign: 'center',
    },
    separator: {
        color: 'white',
        fontSize: 18,
        marginHorizontal: 5,
    },
    button: {
        marginTop: 20,
        backgroundColor: 'rgba(255,0,0,0.6)',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RegisterSecond;
