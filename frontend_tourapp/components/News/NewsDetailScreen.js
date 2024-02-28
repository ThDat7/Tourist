import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
  Pressable,
  TextInput,
} from 'react-native'
import API, { endpoints } from '../../configs/API'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import AuthAPI from '../../configs/AuthApi'

const NewsDetailScreen = () => {
  const route = useRoute()

  const { width } = useWindowDimensions()

  const [mycmt, setMycmt] = useState('')

  const newsId = route.params?.id

  const [news, setNews] = useState()

  useEffect(() => {
    const fetchNews = async () => {
      const response = await AuthAPI.get(endpoints['news-detail'](newsId))
      const data = await response.data
      setNews(data)
    }

    fetchNews()
  }, [newsId])

  const toggleLike = async () => {
    await AuthAPI.get(endpoints['do-toggle-like-news'](newsId))
  }

  const postCmt = async () => {
    await AuthAPI.post(endpoints['cmt-new'](newsId), { cmt: mycmt })
  }

  return (
    <ScrollView>
      {news && (
        <View
          style={{
            marginTop: 30,
            margin: 10,
            gap: 20,
          }}
        >
          <Text style={{ fontWeight: 700, fontSize: 24, color: '#007FFF' }}>
            {news.title}
          </Text>
          <Image
            style={{
              width: width - 20,
              height: 300,
              resizeMode: 'cover',
              borderRadius: 7,
            }}
            source={{ uri: news.main_image }}
          />
          <Pressable onPress={toggleLike}>
            {news.is_like ? (
              <AntDesign name='like1' size={24} color='#007FFF' />
            ) : (
              <AntDesign name='like1' size={24} color='black' />
            )}
          </Pressable>

          <Text style={{ fontSize: 16 }}>{news.content}</Text>
          <View>
            <Text style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
              Bình luận
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 10, gap: 10 }}>
              <TextInput
                placeholder='Nhập bình luận'
                onChangeText={setMycmt}
                value={mycmt}
                style={{
                  padding: 10,
                  borderColor: 'black',
                  borderWidth: 0.5,
                  width: '85%',
                }}
              />
              <Pressable
                onPress={postCmt}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                  borderColor: 'black',
                  borderWidth: 0.5,
                  backgroundColor: '#007FFF',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                  }}
                >
                  Đăng
                </Text>
              </Pressable>
            </View>
            {news.cmts.map((cmt, index) => (
              <View
                key={index}
                style={{
                  padding: 10,
                  borderColor: 'black',
                  borderWidth: 0.5,
                  marginBottom: 10,
                }}
              >
                <Text>{cmt.author}:</Text>
                <Text>{cmt.cmt}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default NewsDetailScreen
