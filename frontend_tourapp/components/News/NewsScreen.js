import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable } from 'react-native'
import API, { endpoints } from '../../configs/API'
import { useNavigation, useRoute } from '@react-navigation/native'

const NewsScreen = () => {
  const navigation = useNavigation()
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      // Replace with your actual API endpoint
      const response = await API.get(endpoints['news'])
      const data = await response.data
      setNews(data)
    }

    fetchNews()
  }, [])

  return (
    <View>
      <FlatList
        data={news.results}
        keyExtractor={(item) => item.id}
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
            <Text>{item.title}</Text>
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
