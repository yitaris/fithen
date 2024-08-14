import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack, Slot } from 'expo-router';
import BottomTabs from '../components/BottomTabs';

const App = () => {
    return (
        <>
            {/* Stack Navigator */}
            <Stack screenOptions={{ headerShown: false }}>

                {/* Add more screens as needed */}
            </Stack>

            {/* Bottom Tabs Navigator */}
            <BottomTabs />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ADBC9F',
    },
});

export default App;
