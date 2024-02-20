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
import { BottomModal } from 'react-native-modals'
import { ModalFooter } from 'react-native-modals'
import { ModalButton } from 'react-native-modals'
import { ModalTitle } from 'react-native-modals'
import { SlideAnimation } from 'react-native-modals'
import { ModalContent } from 'react-native-modals'
import 'moment/locale/vi'

const HomeScreen = () => {
  const navigation = useNavigation()
  const [selectedDates, setSelectedDates] = useState()
  const route = useRoute()
  const [modalVisibile, setModalVisibile] = useState(false)

  const selectedPlace = route.params?.selectedPlace

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Booking.com',
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
  console.log(route.params)

  const searchPlaces = (place) => {
    if (!route.params || !selectedDates) {
      Alert.alert(
        'Invalid Details',
        'Please enter all the details',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    }

    if (route.params && selectedDates) {
      navigation.navigate('Places', {
        selectedPlace,
        selectedDates,
        place: place,
      })
    }
  }

  return (
    <>
      <View>
        <Header />

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
              <TextInput
                placeholderTextColor='black'
                placeholder={
                  route?.params ? selectedPlace.name : 'Bạn muốn đi đâu?'
                }
              />
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
                onConfirm={(startDate, endDate) =>
                  setSelectedDates(startDate, endDate)
                }
                allowFontScaling={false}
                placeholder={'Bất cứ ngày nào'}
                mode={'range'}
              />
            </Pressable>

            {/* Search Button */}
            <Pressable
              onPress={() => searchPlaces(route?.params.input)}
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

          <Text
            style={{ marginHorizontal: 20, fontSize: 17, fontWeight: '500' }}
          >
            Travel More spend less
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable
              style={{
                width: 200,
                height: 150,
                marginTop: 10,
                backgroundColor: '#003580',
                borderRadius: 10,
                padding: 20,
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginVertical: 7,
                }}
              >
                Genius
              </Text>
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>
                You are ate genius level one in our loyalty program
              </Text>
            </Pressable>

            <Pressable
              style={{
                width: 200,
                height: 150,
                marginTop: 10,
                borderColor: '#E0E0E0',
                borderWidth: 2,
                borderRadius: 10,
                padding: 20,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginVertical: 7,
                }}
              >
                15% Discounts
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '500' }}>
                Complete 5 stays to unlock level 2
              </Text>
            </Pressable>

            <Pressable
              style={{
                width: 200,
                height: 150,
                marginTop: 10,
                borderColor: '#E0E0E0',
                borderWidth: 2,
                borderRadius: 10,
                padding: 20,
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginVertical: 7,
                }}
              >
                10% Discounts
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '500' }}>
                Enjoy Discounts at participating at properties worldwide
              </Text>
            </Pressable>
          </ScrollView>

          <Pressable
            style={{
              marginTop: 40,
              justifyContent: 'center',
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
