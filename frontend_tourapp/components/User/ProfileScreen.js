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
import DatePicker from 'react-native-date-ranges'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { pixelNormalize } from '../../utils/Normalise'
import { MaterialIcons } from '@expo/vector-icons'
import Amenities from '../../utils/Amenities'
import API, { endpoints } from '../../configs/API'
import { FontAwesome } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'

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
      title: `header nameeeeee`,
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
        let url = endpoints['customer-info'](userId)
        let response = await API.get(url)

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
  return (
    <>
      <SafeAreaView>
        {!loading && (
          <ScrollView>
            <Text>Profile</Text>
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
                  API.put(
                    endpoints['customer-info'](userId),
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
