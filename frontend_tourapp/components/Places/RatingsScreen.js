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

const RatingsScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)

  // const tourId = route.params?.id
  const tourId = 7

  useLayoutEffect(() => {
    if (ratings.length > 0) return
    setLoading(true)

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

    const fetchRatings = async () => {
      try {
        let url = endpoints['ratings'](tourId)
        let data = await API.get(url)

        setRatings(data.data)
        setLoading(false)
      } catch (err) {
        setLoading(true)
        setRatings([])
        console.error(err)
      }
    }

    fetchRatings()
  }, [ratings])

  console.log(ratings)

  // const difference = route.params?.oldPrice - route.params?.newPrice
  // const offerPrice = (Math.abs(difference) / route.params?.oldPrice) * 100
  return (
    <>
      <SafeAreaView>
        {!loading && ratings && (
          <ScrollView>
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
                  }}
                >
                  <View>
                    <Image
                      // style={{ height: height / 5, width: width - 300 }}
                      source={{ uri: rating.customer_info.avatar }}
                    />
                    <Text style={{ fontWeight: '500', fontSize: 18 }}>
                      Customer name
                    </Text>
                    <Text>1 năm trước</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 3, marginTop: 10 }}>
                    <FontAwesome name='star' size={18} color='#dec350' />
                    <FontAwesome name='star' size={18} color='#dec350' />
                    <FontAwesome name='star' size={18} color='#dec350' />
                    <FontAwesome name='star' size={18} color='#dec350' />
                    <FontAwesome name='star' size={18} color='#dec350' />
                  </View>
                </View>
                <Text style={{ fontSize: 17 }}>{rating.cmt}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  )
}

export default RatingsScreen

const styles = StyleSheet.create({})
