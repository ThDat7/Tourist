import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import PropertyCard from './PropertyCard'
import API, { endpoints } from '../../configs/API'

const PlacesScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const selectedPlace = route.params?.selectedPlace
  const selectedDates = route.params?.selectedDates

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Tìm kiếm',
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
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()

  useEffect(() => {
    if (data) return
    setLoading(true)

    const fetchTours = async () => {
      let url
      if (selectedPlace.type === 'tour')
        url = endpoints['search-tour'](selectedPlace.id)
      else url = endpoints['search-tourist-place'](selectedPlace.id)

      try {
        let res = await API.get(url)
        setData(res.data)
        setLoading(false)
      } catch (error) {
        setData(null)
        setLoading(true)
        console.error(error)
      }
    }
    fetchTours()
  }, [data])

  return (
    <View>
      {loading && <Text>Fetching places....</Text>}
      {data && !loading && (
        <ScrollView style={{ backgroundColor: '#F5F5F5' }}>
          <View>
            {data.tours.map((tour) => (
              <PropertyCard
                key={tour.id}
                tour={tour}
                selectedDates={selectedDates}
              />
            ))}
          </View>

          {data.related_tours && data.related_tours.length > 0 && (
            <Text style={{ fontSize: 24, fontWeight: '700' }}>
              Các hoạt động liên quan
            </Text>
          )}
          <View>
            {data.related_tours?.map((tour) => (
              <PropertyCard key={tour.id} tour={tour} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default PlacesScreen

const styles = StyleSheet.create({})
