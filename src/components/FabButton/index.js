import React from "react";
import { useNavigation } from "@react-navigation/native";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function FabButton({ setModalVisible, userStatus }) {
    const navigation = useNavigation()

    function handleNavigateButton() {
        userStatus ? setModalVisible() : navigation.navigate('SignIn')
    }

    return (
        <TouchableOpacity
            style={styles.containerButton}
            activeOpacity={0.9}
            onPress={handleNavigateButton}
        >
            <View>
                <Text style={styles.text}>+</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerButton: {
        backgroundColor: '#2e54d4',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '5%',
        right: '6%'
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 28
    }
})