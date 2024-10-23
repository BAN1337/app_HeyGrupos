import React, { useState, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useIsFocused } from '@react-navigation/native';

import { StyleSheet, SafeAreaView, TextInput, View, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import ChatList from '../../components/ChatList';

export default function Search() {
    const [searchInput, setSearchInput] = useState('')
    const [user, setUser] = useState(null)
    const [threads, setThreads] = useState([])

    const isFocused = useIsFocused()

    useEffect(() => {
        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null

        setUser(hasUser)
    }, [isFocused])

    async function handleSearch() {
        if (searchInput.trim().length > 0) {
            await firestore()
                .collection('MESSAGE_THREADS')
                .where('name', '>=', searchInput)
                .where('name', '<=', searchInput + '\uf8ff')
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
                    setSearchInput('')
                    Keyboard.dismiss()
                })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerInput}>
                <TextInput
                    style={styles.searchInput}
                    value={searchInput}
                    onChangeText={(text) => setSearchInput(text)}
                    placeholder='Digite o nome da sala'
                    autoCapitalize={'none'} //Ao digitar num input, ele desabilita a primeira maiuscula automática ao começar escrever em um input
                />

                <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch}>
                    <MaterialIcons name='search' size={30} color='#fff' />
                </TouchableOpacity>
            </View>

            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <ChatList data={item} userStatus={user} />}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    containerInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 14
    },
    searchInput: {
        backgroundColor: '#ebebeb',
        marginLeft: 10,
        height: 50,
        width: '80%',
        borderRadius: 4,
        padding: 5
    },
    buttonSearch: {
        backgroundColor: '#2e54d4',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: '15%',
        marginLeft: 5,
        marginRight: 10
    }
});