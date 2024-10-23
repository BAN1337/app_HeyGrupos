import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Feather from '@expo/vector-icons/Feather'

import { StyleSheet, FlatList, SafeAreaView, Platform, KeyboardAvoidingView, View, TextInput, TouchableOpacity } from 'react-native';
import ChatMessage from '../../components/ChatMessage';

export default function Messages({ route }) {
    const { thread } = route.params

    const [messages, setMessages] = useState()
    const [inputMessage, setInputMessage] = useState('')

    const user = auth().currentUser.toJSON()

    useEffect(() => {
        const unsubscribeListener = firestore().collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: firestore.FieldValue.serverTimestamp(),
                        ...firebaseData
                    }

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.displayName
                        }
                    }

                    return data
                })

                setMessages(messages)
            })

        return () => unsubscribeListener()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={{ width: '100%' }}
                data={messages}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <ChatMessage data={item} />}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={{ width: '100%' }}
                keyboardVerticalOffset={100}
            >
                <View style={styles.containerInput}>
                    <View style={styles.mainContainerInput}>
                        <TextInput
                            style={styles.textInput}
                            value={inputMessage}
                            onChangeText={(text) => setInputMessage(text)}
                            placeholder='Digite sua mensagem'
                            multiline={true}
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity onPress={() => { }}>
                        <View style={styles.buttonContainer}>
                            <Feather name='send' size={22} color='#fff' />
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerInput: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'flex-end'
    },
    mainContainerInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        marginRight: 10
    },
    textInput: {
        flex: 1,
        marginHorizontal: 10,
        maxHeight: 130,
        minHeight: 48,
        paddingVertical: 5,
        color: '#000'
    },
    buttonContainer: {
        backgroundColor: '#51c880',
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24
    }
});