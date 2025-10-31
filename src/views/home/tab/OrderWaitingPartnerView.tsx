import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import { Colors } from '../../../styles/Colors'
import { scaleModerate } from '../../../styles/scaleDimensions'
import { useNavigation } from '@react-navigation/native'
import Spacer from '../../components/Spacer'

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
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Text style={[DefaultStyles.textBold16Black, { flex: 1 }]}>{item.service}</Text>
            </View>

            <Text
                style={[DefaultStyles.textRegular14Gray, styles.description, { lineHeight: 20 }]}
                numberOfLines={2}
            >
                {item.describe}
            </Text>

            <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={[DefaultStyles.textRegular13Gray, { flex: 1 }]} numberOfLines={1}>
                    {item.address}
                </Text>
            </View>

            <View style={styles.priceSection}>
                <Text style={[DefaultStyles.textBold14Black, { marginBottom: 6 }]}>
                    Giá tham khảo
                </Text>
                <Text style={[DefaultStyles.textBold16Black, { color: Colors.green34 }]}>
                    {item.rangePrice}
                </Text>
            </View>

            {/* Footer - ID */}
            <Text style={[DefaultStyles.textRegular12Gray, styles.orderId]}>ID: {item._id}</Text>
        </TouchableOpacity>
    )

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={[DefaultStyles.textRegular14Gray, { textAlign: 'center' }]}>
                Không có đơn nào đang chờ
            </Text>
            <Text style={[DefaultStyles.textRegular13Gray, { textAlign: 'center', marginTop: 6 }]}>
                Hãy quay lại sau để xem các đơn mới
            </Text>
        </View>
    )

    return (
        <View style={DefaultStyles.container}>
            <Spacer height={10} />
            <FlatList
                data={waitingOrders}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyComponent()}
                contentContainerStyle={styles.listContent}
                scrollEnabled={waitingOrders.length > 0}
            />
        </View>
    )
}

export default OrderWaitingPartnerView

const styles = StyleSheet.create({
    listContent: {
        padding: scaleModerate(2),
        flexGrow: 1,
    },
    card: {
        backgroundColor: Colors.whiteFF,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.grayDE,
        ...DefaultStyles.shadow,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        gap: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    description: {
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    infoIcon: {
        fontSize: 14,
    },
    priceSection: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: Colors.gray44,
        marginBottom: 8,
    },
    orderId: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.grayDE,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
})
