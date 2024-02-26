import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import OrderItem from './OrderItem'
import API, { endpoints } from '../../configs/API'
import AuthAPI from '../../configs/AuthApi'

const ConfirmOrderScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [tour, setTour] = useState(null)
  const [customerInfo, setCustomerInfo] = useState(null)

  const tourId = route.params?.tourId
  const dateSelected = route.params?.dateSelected
  const adultCount = route.params?.adultCount
  const childCount = route.params?.childCount

  useLayoutEffect(() => {
    if (tour && customerInfo) return

    navigation.setOptions({
      headerShown: true,
      title: `Xác nhận`,
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

        response = await AuthAPI.get(endpoints['customer-info'])
        setCustomerInfo(response.data)
      } catch (err) {
        setTour(null)
        setCustomerInfo(null)
        console.error(err)
      }
    }

    fetchData()
  }, [tourId])

  const payment = async () => {
    try {
      const response = await AuthAPI.post(endpoints['order-booking'], {
        tour_id: tourId,
        date_start: dateSelected,
        adult_count: adultCount,
        child_count: childCount,
      }).catch((e) => {
        console.error(e.error)
      })
      // navigation.navigate('Payment', {
      //   tourId,
      //   dateSelected,
      //   adultCount,
      //   childCount,
      // })

      navigation.navigate('Home')
    } catch (e) {}
  }

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
                onPress={payment}
                style={{
                  backgroundColor: '#007FFF',
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
