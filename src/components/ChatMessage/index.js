import React, { useMemo } from "react";
import auth from '@react-native-firebase/auth'

import { View, Text, StyleSheet } from "react-native";

export default function ChatMessage({ data }) {
    console.log(data)
    const user = auth().currentUser.toJSON()

    const isMyMessage = useMemo(() => {
        return data?.user?._id === user.uid
    }, [data])

    return (
        <View style={styles.container}>
            <View style={[
                styles.messageBox, {
                    backgroundColor: isMyMessage ? '#DCF8C5' : '#FFF',
                    marginLeft: isMyMessage ? 50 : 0,
                    marginRight: isMyMessage ? 0 : 50
                }
            ]}>
                {data.system ? null : (
                    <Text style={[styles.name, isMyMessage && { display: 'none' }]}>{data?.user?.name}</Text>
                )}

                <Text style={styles.message}>{data.text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 5
    },
    messageBox: {
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#121212',
        justifyContent: 'center'
    },
    name: {
        color: '#F53745',
        fontWeight: 'bold',
        marginBottom: 5
    }
})