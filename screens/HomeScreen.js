import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const usersRef = firestore().collection('users')
        const subscriber = usersRef
            .doc(auth().currentUser.uid)
            .onSnapshot(documentSnapshot => {
                setUser(documentSnapshot.data())
            })

        return () => subscriber()
    }
    )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user ? user.name : ''}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          auth().signOut()
          navigation.navigate('Login')
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    })
    