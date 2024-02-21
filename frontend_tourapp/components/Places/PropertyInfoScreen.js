import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
} from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
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

  const [tour, setTour] = useState(null)
  const [dateSelected, setDateSelected] = useState('')
  const [availableDates, setAvailableDates] = useState({})

  // const tourId = route.params?.id
  const tourId = 11
  let datesSearch = route.params?.datesSearch

  useLayoutEffect(() => {
    if (tour) return

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
  }, [])

  useEffect(() => {
    const fetchTour = async () => {
      try {
        let url = endpoints['tour-detail'](tourId)
        let data = await API.get(url)

        setTour(data.data)
      } catch (err) {
        setTour(null)
        console.error(err)
      }
    }
    fetchTour()
  }, [tourId])

  useEffect(() => {
    const calcAvailableDates = () => {
      if (!tour) return

      let availableDates = {}
      const daysInWeek = tour.schedule.days_in_week
      const excludesDay = tour.schedule.excludes_day

      const startDate = new Date()
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 3)

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split('T')[0]
        if (
          !excludesDay.includes(dateStr) &&
          daysInWeek.includes(d.getDay() + 1)
        ) {
          availableDates[dateStr] = { marked: true, disabled: false }
        }
      }
      setAvailableDates(availableDates)
    }

    calcAvailableDates()
  }, [tour])

  useEffect(() => {
    const setDateGo = () => {
      let firstAvailableDate

      if (datesSearch?.startDate && datesSearch?.endDate) {
        const startDate = new Date(datesSearch.startDate)
        const endDate = new Date(datesSearch.endDate)
        for (let date in availableDates) {
          const currentDate = new Date(date)

          if (currentDate >= startDate && currentDate <= endDate) {
            firstAvailableDate = date
            break
          }
        }
      } else firstAvailableDate = Object.keys(availableDates)[0]

      if (firstAvailableDate) setDateSelected(firstAvailableDate)
    }

    setDateGo()
  }, [availableDates])

  return (
    <>
      <SafeAreaView>
        {tour && (
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
                      onDayPress={(day) => {
                        setDateSelected(day.dateString)
                      }}
                      disabledByDefault={true}
                      markedDates={{
                        ...availableDates,
                      }}
                      theme={{
                        todayTextColor: '#68ba56',
                        dayTextColor: '#00adf5',
                        dayBackgroundColor: '#00adf5',
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
            // navigation.navigate('Rooms', {
            //   // rooms: route.params?.availableRooms,
            //   // oldPrice: route.params?.oldPrice,
            //   // newPrice: route.params?.newPrice,
            //   // name: route.params?.name,
            //   // children: route.params?.children,
            //   // adults: route.params?.adults,
            //   // rating: route.params?.rating,
            //   // startDate: route.params?.selectedDates.startDate,
            //   // endDate: route.params?.selectedDates.endDate,
            // })
            {
              navigation.navigate('OrderTicket', {
                screen: 'ConfirmOrder',
                params: { tourId, dateSelected },
              })
            }
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
