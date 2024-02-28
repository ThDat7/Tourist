import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import API, { endpoints } from '../../configs/API'
import { FontAwesome } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const RatingsScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [ratings, setRatings] = useState([])

  const tourId = route.params?.tourId

  useLayoutEffect(() => {
    if (ratings.length > 0) return

    navigation.setOptions({
      headerShown: true,
      title: `Đánh giá`,
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

    const fetchRatings = async () => {
      try {
        let url = endpoints['ratings'](tourId)
        let data = await API.get(url)

        setRatings(data.data)
      } catch (err) {
        setRatings([])
        console.error(err)
      }
    }

    fetchRatings()
  }, [tourId])

  return (
    <View>
      {ratings && (
        <ScrollView style={{ marginBottom: 20 }}>
          <View>
            {ratings.map((rating) => (
              <View
                key={rating.id}
                style={{
                  paddingBottom: 25,
                  margin: 15,
                  marginBottom: 10,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#737272',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {rating.customer_info.avatar.uri ? (
                      <Image
                        style={{ height: 50, width: 50, borderRadius: 30 }}
                        source={{ uri: rating.customer_info.avatar.uri }}
                      />
                    ) : (
                      <FontAwesome name='user-circle' size={47} color='black' />
                    )}
                    <View>
                      <Text style={{ fontWeight: '500', fontSize: 18 }}>
                        {rating.customer_info.name}
                      </Text>
                      <Text>1 năm trước</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 3, marginTop: 10 }}>
                    {[...Array(Math.floor(rating.rate))].map((_, index) => (
                      <FontAwesome
                        key={index}
                        name='star'
                        size={18}
                        color='#dec350'
                      />
                    ))}
                    {rating.rate % 1 !== 0 && (
                      <FontAwesome
                        name='star-half-full'
                        size={18}
                        color='#dec350'
                      />
                    )}
                    {[...Array(5 - Math.ceil(rating.rate))].map((_, index) => (
                      <FontAwesome
                        key={index}
                        name='star'
                        size={18}
                        color='#ccc'
                      />
                    ))}
                  </View>
                </View>
                <Text style={{ fontSize: 17 }}>{rating.cmt}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default RatingsScreen

const styles = StyleSheet.create({})

const insdeView = () => {
  return <></>
}
