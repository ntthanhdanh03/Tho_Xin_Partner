import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import { scaleModerate } from '../../../styles/scaleDimensions'
import { useNavigation } from '@react-navigation/native'

const OrderWaitingPartnerView = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { data: orderData } = useSelector((store: any) => store.order)
    const { data: authData } = useSelector((store: any) => store.auth)

    const handleNavigationDetailOrder = (item: any) => {
        navigation.navigate(...(['DetailOrderView', { item }] as never))
    }

    const waitingOrders =
        orderData?.filter(
            (order: any) =>
                !order.applicants?.some(
                    (applicant: any) => applicant.partnerId === authData?.user?._id,
                ),
        ) || []

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                handleNavigationDetailOrder(item)
            }}
        >
            <Text>{item._id}</Text>
            <Text style={styles.service}>{item.service}</Text>
            <Text style={styles.desc}>{item.describe}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.price}>{item.rangePrice}</Text>
            <Text style={styles.status}>Trạng thái: {item.status}</Text>
        </TouchableOpacity>
    )

    return (
        <View style={DefaultStyles.container}>
            <FlatList
                data={waitingOrders}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        Không có đơn nào đang chờ
                    </Text>
                }
                contentContainerStyle={{ padding: scaleModerate(10) }}
            />
        </View>
    )
}

export default OrderWaitingPartnerView

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    service: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    desc: {
        marginTop: 4,
        color: '#555',
    },
    address: {
        marginTop: 4,
        fontStyle: 'italic',
        color: '#333',
    },
    price: {
        marginTop: 4,
        fontWeight: '600',
        color: '#009688',
    },
    status: {
        marginTop: 6,
        color: '#d35400',
    },
})
