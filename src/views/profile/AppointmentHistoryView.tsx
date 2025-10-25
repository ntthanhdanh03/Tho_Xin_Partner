import React, { useEffect } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'
import EmptyView from '../components/EmptyView'

const AppointmentHistoryView = () => {
    const navigation = useNavigation()
    const { data: appointmentData } = useSelector((store: any) => store.appointment)

    useEffect(() => {
        console.log('Appointments:', appointmentData?.appointments)
    }, [appointmentData])

    const getServiceName = (service: string) => {
        const map: any = {
            lap_dat_khoa_xe_may: 'Lắp đặt khóa xe máy',
            sua_khoa_xe_may: 'Sửa khóa xe máy',
            mo_khoa_xe_may: 'Mở khóa xe máy',
            mo_khoa_cua: 'Mở khóa cửa',
        }
        return map[service] || 'Dịch vụ khác'
    }

    const getStatusText = (status: number) => {
        const map: any = {
            6: 'Hoàn thành',
            5: 'Đã thanh toán',
            4: 'Đang làm',
            3: 'Đã nhận',
            2: 'Đang chờ xác nhận',
            1: 'Đã hủy',
        }
        return map[status] || 'Đang xử lý'
    }

    const getStatusColor = (status: number) => {
        const colorMap: any = {
            6: Colors.green34,
            7: Colors.red30,
        }
        return colorMap[status] || Colors.gray44
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price || 0) + ' VND'
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const renderAppointmentItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.appointmentCard}
            activeOpacity={0.8}
            onPress={() => {
                navigation.navigate(...(['AppointmentView', { appointmentId: item?._id }] as never))
            }}
        >
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.serviceInfo}>
                    <Text style={DefaultStyles.textBold16Black}>
                        {getServiceName(item.orderId?.service)}
                    </Text>
                    <Text style={[DefaultStyles.textRegular12Gray, { marginTop: 4 }]}>
                        {formatDate(item.orderId?.dateTimeOder)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) + '20' },
                    ]}
                >
                    <Text
                        style={[
                            DefaultStyles.textMedium12Black,
                            { color: getStatusColor(item.status) },
                        ]}
                    >
                        {getStatusText(item.status)}
                    </Text>
                </View>
            </View>

            <View style={styles.customerInfo}>
                <Text style={DefaultStyles.textRegular14Gray}>Khách hàng:</Text>
                <Text style={[DefaultStyles.textMedium14Black, { marginLeft: 8 }]}>
                    {item.clientId?.fullName || 'Không rõ'}
                </Text>
            </View>

            <View style={styles.addressInfo}>
                <Text style={DefaultStyles.textRegular14Gray}>Địa chỉ:</Text>
                <Text
                    style={[DefaultStyles.textRegular13Black, { marginLeft: 8, flex: 1 }]}
                    numberOfLines={2}
                >
                    {item.orderId?.address || 'Không có địa chỉ'}
                </Text>
            </View>

            <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                    <Text style={DefaultStyles.textRegular14Gray}>Giá thỏa thuận:</Text>
                    <Text style={DefaultStyles.textMedium14Black}>
                        {formatPrice(item.agreedPrice)}
                    </Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={DefaultStyles.textRegular14Gray}>Chi phí nhân công:</Text>
                    <Text style={DefaultStyles.textMedium14Black}>
                        {formatPrice(item.laborCost)}
                    </Text>
                </View>
                {item.promotionDiscount > 0 && (
                    <View style={styles.priceRow}>
                        <Text style={DefaultStyles.textRegular14Gray}>Giảm giá:</Text>
                        <Text style={[DefaultStyles.textMedium14Black, { color: Colors.green34 }]}>
                            -{formatPrice(item.promotionDiscount)}
                        </Text>
                    </View>
                )}
                {item.additionalIssues?.length > 0 && (
                    <View style={styles.priceRow}>
                        <Text style={DefaultStyles.textRegular14Gray}>Phụ phí:</Text>
                        <Text style={DefaultStyles.textMedium14Black}>
                            {formatPrice(item.additionalIssues[0].cost)}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.totalSection}>
                <Text style={DefaultStyles.textBold16Black}>Tổng thanh toán:</Text>
                <Text style={[DefaultStyles.textBold18Black, { color: Colors.primary }]}>
                    {formatPrice(item.finalAmount || item.agreedPrice)}
                </Text>
            </View>

            <View style={styles.paymentInfo}>
                <Text style={DefaultStyles.textRegular12Gray}>
                    Phương thức: {item.paymentMethod === 'cash' ? 'Tiền mặt' : 'QR Code'}
                </Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Lịch sử cuộc hẹn" isBack />
            <View style={[DefaultStyles.wrapBody, { flex: 1 }]}>
                <FlatList
                    data={appointmentData?.appointments || []}
                    renderItem={renderAppointmentItem}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<EmptyView />}
                    contentContainerStyle={{ paddingVertical: scaleModerate(20) }}
                />
            </View>
        </SafeAreaView>
    )
}

export default AppointmentHistoryView

const styles = StyleSheet.create({
    appointmentCard: {
        backgroundColor: Colors.whiteFF,
        borderRadius: 12,
        padding: scaleModerate(16),
        marginBottom: scaleModerate(12),
        borderWidth: 1,
        borderColor: Colors.border01,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: scaleModerate(12),
        paddingBottom: scaleModerate(12),
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayF5,
    },
    serviceInfo: { flex: 1 },
    statusBadge: {
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(6),
        borderRadius: 12,
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scaleModerate(8),
    },
    addressInfo: {
        flexDirection: 'row',
        marginBottom: scaleModerate(12),
    },
    priceSection: {
        backgroundColor: Colors.grayF5,
        borderRadius: 8,
        padding: scaleModerate(12),
        marginBottom: scaleModerate(12),
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scaleModerate(6),
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: scaleModerate(12),
        borderTopWidth: 1,
        borderTopColor: Colors.grayF5,
        marginBottom: scaleModerate(8),
    },
    paymentInfo: { alignItems: 'flex-end' },
})
