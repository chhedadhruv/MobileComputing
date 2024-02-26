import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignUp = () => {
    if (name === '' || email === '' || phoneNo === '' || password === '' || confirmPassword === '') {
      alert('Please fill all fields')
      return
    } else if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    } else if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    } else {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!')
          firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .set({
              name: name,
              email: email,
              phoneNo: phoneNo,
            })
            .then(() => {
              console.log('User added!')
              auth().currentUser.sendEmailVerification()
              alert('Verification email sent')
              navigation.navigate('Home')
            })
        }
        )
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            alert('That email address is already in use!')
          }
          if (error.code === 'auth/invalid-email') {
            alert('That email address is invalid!')
          }
          console.error(error)
        })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder='Name'
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder='Email'
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder='Phone Number'
        onChangeText={setPhoneNo}
        value={phoneNo}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
       <TextInput
        style={styles.input}
        placeholder='Confirm Password'
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ marginTop: 16, color: '#000' }}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#000'
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
  },
  button: {
    height: 40,
    width: '100%',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
})

export default SignupScreen