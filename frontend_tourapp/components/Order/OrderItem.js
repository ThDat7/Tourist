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
          height: 100,
          resizeMode: 'cover',
          borderRadius: 7,
        }}
        source={{ uri: image }}
      />
    </View>
    <View style={{}}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 700,
          width: '80%',
        }}
      >
        {tourName} aaaaaaaaa
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
          {adultCount} x người lớn
        </Text>
        <Text>x</Text>
        <Text>{adultPrice}</Text>
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
          {childCount} x trẻ em
        </Text>
        <Text>x</Text>
        <Text>{childPrice}</Text>
      </View>
      <View
        style={{
          borderTopColor: 'black',
          borderTopWidth: 0.5,
          marginTop: 10,
          paddingTop: 10,
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      >
        <Text>246</Text>
      </View>
    </View>
  </View>
)

export default OrderItem
