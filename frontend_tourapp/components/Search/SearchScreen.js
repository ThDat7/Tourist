import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  Image,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import { Feather } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import API, { endpoints } from '../../configs/API'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";

const SearchScreen = () => {
  const navigation = useNavigation()
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState()

  const debounceSearch = debounce(async (query) => {
    let url = endpoints['search'](query)
    try {
      let res = await API.get(url)
      setSearchResults(res.data)
    } catch (error) {
      setSearchResults(null)
      console.error(error)
    }
  }, 500)

  useEffect(() => {
    const search = async () => {
      if (query) {
        let url = endpoints['search'](query)
        try {
          let res = await API.get(url)
          setSearchResults(res.data)
        } catch (error) {
          setSearchResults(null)
          console.error(error)
        }
      }
    }

    search()
  }, [query])

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 10,
          margin: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: '#FFC72C',
          borderWidth: 4,
          borderRadius: 10,
        }}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder='Tìm nơi bạn muốn đi'
          autoFocus={true}
        />
        <Feather name='search' size={22} color='black' />
      </View>

      {searchResults && (
        <View style={{ padding: 10 }}>
          {searchResults.tourist_places.length > 0 && (
            <Text style={{ fontSize: 20, fontWeight: 800 }}>Điểm đến</Text>
          )}
          <FlatList
            data={searchResults.tourist_places}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate('Home', {
                      selectedPlace: {
                        id: item.id,
                        name: item.name,
                        type: 'tourist_place',
                      },
                    })
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}
                >
                  <FontAwesome5 name='city' size={24} color='#5ea7ff' />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>
                      {item.name}
                    </Text>
                    <Text style={{ marginVertical: 4 }}>
                      {item.number_of_tours} hoạt động
                    </Text>
                  </View>
                </Pressable>
              )
            }}
          />
          {searchResults.tours.length > 0 && (
            <Text style={{ fontSize: 20, fontWeight: 800 }}>
              Các hoạt động trải nghiệm
            </Text>
          )}
          <FlatList
            data={searchResults.tours}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate('Home', {
                      selectedPlace: {
                        id: item.id,
                        name: item.name,
                        type: 'tour',
                      },
                    })
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}
                >
                  <Entypo name='flag' size={24} color='#5ea7ff' />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>
                      {item.name}
                    </Text>
                    <Text style={{ marginVertical: 4 }}>{item.place_name}</Text>
                  </View>
                </Pressable>
              )
            }}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default SearchScreen

const styles = StyleSheet.create({})
