import AsyncStorage from '@react-native-async-storage/async-storage'
import API, { endpoints } from '../configs/API'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import UserContext from '../configs/UserContext'

const [, dispatch] = UserContext(UserContext)

export const login = async () => {
  await GoogleSignin.hasPlayServices()

  await GoogleSignin.signIn()
  const token = await GoogleSignin.getTokens()
  let response = await API.post(endpoints['login'], {
    access_token: token.accessToken,
  })

  await AsyncStorage.setItem('access_token', response.data.access)
  await AsyncStorage.setItem('refresh_token', response.data.refresh)

  dispatch({ type: 'LOGIN', payload: { id: response.data.pk } })
}

export const logout = async () => {
  let url = endpoints['logout']
  await API.post(url)
  await AsyncStorage.removeItem('access_token')

  await GoogleSignin.revokeAccess()
  await GoogleSignin.signOut()
  dispatch({ type: 'LOGOUT' })
}

export const verifyToken = async () => {
  let access_token = await AsyncStorage.getItem('access_token')
  await API.post(endpoints['verify-token'], { token: access_token })
}

export const refreshToken = async () => {
  let refresh_token = await AsyncStorage.getItem('refresh_token')
  let response = await API.post(endpoints['refresh-token'], {
    refresh: refresh_token,
  })

  await AsyncStorage.setItem('access_token', response.data.access)
  return token
}
