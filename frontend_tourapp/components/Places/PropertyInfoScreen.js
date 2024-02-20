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
import { Calendar } from 'react-native-calendars'

const PropertyInfoScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [tour, setTour] = useState()
  const [loading, setLoading] = useState(false)
  console.log(tour)

  const availableDates = [
    '2022-12-01',
    '2022-12-02',
    '2022-12-03',
    '2022-12-04',
  ]

  // const tourId = route.params?.id
  const tourId = 1

  useLayoutEffect(() => {
    if (tour) return
    setLoading(true)

    navigation.setOptions({
      headerShown: true,
      title: `${tour?.name}`,
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

    const fetchTour = async () => {
      try {
        let url = endpoints['tour-detail'](tourId)
        let data = await API.get(url)

        setTour(data.data)
        setLoading(false)
      } catch (err) {
        setLoading(true)
        setTour(null)
        console.error(err)
      }
    }

    fetchTour()
  }, [tour])

  // const difference = route.params?.oldPrice - route.params?.newPrice
  // const offerPrice = (Math.abs(difference) / route.params?.oldPrice) * 100
  return (
    <>
      <SafeAreaView>
        {!loading && tour && (
          <ScrollView>
            <Pressable
              style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10 }}
            >
              {route.params?.photos.slice(0, 5).map((photo) => (
                <View style={{ margin: 6 }}>
                  <Image
                    style={{
                      width: 120,
                      height: pixelNormalize(80),
                      borderRadius: pixelNormalize(4),
                    }}
                    source={{ uri: photo.image }}
                  />
                </View>
              ))}
              <Pressable
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ textAlign: 'center', marginLeft: 20 }}>
                  Show More
                </Text>
              </Pressable>
            </Pressable>

            <View
              style={{
                marginHorizontal: 12,
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                  {tour.name} aaaa aaaa aaaa
                </Text>

                {/* rating */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 7,
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Text style={{ fontSize: 15 }}>
                    <FontAwesome name='star' size={18} color='#dec350' /> {''}
                    {tour.avg_rating.toFixed(1)}
                  </Text>
                  <Pressable>
                    <Text style={{ color: '#007FFF' }}>
                      {tour.rating_count} đánh giá{'  '}
                      <AntDesign name='arrowright' size={18} color='#007FFF' />
                    </Text>
                  </Pressable>
                </View>

                {/* place and time */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 7,
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Text style={{ fontSize: 15 }}>
                    <AntDesign name='clockcircleo' size={18} color='black' />{' '}
                    {''}4 ngày 3 đêm
                  </Text>
                  <Text>
                    <MaterialIcons name='place' size={18} color='black' />{' '}
                    {tour.place_name}
                  </Text>
                </View>

                {/* pricing */}
                <View
                  style={{
                    gap: 10,
                    marginTop: 20,
                    width: '100%',
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: '700' }}>
                    Vé và giá
                  </Text>

                  <Text
                    style={{ marginTop: 10, fontSize: 20, fontWeight: '700' }}
                  >
                    Tìm vé theo ngày
                  </Text>

                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingHorizontal: 10,
                      borderColor: '#FFC72C',
                      borderWidth: 2,
                      paddingVertical: 15,
                    }}
                  >
                    <Feather name='calendar' size={24} color='black' />
                    <Calendar
                      disabledByDefault={true}
                      markedDates={{
                        ['2024-02-22']: { marked: true, disabled: false },
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            <Text
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 3,
                height: 1,
                marginTop: 15,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                paddingTop: 20,
                paddingHorizontal: 15,
              }}
            >
              {tour.description}
            </Text>
            <Text
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 3,
                height: 1,
                marginTop: 15,
              }}
            />

            <View
              style={{
                margin: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 60,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 16, fontWeight: '600', marginBottom: 3 }}
                >
                  Check In
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: '#007FFF' }}
                >
                  route.params?.selectedDates.startDate
                </Text>
              </View>

              <View>
                <Text
                  style={{ fontSize: 16, fontWeight: '600', marginBottom: 3 }}
                >
                  Check Out
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: '#007FFF' }}
                >
                  route.params?.selectedDates.endDate
                </Text>
              </View>
            </View>
            <View style={{ margin: 12 }}>
              <Text
                style={{ fontSize: 16, fontWeight: '600', marginBottom: 3 }}
              >
                Rooms and Guests
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: 'bold', color: '#007FFF' }}
              >
                1 rooms 2 adults 3 children
              </Text>
            </View>

            <Text
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 3,
                height: 1,
                marginTop: 15,
              }}
            />
            <Amenities />

            <Text
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 3,
                height: 1,
                marginTop: 15,
              }}
            />
          </ScrollView>
        )}
      </SafeAreaView>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: 60,
          position: 'absolute',
          backgroundColor: 'white',
          bottom: 0,
        }}
      >
        <Text
          style={{
            padding: 10,
            fontSize: 16,
          }}
        >
          Giá chỉ từ {'\n'}
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#6CB4EE' }}>
            3.050.000đ/khách
          </Text>
        </Text>
        <Pressable
          onPress={() =>
            navigation.navigate('Rooms', {
              // rooms: route.params?.availableRooms,
              // oldPrice: route.params?.oldPrice,
              // newPrice: route.params?.newPrice,
              // name: route.params?.name,
              // children: route.params?.children,
              // adults: route.params?.adults,
              // rating: route.params?.rating,
              // startDate: route.params?.selectedDates.startDate,
              // endDate: route.params?.selectedDates.endDate,
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
            Đặt vé
          </Text>
        </Pressable>
      </View>
    </>
  )
}

export default PropertyInfoScreen

const styles = StyleSheet.create({})
