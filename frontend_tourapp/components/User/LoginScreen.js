import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'
import { login } from '../../reducers/AuthActions'

const LoginScreen = () => {
  const navigation = useNavigation()

  const configureGoogleSigIn = () => {
    GoogleSignin.configure({
      webClientId:
        '445922909728-oef43d5c2j5851902dl89ih74cec3hgt.apps.googleusercontent.com',
    })
  }

  useEffect(() => {
    configureGoogleSigIn()
  })

  const signIn = async () => {
    try {
      await login()
      navigation.navigate('Main')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <GoogleSigninButton onPress={signIn} />
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})
