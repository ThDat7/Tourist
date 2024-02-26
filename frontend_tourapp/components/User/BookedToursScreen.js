import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { endpoints } from '../../configs/API'
import AuthAPI from '../../configs/AuthApi'

const BookedToursScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const [books, setbooks] = useState([])

  // const bookId = route.params?.id
  const userId = 9

  useLayoutEffect(() => {
    if (books.length > 0) return

    navigation.setOptions({
      headerShown: true,
      title: `Tour đã đặt`,
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
    const fetchBooks = async () => {
      try {
        let url = endpoints['tours-history']
        let data = await AuthAPI.get(url)

        setbooks(data.data)
      } catch (err) {
        setbooks([])
        console.error(err)
      }
    }

    fetchBooks()
  }, [userId])

  return (
    <>
      <SafeAreaView>
        {books && (
          <ScrollView style={{ backgroundColor: '#d2d4d6' }}>
            {books.map((book) => (
              <View
                key={book.id}
                style={{
                  padding: 20,
                  paddingBottom: 17,
                  paddingRight: 10,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#737272',
                  marginBottom: 10,
                  backgroundColor: 'white',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    borderColor: 'black',
                    borderWidth: 0.2,
                    padding: 10,
                  }}
                >
                  <Image
                    style={{
                      width: '30%',
                      height: 100,
                      resizeMode: 'cover',
                      marginRight: '5%',
                    }}
                    source={{
                      uri: 'http://127.0.0.1:8000/static/tours/1111111.jpg',
                    }}
                  />
                  <View
                    style={{
                      width: '63%',
                    }}
                  >
                    <Text>{book.tour_name}</Text>
                    <Text
                      style={{
                        marginTop: 50,
                        marginLeft: 'auto',
                      }}
                    >
                      Giá người lớn: {book.tour_price} đ
                    </Text>
                  </View>
                </View>

                <View style={{ marginLeft: 'auto', marginTop: 10 }}>
                  <Text>Tổng tiền: {book.total} đ</Text>
                </View>

                <View style={{}}>
                  <Text>
                    Tinh trang:{' '}
                    {book.status == 'COMPLETED' && (
                      <Text style={{ color: 'green' }}>Đã đi</Text>
                    )}
                    {book.status == 'UNPAID' && (
                      <Text style={{ color: 'red' }}>Chưa thanh toán</Text>
                    )}
                    {book.status == 'WAITING_FOR_DEPARTURE' && (
                      <Text style={{ color: 'blue' }}>Chờ khởi hành</Text>
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  )
}

export default BookedToursScreen

const styles = StyleSheet.create({})
