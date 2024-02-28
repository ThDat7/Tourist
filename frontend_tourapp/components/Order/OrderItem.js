import { Text, View } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'react-native'

const OrderItem = ({
  tourName,
  image,
  childCount,
  adultCount,
  childPrice,
  adultPrice,
  startTime,
}) => (
  <View style={{ flexDirection: 'row', gap: 20 }}>
    <View style={{}}>
      <Image
        style={{
          width: 100,
          height: 150,
          resizeMode: 'cover',
          borderRadius: 7,
        }}
        source={{ uri: image }}
      />
    </View>
    <View style={{ width: '65%' }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {tourName}
      </Text>
      <Text>{startTime}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: '',
        }}
      >
        <Text style={{}}>
          <MaterialCommunityIcons name='human-child' size={20} color='black' />{' '}
          <Text style={{ color: 'red', fontWeight: 700 }}>{adultCount} </Text>
          người lớn
        </Text>
        <Text style={{ marginLeft: 40 }}>x</Text>
        <Text style={{ marginLeft: 'auto' }}>{adultPrice}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: '',
        }}
      >
        <Text style={{}}>
          <FontAwesome5 name='baby' size={20} color='black' />
          {'  '}
          <Text style={{ color: 'red', fontWeight: 700 }}>
            {childCount}
          </Text>{' '}
          trẻ em
        </Text>
        <Text style={{ marginLeft: 60 }}>x</Text>
        <Text style={{ marginLeft: 'auto' }}>{childPrice}</Text>
      </View>
      <View
        style={{
          borderTopColor: 'black',
          borderTopWidth: 0.5,
          marginTop: 10,
          paddingTop: 10,
        }}
      >
        <Text style={{ marginLeft: 'auto' }}>
          {childCount * childPrice + adultCount * adultPrice}
        </Text>
      </View>
    </View>
  </View>
)

export default OrderItem
