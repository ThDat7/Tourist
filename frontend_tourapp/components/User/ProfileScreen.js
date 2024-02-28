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
import { Entypo } from '@expo/vector-icons'
import { launchImageLibrary } from 'react-native-image-picker'

const ProfileScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [lastname, setLastname] = useState('')
  const [firstname, setFirstname] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [avatar, setAvatar] = useState()
  const [saveSuccess, setSaveSuccess] = useState(false)

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
    const fetchCustomerInfo = async () => {
      try {
        let response = await AuthApi.get(endpoints['customer-info'])

        setLastname(response.data.lastname)
        setFirstname(response.data.firstname)
        setEmail(response.data.email)
        setPhoneNumber(response.data.phoneNumber)
        if (response.data.avatar) setAvatar(response.data.avatar)
      } catch (err) {
        setLastname('')
        setFirstname('')
        setEmail('')
        setPhoneNumber('')

        console.error(err)
      }
    }

    fetchCustomerInfo()
  }, [userId])

  const chooseImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        setAvatar({
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        })
      }
    })
  }

  const updateUserInfo = async () => {
    const formData = new FormData()
    formData.append('lastname', lastname)
    formData.append('firstname', firstname)
    formData.append('email', email)
    formData.append('phoneNumber', phoneNumber)
    if (avatar)
      formData.append('avatar', {
        uri: avatar.uri,
        type: avatar.type,
        name: avatar.name,
      })

    try {
      const response = await AuthApi.put(endpoints['customer-info'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setSaveSuccess(true)
    } catch (err) {
      console.error(err)
    }
  }
  const logout = async () => {
    await API.post(endpoints['logout'])
    await AsyncStorage.removeItem('access_token')

    await GoogleSignin.revokeAccess()
    await GoogleSignin.signOut()
    navigation.navigate('Login')
  }
  return (
    <>
      <SafeAreaView style={{ marginBottom: 30 }}>
        <ScrollView>
          <Pressable
            onPress={chooseImage}
            style={{
              justifyContent: 'center',
              height: 200,
              width: 200,
              borderRadius: 100,
              borderColor: 'blue',
              borderWidth: 2,
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: 20,
              backgroundColor: '#b5b7ba',
            }}
          >
            {avatar ? (
              <Image
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  borderColor: 'blue',
                  borderWidth: 2,
                  resizeMode: 'cover',
                }}
                source={{ uri: avatar.uri }}
              />
            ) : (
              <Entypo name='camera' size={50} color='black' />
            )}
          </Pressable>
          {saveSuccess && (
            <Text style={{ alignSelf: 'center', marginTop: 10, color: 'red' }}>
              Lưu thành công
            </Text>
          )}
          <View style={{ alignSelf: 'center', width: '70%' }}>
            <InputInfo label='Họ' value={lastname} onChangeText={setLastname} />
            <InputInfo
              label='Tên'
              value={firstname}
              onChangeText={setFirstname}
            />
            <InputInfo label='Email' value={email} onChangeText={setEmail} />
            <InputInfo
              label='Số điện thoại'
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Pressable
              onPress={updateUserInfo}
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
