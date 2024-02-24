import axios from 'axios'
import { verifyToken, refreshToken } from '../reducers/AuthActions'
import { useNavigation } from '@react-navigation/native'
import { useContext } from 'react'
import UserContext from './UserContext'
import API from './API'

export default axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'content-type': 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
})

AuthAPI.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token')
    try {
      await verifyToken()
      config.headers.Authorization = `Bearer ${token}`
    } catch (error) {
      const originalRequest = error.config

      if (error.response.status === 401 && !originalRequest._retry) {
        try {
          let token = await refreshToken()

          originalRequest.headers.Authorization = `Bearer ${token}`
          return API(originalRequest)
        } catch (error) {
          const navigation = useNavigation()
          navigation.navigate('Login')

          const [, dispatch] = useContext(UserContext)
          dispatch({ type: 'LOGOUT' })
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)
