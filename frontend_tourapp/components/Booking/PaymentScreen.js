import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
} from 'react-native'
import DatePicker from 'react-native-date-ranges'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { pixelNormalize } from '../../utils/Normalise'
import { MaterialIcons } from '@expo/vector-icons'
import Amenities from '../../utils/Amenities'
import API, { endpoints } from '../../configs/API'
import { FontAwesome } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'

const PaymentScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [tourPricing, setTourPricing] = useState()
  const [loading, setLoading] = useState(false)

  const [adultCount, setAdultCount] = useState(2)
  const [childCount, setChildCount] = useState(0)

  // const tourId = route.params?.id
  const tourId = 1

  useLayoutEffect(() => {
    if (tourPricing) return
    setLoading(true)

    navigation.setOptions({
      headerShown: true,
      title: `Th 5, 22 thg 2`,
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

    const fetchTourPricing = async () => {
      try {
        let url = endpoints['tour-pricing'](tourId)
        let data = await API.get(url)

        setTourPricing(data.data)
        setLoading(false)
      } catch (err) {
        setLoading(true)
        setTourPricing()
        console.error(err)
      }
    }

    fetchTourPricing()
  }, [tourPricing])

  console.log(tourPricing)

  return (
    <>
      <SafeAreaView>
        {!loading && tourPricing && (
          <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 26, fontWeight: '700', marginBottom: 20 }}>
              Tham gia tour trong ngày
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Feather name='check' size={24} color='green' />
              <Text style={{ color: 'green' }}>
                Có lựa chọn hủy miễn phí {'\n'}
                <Text style={{ color: 'gray' }}>
                  Muộn nhất là 24h trước khi bắt đầu
                </Text>
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <AntDesign name='clockcircleo' size={18} color='black' />
              <Text>Thời lượng: 4 ngày 3 đêm</Text>
            </View>

            <Text
              style={{ fontSize: 22, fontWeight: '700', marginVertical: 20 }}
            >
              Tham gia tour trong ngày
            </Text>

            <View style={{ gap: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>
                  Người lớn{'\n'}
                  3.000.000 VNĐ
                </Text>
                <NumbericInput state={adultCount} setState={setAdultCount} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>
                  Trẻ em{'\n'}
                  1.500.000 VNĐ
                </Text>
                <NumbericInput state={childCount} setState={setChildCount} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <Pressable
                  onPress={() =>
                    navigation.navigate('ConfirmOrder', {
                      adultCount,
                      childCount,
                    })
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
                  <Text
                    style={{ color: 'white', fontSize: 16, fontWeight: 500 }}
                  >
                    Tiếp tục
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  )
}

const NumbericInput = ({ state, setState }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderColor: '#4f4f4f',
        borderWidth: 0.5,
        borderRadius: 5,
        width: 130,
        height: 45,
      }}
    >
      <Pressable
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          if (state > 0) setState(state - 1)
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#007FFF',
          }}
        >
          -
        </Text>
      </Pressable>
      <View
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{}}>{state}</Text>
      </View>
      <Pressable
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => setState(state + 1)}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '500',
            color: '#007FFF',
          }}
        >
          +
        </Text>
      </Pressable>
    </View>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({})
