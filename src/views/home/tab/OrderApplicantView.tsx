import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import EmptyView from '../../components/EmptyView'
import { scaleModerate } from '../../../styles/scaleDimensions'
import Spacer from '../../components/Spacer'
import { useNavigation } from '@react-navigation/native'
import { cancelApplicantOrderAction } from '../../../store/actions/orderAction'
import GlobalModalController from '../../components/GlobalModal/GlobalModalController'

const OrderApplicantView = ({ route }: any) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: orderData } = useSelector((store: any) => store.order)
    const { data: authData } = useSelector((store: any) => store.auth)

    const myOrders =
        orderData?.filter(
            (order: any) =>
                order.status === 'pending' &&
                order.applicants?.some(
                    (applicant: any) => String(applicant.partnerId) === String(authData?.user?._id),
                ),
        ) || []

    const handleNavigationChat = (applicant: any) => {
        const dataRoomChat = {
            orderId: applicant?._id,
            clientId: applicant?.clientId,
        }
        navigation.navigate(...(['ChatViewVer2', { dataRoomChat }] as never))
    }
    const handleCancelApplicant = (item: any) => {
        GlobalModalController.onActionChange((value: boolean) => {
            if (value) {
                dispatch(
                    cancelApplicantOrderAction(
                        {
                            orderId: item._id,
                            partnerId: authData?.user?._id,
                        },
                        (data: any, error: any) => {
                            if (data) {
                                GlobalModalController.showModal({
                                    title: 'Thành công',
                                    description: 'Bạn đã hủy báo giá thành công',
                                    icon: 'success',
                                })
                            } else {
                                GlobalModalController.showModal({
                                    title: 'Thất bại',
                                    description: error || 'Có lỗi xảy ra, vui lòng thử lại',
                                    icon: 'fail',
                                })
                            }
                        },
                    ),
                )
            } else {
                GlobalModalController.hideModal()
            }
        })

        GlobalModalController.showModal({
            title: 'Hủy báo giá',
            description: 'Bạn sẽ xóa báo giá với yêu cầu này',
            type: 'yesNo',
            icon: 'warning',
        })
    }

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
                            <Spacer height={10} />
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleCancelApplicant(item)
                                    }}
                                >
                                    <Text>Hủy báo giá</Text>
                                </TouchableOpacity>
                                <Spacer width={10} />
                                <TouchableOpacity
                                    onPress={() => {
                                        handleNavigationChat(item)
                                    }}
                                >
                                    <Text>Liên hệ với khách</Text>
                                </TouchableOpacity>
                            </View>
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
