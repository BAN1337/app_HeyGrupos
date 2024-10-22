import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import { StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, View, Modal, ActivityIndicator, Alert } from 'react-native';
import FabButton from '../../components/FabButton';
import ModalNewRoom from '../../components/ModalNewRoom';
import ChatList from '../../components/ChatList';

export default function ChatRoom() {
    const [modalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState(null)
    const [threads, setThreads] = useState([])
    const [loading, setLoading] = useState(true)
    const [updateScreen, setUpdateScreen] = useState(false)

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    useEffect(() => {
        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null

        setUser(hasUser)
    }, [isFocused])

    useEffect(() => {
        let isActive = true

        async function getChats() {
            if (isActive) {
                firestore()
                    .collection('MESSAGE_THREADS')
                    .orderBy('lastMessage.createdAt', 'desc')
                    .limit(10)
                    .get()
                    .then((snapshot) => {
                        const threads = snapshot.docs.map(doc => {
                            return {
                                _id: doc.id,
                                name: '',
                                lastMessage: { text: '' },
                                ...doc.data()
                            }
                        })

                        setThreads(threads)
                        setLoading(false)
                    })
            }
        }

        getChats()

        return () => isActive = false
    }, [isFocused, updateScreen])

    function handleSignOut() {
        auth().signOut()
            .then(() => {
                setUser(null)
                navigation.navigate('SignIn')
            })
            .catch(() => {
                alert('Não possui usuário logado!')
            })
    }

    function deleteRoom(ownerId, roomId) {
        Alert.alert(
            'Atenção!',
            'Você tem certeza que deseja deletar essa sala?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: () => handleDeleteRoom(ownerId, roomId)
                }
            ]
        )
    }

    function handleDeleteRoom(ownerId, roomId) {
        if (ownerId !== user.uid) {
            alert('Precisa ser o criador da sala para deletar!')
        } else {
            firestore()
                .collection('MESSAGE_THREADS')
                .doc(roomId)
                .delete()
                .then(() => {
                    alert('Sala deletada com sucesso!')
                    setUpdateScreen(!updateScreen)
                })
        }
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color='#555' />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRoom}>
                <View style={styles.headerRoomLeft}>
                    {user && (
                        <TouchableOpacity onPress={handleSignOut}>
                            <MaterialIcons name='arrow-back' size={28} color='#fff' />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.title}>Grupos</Text>
                </View>

                <TouchableOpacity>
                    <MaterialIcons name='search' size={28} color='#fff' />
                </TouchableOpacity>
            </View>

            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <ChatList data={item} deleteRoom={() => deleteRoom(item.owner, item._id)} userStatus={user} />}
                showsVerticalScrollIndicator={false}
            />

            <FabButton setModalVisible={() => setModalVisible(true)} userStatus={user} />

            <Modal visible={modalVisible} animationType='fade' transparent={true}>
                <ModalNewRoom
                    setModalVisible={() => setModalVisible(false)}
                    setUpdateScreen={() => setUpdateScreen(!updateScreen)}
                />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    headerRoom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#2e54d4',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    headerRoomLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        paddingLeft: 10
    }
});