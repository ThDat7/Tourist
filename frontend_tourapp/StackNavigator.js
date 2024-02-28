import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './components/Home/HomeScreen'
import { AntDesign } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { Octicons } from '@expo/vector-icons'
import SavedScreen from './components/Favorites/SavedScreen'
import ProfileScreen from './components/User/ProfileScreen'
import BookedToursScreen from './components/User/BookedToursScreen'
import { NavigationContainer } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'
import SearchScreen from './components/Search/SearchScreen'
import ToursScreen from './components/Tours/ToursScreen'
import TourDetailScreen from './components/Tours/TourDetailScreen'
import RatingsScreen from './components/Tours/RatingsScreen'
import OrderTicketScreen from './components/Order/OrderTicketScreen'
import ConfirmOrderScreen from './components/Order/ConfirmOrderScreen'
import LoginScreen from './components/User/LoginScreen'
import PaymentScreen from './components/Order/PaymentScreen'
import NewsScreen from './components/News/NewsScreen'
import NewsDetailScreen from './components/News/NewsDetailScreen'
import BookedTourDetailScreen from './components/User/BookedTourDetailScreen'

const StackNavigator = () => {
  const Tab = createBottomTabNavigator()
  const Stack = createNativeStackNavigator()

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name='home' size={24} color='#003580' />
              ) : (
                <AntDesign name='home' size={24} color='black' />
              ),
          }}
        />

        <Tab.Screen
          name='Saved'
          component={SavedScreen}
          options={{
            tabBarLabel: 'Saved',
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name='heart' size={24} color='#003580' />
              ) : (
                <AntDesign name='hearto' size={24} color='black' />
              ),
          }}
        />

        <Tab.Screen
          name='BookedTours'
          component={BookedToursScreen}
          options={{
            tabBarLabel: 'BookedTours',
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Octicons name='history' size={24} color='#003580' />
              ) : (
                <Octicons name='history' size={24} color='black' />
              ),
          }}
        />

        <Tab.Screen
          name='Profile'
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name='person' size={24} color='#003580' />
              ) : (
                <Ionicons name='person-outline' size={24} color='black' />
              ),
          }}
        />
      </Tab.Navigator>
    )
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Main'
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Search'
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Places' component={ToursScreen} />
        <Stack.Screen name='TourDetail' component={TourDetailScreen} />
        <Stack.Screen name='Ratings' component={RatingsScreen} />
        <Stack.Screen name='OrderTicket' component={OrderTicketScreen} />
        <Stack.Screen name='ConfirmOrder' component={ConfirmOrderScreen} />
        <Stack.Screen name='Payment' component={PaymentScreen} />
        <Stack.Screen
          name='BookedTourDetail'
          component={BookedTourDetailScreen}
        />
        <Stack.Screen
          name='News'
          component={NewsScreen}
          options={{
            tabBarLabel: 'News',
            headerShown: false,
          }}
        />
        <Stack.Screen name='NewsDetail' component={NewsDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})
