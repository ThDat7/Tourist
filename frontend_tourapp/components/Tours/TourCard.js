import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'

const PropertyCard = ({ tour, selectedDates }) => {
  const { width, height } = Dimensions.get('window')
  const navigation = useNavigation()
  return (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate('TourDetail', {
            id: tour.id,
            datesSearch: selectedDates,
          })
        }
        style={{ margin: 15, flexDirection: 'row', backgroundColor: 'white' }}
      >
        <View>
          <Image
            style={{ height: height / 5, width: width - 300 }}
            source={{ uri: tour.main_image }}
          />
        </View>

        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ width: 200 }}>{tour.place_name}</Text>
            <AntDesign name='hearto' size={24} color='red' />
          </View>

          <Text style={{ fontSize: 18, fontWeight: 700 }}>{tour.name}</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
            }}
          >
            <FontAwesome name='star' size={18} color='#dec350' />
            <Text style={{ fontSize: 15 }}>
              {tour.avg_rating?.toFixed(1)} ({tour.rating_count} đánh giá)
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}
          >
            <Text>
              Trẻ em: {'\n'}
              <Text style={{ fontWeight: '700' }}>{tour.child_price} VNĐ</Text>
            </Text>
            <Text>
              Người lớn: {'\n'}
              <Text style={{ fontWeight: '700' }}>{tour.adult_price} VNĐ</Text>
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  )
}

export default PropertyCard

const styles = StyleSheet.create({})
