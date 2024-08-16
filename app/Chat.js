import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

const Chat = () => {
    return (
        <View style={{justifyContent:'center', backgroundColor: 'red', width: '100%', height:100, }}>
            <TouchableOpacity onPress={()=>{router.canGoBack()}}>
            <Text>go back</Text>
            </TouchableOpacity>
        </View>
    );
}
export default Chat;