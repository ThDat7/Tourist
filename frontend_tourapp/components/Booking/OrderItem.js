import { Text, View } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
      {/* <Image></Image> */}
      <Text>Fake image</Text>
    </View>
    <View style={{}}>
      <Text style={{ fontSize: 18, fontWeight: 700 }}>
        {tourName} aaaa aaaa aaaa aaa aaa aaa aaa aaa
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
