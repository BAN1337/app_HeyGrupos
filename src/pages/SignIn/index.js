import React, { useState } from 'react';
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native';

import { StyleSheet, Text, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';

export default function SignIn() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [type, setType] = useState(false) //false == logar, true == cadastrar

    const navigation = useNavigation()

    function toggleType() {
        setType(!type)
        setName('')
        setEmail('')
        setPassword('')
    }

    function handleLogin() {
        if (type) {
            if (name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
                alert('Todos os campos são obrigatórios!')
            } else {
                auth().createUserWithEmailAndPassword(email, password)
                    .then((snapshot) => {
                        snapshot.user.updateProfile({
                            displayName: name
                        }).then(() => {
                            navigation.goBack()
                        })
                    }).catch((err) => {
                        if (err.code === 'auth/email-already-in-use') {
                            alert('Email já em uso por outro usuário!')
                        } else if (err.code === 'auth/invalid-email') {
                            alert('E-mail Inválido!')
                        } else if (err.code === 'auth/weak-password') {
                            alert('A senha precisa ter no mínimo 6 caracteres!')
                        } else {
                            alert('Erro ao cadastrar o usuário!')
                        }
                    })
            }
        } else {
            if (email.trim().length === 0 || password.trim().length === 0) {
                alert('Todos os campos são obrigatórios!')
            } else {
                auth().signInWithEmailAndPassword(email, password)
                    .then(() => {
                        navigation.goBack()
                    })
                    .catch((err) => {
                        if (err.code === 'auth/invalid-credential') {
                            alert('Email ou senha incorretos!')
                        } else if (err.code === 'auth/invalid-email') {
                            alert('E-mail Inválido!')
                        } else {
                            alert('Erro ao fazer o login!')
                        }
                    })
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.logo}>HeyGrupos</Text>
            <Text style={{ marginBottom: 20 }}>Ajude, colabore, faça networking!</Text>

            {type && (
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    placeholder='Qual seu nome?'
                    placeholderTextColor='#999998'
                />
            )}

            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder='Seu email'
                placeholderTextColor='#999998'
            />

            <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder='Sua senha'
                placeholderTextColor='#999998'
                secureTextEntry={true}
            />

            <TouchableOpacity
                style={[styles.buttonLogin, { backgroundColor: type ? '#f53745' : '#57dd86' }]}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>
                    {type ? 'Cadastrar' : 'Acessar'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleType}>
                <Text>
                    {type ? 'Já possuo uma conta' : 'Criar uma nova conta'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    logo: {
        marginTop: Platform.OS === 'android' ? 55 : 80,
        fontSize: 28,
        fontWeight: 'bold'
    },
    input: {
        color: '#121212',
        backgroundColor: '#ebebeb',
        width: '90%',
        borderRadius: 6,
        marginBottom: 10,
        paddingHorizontal: 8,
        height: 50
    },
    buttonLogin: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 6
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 19
    }
});