import { StyleSheet, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'
import UserContext from '../../configs/UserContext'
import API, { endpoints } from '../../configs/API'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = () => {
  const [user, dispatch] = useContext(UserContext)
  const navigation = useNavigation()

  const configureGoogleSigIn = () => {
    GoogleSignin.configure({
      webClientId:
        '445922909728-oef43d5c2j5851902dl89ih74cec3hgt.apps.googleusercontent.com',
    })
  }

  useEffect(() => {
    if (user.id) navigation.navigate('Main')
    configureGoogleSigIn()
  })

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signIn()
      const token = await GoogleSignin.getTokens()
      let response = await API.post(endpoints['login'], {
        access_token: token.accessToken,
      })

      await AsyncStorage.setItem('access_token', response.data.access)
      await AsyncStorage.setItem('refresh_token', response.data.refresh)

      dispatch({
        type: 'LOGIN',
        payload: { id: response.data.pk, name: response.data.name },
      })

      navigation.navigate('Main')
    } catch (e) {
      console.error(e)
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
