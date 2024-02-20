import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './components/Home/HomeScreen'
import { AntDesign } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import SavedScreen from './components/Favorites/SavedScreen'
import BookingScreen from './components/Notifications/BookingScreen'
import ProfileScreen from './components/User/ProfileScreen'
import { NavigationContainer } from '@react-navigation/native'
import SearchScreen from './components/Search/SearchScreen'
import PlacesScreen from './components/Places/PlacesScreen'
import PropertyInfoScreen from './components/Places/PropertyInfoScreen'
import RatingsScreen from './components/Places/RatingsScreen'
import OrderTicketScreen from './components/Booking/OrderTicketScreen'
import RoomsScreen from './components/Booking/RoomsScreen'
import UserScreen from './components/Booking/UserScreen'
import ConfirmationScreen from './components/Booking/ConfirmationScreen'
import LoginScreen from './components/User/LoginScreen'
import RegisterScreen from './components/User/RegisterScreen'
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
          name='Bookings'
          component={BookingScreen}
          options={{
            tabBarLabel: 'Bookings',
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name='notifications' size={24} color='#003580' />
              ) : (
                <Ionicons
                  name='notifications-outline'
                  size={24}
                  color='black'
                />
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
        {/* <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Register'
          component={RegisterScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name='Main'
          component={BottomTabs}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name='Search'
          component={SearchScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen name='Places' component={PlacesScreen} /> */}
        <Stack.Screen name='TourDetail' component={PropertyInfoScreen} />
        {/* <Stack.Screen name='Ratings' component={RatingsScreen} /> */}
        <Stack.Screen name='OrderTicket' component={OrderTicketScreen} />
        <Stack.Screen name='Rooms' component={RoomsScreen} />
        <Stack.Screen name='User' component={UserScreen} />
        <Stack.Screen name='Confirmation' component={ConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})
