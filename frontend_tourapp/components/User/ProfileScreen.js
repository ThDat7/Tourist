import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import API, { endpoints } from '../../configs/API'
import AuthApi from '../../configs/AuthApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const ProfileScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [loading, setLoading] = useState(false)

  const [lastname, setLastname] = useState('')
  const [firstname, setFirstname] = useState('')
  const [email, setEmail] = useState('')
  const [numberphone, setNumberphone] = useState('')

  const userId = 27

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `Thông tin tài khoản`,
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
      },
      headerStyle: {
        backgroundColor: '#003580',
        height: 110,
        borderBottomColor: 'transparent',
        shadowColor: 'transparent',
      },
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchCustomerInfo = async () => {
      try {
        let response = await AuthApi.get(endpoints['customer-info'])

        console.log(response)

        setLastname(response.data.lastname)
        setFirstname(response.data.firstname)
        setEmail(response.data.email)
        setNumberphone(response.data.numberphone)

        setLoading(false)
      } catch (err) {
        setLoading(true)

        setLastname('')
        setFirstname('')
        setEmail('')
        setNumberphone('')

        console.error(err)
      }
    }

    fetchCustomerInfo()
  }, [userId])

  const logout = async () => {
    await API.post(endpoints['logout'])
    await AsyncStorage.removeItem('access_token')

    await GoogleSignin.revokeAccess()
    await GoogleSignin.signOut()
    navigation.navigate('Login')
  }
  return (
    <>
      <SafeAreaView>
        {!loading && (
          <ScrollView>
            <View>
              <Image></Image>
            </View>
            <View style={{ alignSelf: 'center', width: '70%' }}>
              <InputInfo
                label='Họ'
                value={lastname}
                onChangeText={setLastname}
              />
              <InputInfo
                label='Tên'
                value={firstname}
                onChangeText={setFirstname}
              />
              <InputInfo label='Email' value={email} onChangeText={setEmail} />
              <InputInfo
                label='Số điện thoại'
                value={numberphone}
                onChangeText={setNumberphone}
              />
            </View>

            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Pressable
                onPress={() =>
                  AuthApi.put(
                    endpoints['customer-info'],
                    {
                      lastname: lastname,
                      firstname: firstname,
                      email: email,
                      numberphone: numberphone,
                    },
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    }
                  )
                }
                style={{
                  flexDirection: 'row',
                  borderColor: '#4f4f4f',
                  borderWidth: 0.5,
                  borderRadius: 5,
                  width: 130,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#007FFF',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 500 }}>
                  Lưu
                </Text>
              </Pressable>
            </View>

            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Pressable
                onPress={logout}
                style={{
                  flexDirection: 'row',
                  borderColor: '#4f4f4f',
                  borderWidth: 0.5,
                  borderRadius: 5,
                  width: 130,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 500 }}>
                  Đăng xuất
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})

const InputInfo = ({ label, value, onChangeText }) => (
  <View style={{ alignSelf: 'center', width: '100%', marginTop: 25, gap: 5 }}>
    <Text style={{ fontWeight: 700, fontSize: 18 }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={{
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 10,
      }}
    />
  </View>
)
