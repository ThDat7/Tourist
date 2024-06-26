import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  Alert,
} from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import Header from '../../utils/Header'
import { Feather } from '@expo/vector-icons'
import DatePicker from 'react-native-date-ranges'
import 'moment/locale/vi'

const HomeScreen = () => {
  const navigation = useNavigation()
  const [selectedDates, setSelectedDates] = useState({})
  const route = useRoute()

  const selectedPlace = route.params?.selectedPlace

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Tour App',
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
      headerRight: () => (
        <Ionicons
          name='notifications-outline'
          size={24}
          color='white'
          style={{ marginRight: 12 }}
        />
      ),
    })
  }, [])
  const customButton = (onConfirm) => {
    return (
      <Button
        onPress={onConfirm}
        style={{
          container: { width: '80%', marginHorizontal: '3%' },
          text: { fontSize: 20 },
        }}
        primary
        title='Submit'
      />
    )
  }

  const searchPlaces = () => {
    if (!route.params) {
      Alert.alert('Chưa chọn nơi muốn đi', '', [{ text: 'Đồng ý' }], {
        cancelable: false,
      })
    }

    if (route.params) {
      navigation.navigate('Places', {
        selectedPlace,
        selectedDates,
      })
    }
  }

  return (
    <>
      <View>
        <Header state={'dulich'} />

        <ScrollView>
          <View
            style={{
              margin: 20,
              borderColor: '#FFC72C',
              borderWidth: 3,
              borderRadius: 6,
            }}
          >
            {/* Destination */}
            <Pressable
              onPress={() => navigation.navigate('Search')}
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
              <Feather name='search' size={24} color='black' />
              <Text>
                {route?.params ? selectedPlace.name : 'Bạn muốn đi đâu?'}
              </Text>
            </Pressable>

            {/* Selected Dates */}
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
              <DatePicker
                locale='vi'
                style={{
                  width: 350,
                  height: 30,
                  borderRadius: 0,
                  borderWidth: 0,
                  borderColor: 'transparent',
                }}
                customStyles={{
                  placeholderText: {
                    fontSize: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 'auto',
                    color: 'black',
                  },
                  headerStyle: {
                    backgroundColor: '#003580',
                  },
                  contentText: {
                    fontSize: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 'auto',
                  },
                }}
                selectedBgColor='#0047AB'
                customButton={(onConfirm) => customButton(onConfirm)}
                onConfirm={(startDate, endDate) => {
                  setSelectedDates(startDate, endDate)
                }}
                allowFontScaling={false}
                placeholder={'Bất cứ ngày nào'}
                markText={' '}
                returnFormat='YYYY-MM-DD'
                mode={'range'}
              />
            </Pressable>

            {/* Search Button */}
            <Pressable
              onPress={searchPlaces}
              style={{
                paddingHorizontal: 10,
                borderColor: '#FFC72C',
                borderWidth: 2,
                paddingVertical: 15,
                backgroundColor: '#2a52be',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: '500',
                  color: 'white',
                }}
              >
                Tìm
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={{
              marginTop: 100,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Image
              style={{ width: 200, height: 50, resizeMode: 'cover' }}
              source={{
                uri: 'https://assets.stickpng.com/thumbs/5a32a821cb9a85480a628f8f.png',
              }}
            />
          </Pressable>
        </ScrollView>
      </View>
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})
