import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'

const LoginScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [userInfo, setUserInfo] = useState()

  const configureGoogleSigIn = () => {
    GoogleSignin.configure({
      webClientId:
        '445922909728-dven4lto6mokfvmdmkchtek3t3jrr04d.apps.googleusercontent.com',
      iosClientId:
        '445922909728-56gh9vuu7g784ok6bu86lt9145udicib.apps.googleusercontent.com',
      androidClientId:
        '445922909728-7ruf1sbtecudu1l0d0kbpt8ipj932nhi.apps.googleusercontent.com',
    })
  }

  useEffect(() => {
    configureGoogleSigIn()
  }, [])

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const data = await GoogleSignin.signIn()
      const token = await GoogleSignin.getTokens()
      console.log(token.accessToken)
    } catch (e) {
      console.log({ e })
    }
  }

  // const signOut = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess()
  //     await GoogleSignin.signOut()
  //     setUserInfo(null)
  //   } catch (e) {
  //     setError(e)
  //   }
  // }

  return (
    <View>
      <GoogleSigninButton
        // size={GoogleSigninButton.Size.Wide}
        // color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        // disabled={this.state.isSigninInProgress}
      />
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})
