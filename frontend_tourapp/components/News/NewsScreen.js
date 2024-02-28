import React, { useEffect, useLayoutEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native'
import API, { endpoints } from '../../configs/API'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import Header from '../../utils/Header'

const NewsScreen = () => {
  const navigation = useNavigation()
  const [news, setNews] = useState([])
  const { width } = useWindowDimensions()

  useEffect(() => {
    const fetchNews = async () => {
      const response = await API.get(endpoints['news'])
      const data = await response.data
      setNews(data)
    }

    fetchNews()
  }, [])

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

  return (
    <View style={{ flex: 1 }}>
      <Header state={'tintuc'} />
      <FlatList
        data={news}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('NewsDetail', { id: item.id })}
            style={{
              padding: 10,
              margin: 5,
              marginHorizontal: 10,
              backgroundColor: '#d2d4d6',
            }}
          >
            <Image
              style={{
                width: width - 40,
                height: 150,
                resizeMode: 'cover',
                borderRadius: 7,
              }}
              source={{ uri: item.main_image }}
            />
            <Text style={{ fontWeight: 700, fontSize: 18, color: '#007FFF' }}>
              {item.title}
            </Text>
            <Text>
              {item.content.length > 300
                ? item.content.substring(0, 300 - 3) + '...'
                : item.content}
            </Text>
          </Pressable>
        )}
      />
    </View>
  )
}

export default NewsScreen
