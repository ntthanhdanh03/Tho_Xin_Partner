import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import { Colors } from '../../../styles/Colors'
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
                        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                            <View style={styles.cardHeader}>
                                <Text style={[DefaultStyles.textBold16Black, { flex: 1 }]}>
                                    {item.service}
                                </Text>
                            </View>

                            <Text
                                style={[
                                    DefaultStyles.textRegular14Black,
                                    styles.description,
                                    { lineHeight: 20 },
                                ]}
                                numberOfLines={2}
                            >
                                {item.describe}
                            </Text>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoIcon}>📍</Text>
                                <Text
                                    style={[DefaultStyles.textRegular14Black, { flex: 1 }]}
                                    numberOfLines={1}
                                >
                                    {item.address}
                                </Text>
                            </View>

                            <Text style={[DefaultStyles.textRegular12Gray, styles.orderId]}>
                                ID: {item._id}
                            </Text>

                            <View style={styles.actionContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelButton]}
                                    onPress={() => handleCancelApplicant(item)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[DefaultStyles.textBold14White]}>Hủy báo giá</Text>
                                </TouchableOpacity>
                                <Spacer width={6} />
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.chatButton]}
                                    onPress={() => handleNavigationChat(item)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            DefaultStyles.textBold14Black,
                                            { color: Colors.whiteFF },
                                        ]}
                                    >
                                        Liên hệ khách
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ marginTop: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    )
}

export default OrderApplicantView

const styles = StyleSheet.create({
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
        backgroundColor: Colors.yellowFFF,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.yellow00,
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
    orderId: {
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDE,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.red30,
    },
    chatButton: {
        backgroundColor: Colors.primary700,
    },
})
