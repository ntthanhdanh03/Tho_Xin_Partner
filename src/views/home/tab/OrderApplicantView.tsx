import { StyleSheet, FlatList, View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import EmptyView from '../../components/EmptyView'
import { scaleModerate } from '../../../styles/scaleDimensions'

const OrderApplicantView = ({ route }: any) => {
    const { data: orderData } = useSelector((store: any) => store.order)
    const { data: authData } = useSelector((store: any) => store.auth)

    // Lọc orders có applicant của user hiện tại
    const myOrders =
        orderData?.filter((order: any) =>
            order.applicants?.some((applicant: any) => applicant.partnerId === authData?.user?._id),
        ) || []

    useEffect(() => {
        console.log('myOrders', myOrders)
    }, [orderData])

    return (
        <View style={DefaultStyles.container}>
            {myOrders.length === 0 ? (
                <EmptyView />
            ) : (
                <FlatList
                    data={myOrders}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.content}>
                            <Text style={styles.contentText}>{item.service}</Text>
                            <Text>{item._id}</Text>
                            <Text>{item.describe}</Text>
                            <Text>{item.address}</Text>
                            <Text>Trạng thái: {item.status}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

export default OrderApplicantView

const styles = StyleSheet.create({
    content: {
        width: '100%',
        padding: scaleModerate(16),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    contentText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})
