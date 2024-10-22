import React, { useState } from "react";
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

export default function ModalNewRoom({ setModalVisible, setUpdateScreen }) {
    const [roomName, setRoomName] = useState('')

    const user = auth().currentUser.toJSON()

    function handleButtonCreate() {
        if (roomName.trim().length > 0) {

            firestore()
                .collection('MESSAGE_THREADS')
                .get()
                .then((snapshot) => {
                    let threadsUser = 0

                    snapshot.docs.forEach(doc => {
                        if (doc.data().owner === user.uid) {
                            threadsUser += 1
                        }
                    })

                    threadsUser < 4 ? createRoom() : alert('Você já criou 4 grupos!\nExclua algum para poder criar um novo!')
                })
        } else {
            alert('Precisa digitar um nome para a sala!')
        }
    }

    function createRoom() {
        firestore()
            .collection('MESSAGE_THREADS')
            .add({
                name: roomName,
                owner: user.uid,
                lastMessage: {
                    text: `Grupo ${roomName} criado. Bem Vindo(a)!`,
                    createdAt: firestore.FieldValue.serverTimestamp()
                }
            })
            .then((docRef) => {
                docRef.collection('MESSAGES').add({
                    text: `Grupo ${roomName} criado. Bem Vindo(a)!`,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    system: true
                })
                    .then(() => {
                        setModalVisible()
                        setUpdateScreen()
                    })
            })
            .catch((err) => {
                alert('Erro ao criar a sala!')
            })
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => setModalVisible()}>
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                <Text style={styles.title}>Criar um novo grupo?</Text>

                <TextInput
                    style={styles.input}
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                    placeholder='Nome para sua sala'
                    placeholderTextColor='#999998'
                />

                <TouchableOpacity style={styles.buttonCreate} onPress={handleButtonCreate}>
                    <Text style={styles.buttonText}>Criar Sala</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(34,34,34,0.4)'
    },
    modal: {
        flex: 1
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15
    },
    title: {
        marginTop: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19
    },
    input: {
        borderRadius: 4,
        height: 45,
        backgroundColor: '#ddd',
        marginVertical: 15,
        fontSize: 16,
        paddingHorizontal: 5
    },
    buttonCreate: {
        borderRadius: 4,
        backgroundColor: '#2e54d4',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#fff'
    }
})