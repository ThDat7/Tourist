import { StyleSheet, Text, View } from 'react-native'
import { ModalPortal } from 'react-native-modals'
import StackNavigator from './StackNavigator'
import UserReducer, { initialUserState } from './reducers/UserReducer'
import { useReducer } from 'react'
import UserContext from './configs/UserContext'

export default function App() {
  const [user, dispatch] = useReducer(UserReducer, initialUserState)
  return (
    <UserContext.Provider value={[user, dispatch]}>
      <>
        <StackNavigator />
        <ModalPortal />
      </>
    </UserContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
