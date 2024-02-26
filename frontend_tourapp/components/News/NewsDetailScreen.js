import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable } from 'react-native'
import API, { endpoints } from '../../configs/API'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ScrollView } from 'react-native-web'

const NewsDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const newsId = route.params?.id

  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      const response = await API.get(endpoints['news-detail'](newsId))
      const data = await response.data
      setNews(data)
    }

    fetchNews()
  }, [])

  return (
    <View>
      <ScrollView>
        <Pressable
          onPress={() => navigation.navigate('NewsDetail', { id: item.id })}
          style={{
            padding: 10,
            margin: 5,
            marginHorizontal: 10,
            backgroundColor: '#d2d4d6',
          }}
        >
          <Text>{item.title}</Text>
          <Text>{item.content.length}</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

export default NewsDetailScreen
