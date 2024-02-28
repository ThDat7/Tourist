import axios from 'axios'
import API, { endpoints } from './API'
import AsyncStorage from '@react-native-async-storage/async-storage'
const AuthAPI = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'content-type': 'application/json',
  },
  timeout: 0,
  withCredentials: true,
})

AuthAPI.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token')
    try {
      let access_token = await AsyncStorage.getItem('access_token')
      await API.post(endpoints['verify-token'], { token: access_token })
      config.headers.Authorization = `Bearer ${token}`
    } catch (error) {
      const originalRequest = error.config

      if (error.response.status === 401 && !originalRequest._retry) {
        try {
          let refresh_token = await AsyncStorage.getItem('refresh_token')
          let response = await API.post(endpoints['refresh-token'], {
            refresh: refresh_token,
          })
          let token = response.data.access
          await AsyncStorage.setItem('access_token', token)

          originalRequest.headers.Authorization = `Bearer ${token}`
          return API(originalRequest)
        } catch (error) {
          await API.post(endpoints['logout'])
          await AsyncStorage.removeItem('access_token')

          await GoogleSignin.revokeAccess()
          await GoogleSignin.signOut()
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default AuthAPI
