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
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { pixelNormalize } from '../../utils/Normalise'
import { MaterialIcons } from '@expo/vector-icons'
import Amenities from '../../utils/Amenities'
import OrderItem from './OrderItem'
import API, { endpoints } from '../../configs/API'
import { FontAwesome } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const ConfirmOrderScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [tour, setTour] = useState(null)
  const [customerInfo, setCustomerInfo] = useState(null)

  // const tourId = route.params?.id
  // const dateSelected = route.params?.dateSelected
  // const adultCount = route.params?.adultCount
  // const childCount = route.params?.childCount

  const tourId = 11
  const dateSelected = '2024-02-25'
  const adultCount = 2
  const childCount = 1
  const customerId = 1

  useLayoutEffect(() => {
    if (tour && customerInfo) return

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
    const fetchData = async () => {
      try {
        let url = endpoints['tour-detail'](tourId)
        let response = await API.get(url)
        setTour(response.data)

        url = endpoints['customer-info'](customerId)
        response = await API.get(url)
        setCustomerInfo(response.data)
      } catch (err) {
        setTour(null)
        setCustomerInfo(null)
        console.error(err)
      }
    }

    fetchData()
  }, [tourId, customerId])

  return (
    <>
      <SafeAreaView>
        {tour && customerInfo && (
          <ScrollView style={{ paddingVertical: 50, paddingHorizontal: 20 }}>
            <OrderItem
              tourName={tour.name}
              image={tour.image}
              childCount={childCount}
              adultCount={adultCount}
              childPrice={tour.child_price}
              adultPrice={tour.adult_price}
              startTime={dateSelected}
            />
            <View style={{ gap: 5 }}>
              <Text style={{ fontSize: 22, fontWeight: 700 }}>
                Thông tin của bạn
              </Text>
              <Text>Họ: Nguyen</Text>
              <Text>Tên: Dat</Text>
              <Text>Địa chỉ email: 123@gmail.com</Text>
              <Text>Số điện thoại: 0123456789</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 30 }}>
              <Pressable
                onPress={() =>
                  navigation.navigate('Payment', {
                    tourId,
                    dateSelected,
                    adultCount,
                    childCount,
                  })
                }
                style={{
                  backgroundColor: '#6CB4EE',
                  width: '40%',
                  padding: 10,
                  borderRadius: 7,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 17,
                  }}
                >
                  Thanh toán
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  )
}

export default ConfirmOrderScreen

const styles = StyleSheet.create({})
