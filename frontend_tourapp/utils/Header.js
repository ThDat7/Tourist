import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'

const Header = ({ state }) => {
  const navigation = useNavigation()

  return (
    <View
      style={{
        backgroundColor: '#003580',
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      {state === 'dulich' ? (
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 25,
            padding: 8,
          }}
        >
          <Ionicons name='bed-outline' size={24} color='white' />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: 'bold',
              color: 'white',
              fontSize: 15,
            }}
          >
            Du lịch
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name='bed-outline' size={24} color='white' />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: 'bold',
              color: 'white',
              fontSize: 15,
            }}
          >
            Du lịch
          </Text>
        </Pressable>
      )}

      {state === 'tintuc' ? (
        <Pressable
          onPress={() => navigation.navigate('News')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 25,
            padding: 8,
          }}
        >
          <FontAwesome name='newspaper-o' size={26} color='white' />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: 'bold',
              color: 'white',
              fontSize: 15,
            }}
          >
            Tin tức
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => navigation.navigate('News')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <FontAwesome name='newspaper-o' size={26} color='white' />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: 'bold',
              color: 'white',
              fontSize: 15,
            }}
          >
            Tin tức
          </Text>
        </Pressable>
      )}
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})
