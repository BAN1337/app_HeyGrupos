import React, { useState } from 'react';
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import { StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, View, Modal } from 'react-native';
import FabButton from '../../components/FabButton';
import ModalNewRoom from '../../components/ModalNewRoom';

export default function ChatRoom() {
    const [modalVisible, setModalVisible] = useState(false)

    const navigation = useNavigation()

    function handleSignOut() {
        auth().signOut()
            .then(() => {
                navigation.navigate('SignIn')
            })
            .catch(() => {
                alert('Não possui usuário logado!')
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRoom}>
                <View style={styles.headerRoomLeft}>
                    <TouchableOpacity onPress={handleSignOut}>
                        <MaterialIcons name='arrow-back' size={28} color='#fff' />
                    </TouchableOpacity>
                    <Text style={styles.title}>Grupos</Text>
                </View>

                <TouchableOpacity>
                    <MaterialIcons name='search' size={28} color='#fff' />
                </TouchableOpacity>
            </View>

            <FabButton setModalVisible={() => setModalVisible(true)} />

            <Modal visible={modalVisible} animationType='fade' transparent={true}>
                <ModalNewRoom setModalVisible={() => setModalVisible(false)} />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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