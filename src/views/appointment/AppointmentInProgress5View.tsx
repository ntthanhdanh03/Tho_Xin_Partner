import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    DeviceEventEmitter,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { SafeAreaView } from 'react-native-safe-area-context'
import Spacer from '../components/Spacer'
import FastImage from 'react-native-fast-image'
import { ic_balence } from '../../assets'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'
import Selection from '../components/Selection'
import Button from '../components/Button'
import { createQrPaidAction, createQrTopUpAction } from '../../store/actions/transactionAction'
import { startSocketBackground } from '../../services/backgroundSocket'
import SocketUtil from '../../utils/socketUtil'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import {
    getAppointmentAction,
    updateCompleteAppointmentAction,
} from '../../store/actions/appointmentAction'

const AppointmentInProgress5View = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const route = useRoute<any>()
    const { data: appointmentData } = useSelector((store: any) => store.appointment)
    const { data: authData } = useSelector((store: any) => store.auth)

    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr' | null>(null)
    const [qrUrl, setQrUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState<number>(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const appointmentInProgress = appointmentData?.appointmentInProgress?.[0]

    const paymentMethods = [
        { key: 'cash', name: 'Tiền mặt' },
        { key: 'qr', name: 'QR thanh toán' },
    ]

    const totalAmount = useMemo(() => {
        if (!appointmentInProgress) return 0
        let total = appointmentInProgress.laborCost || 0

        if (appointmentInProgress.additionalIssues?.length > 0) {
            const additionalCost = appointmentInProgress.additionalIssues.reduce(
                (sum: number, issue: any) => sum + (issue.cost || 0),
                0,
            )
            total += additionalCost
        }

        if (
            appointmentInProgress.promotionDiscount &&
            appointmentInProgress.promotionDiscount > 0
        ) {
            total -= appointmentInProgress.promotionDiscount
        }

        return total
    }, [appointmentInProgress])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        const handleTopUpSuccess = (payload: any) => {
            dispatch(
                getAppointmentAction({ partnerId: authData.user._id }, (data: any) => {
                    if (data) {
                        GlobalModalController.showModal({
                            title: 'Thành công',
                            description:
                                'Khách hàng đã thanh toán thành công , cảm ơn Bác Thợ đã chăm chỉ làm việc !!!',
                            icon: 'success',
                        })
                        GlobalModalController.onActionChange(() => {})
                    }
                }),
            )
        }
        SocketUtil.on('transaction.paid_appointment.success', handleTopUpSuccess)

        return () => {
            SocketUtil.off('transaction.top_up.success', handleTopUpSuccess)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const createQR = () => {
        if (!authData?.user?._id) return
        setLoading(true)
        setQrUrl(null)
        dispatch(
            createQrPaidAction(
                {
                    amount: '2000',
                    clientId: appointmentInProgress?.clientId?._id,
                    partnerId: appointmentInProgress?.partnerId,
                    appointmentId: appointmentInProgress._id,
                },
                (url: string, error: string) => {
                    setLoading(false)
                    if (error) {
                        console.log('❌ QR lỗi:', error)
                        return
                    }
                    setQrUrl(url)
                    setCountdown(600)
                    if (timerRef.current) clearInterval(timerRef.current)
                    timerRef.current = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timerRef.current!)
                                setQrUrl(null)
                                return 0
                            }
                            return prev - 1
                        })
                    }, 1000)
                },
            ),
        )
    }

    const handleCompleteAppointment = () => {
        GlobalModalController.onActionChange((value: boolean) => {
            if (value) {
                dispatch(
                    updateCompleteAppointmentAction(
                        {
                            appointmentId: appointmentInProgress._id,
                            postData: {
                                partnerId: appointmentInProgress?.partnerId,
                                amount: 2000,
                                paymentMethod: 'cash',
                            },
                        },
                        (data: any) => {
                            if (data) {
                                dispatch(
                                    getAppointmentAction(
                                        { partnerId: authData.user._id },
                                        (data: any) => {
                                            GlobalModalController.showModal({
                                                title: 'Thành công',
                                                description:
                                                    'Hoàn thành cuộc hẹn Thành Công , cảm ơn Bác Thợ đã chăm chỉ làm việc !!!',
                                                icon: 'success',
                                            })
                                        },
                                    ),
                                )
                            }
                        },
                    ),
                )
            } else {
                GlobalModalController.hideModal()
            }
        })
        GlobalModalController.showModal({
            title: 'Xác nhận kiểm tra lần cuối?',
            description:
                'Hãy chắc chắn rằng bạn đã kiểm tra kỹ tình trạng công việc của khách hàng trước khi bắt đầu công việc.',
            type: 'yesNo',
            icon: 'warning',
        })
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Thanh toán" />
            <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
                <Spacer height={10} />
                <View style={styles.summaryCard}>
                    <View style={styles.cardHeader}>
                        <FastImage
                            source={ic_balence}
                            style={styles.iconBalance}
                            resizeMode="contain"
                        />
                        <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>
                    </View>

                    <Spacer height={16} />

                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Chi phí lao động</Text>
                        <Text style={styles.costValue}>
                            {(appointmentInProgress?.laborCost || 0).toLocaleString('vi-VN')} đ
                        </Text>
                    </View>

                    {appointmentInProgress?.additionalIssues?.length > 0 && (
                        <>
                            <Spacer height={12} />
                            <View style={styles.divider} />
                            <Spacer height={12} />

                            {appointmentInProgress.additionalIssues.map(
                                (issue: any, index: number) => (
                                    <View key={issue._id || index}>
                                        <View style={styles.costRow}>
                                            <Text style={styles.costLabel}>{issue.note}</Text>
                                            <Text style={styles.costValue}>
                                                {(issue.cost || 0).toLocaleString('vi-VN')} đ
                                            </Text>
                                        </View>
                                        {index <
                                            appointmentInProgress.additionalIssues.length - 1 && (
                                            <Spacer height={12} />
                                        )}
                                    </View>
                                ),
                            )}
                        </>
                    )}

                    {appointmentInProgress?.promotionCode && (
                        <>
                            <Spacer height={12} />
                            <View style={styles.divider} />
                            <Spacer height={12} />
                            <View style={styles.costRow}>
                                <Text style={[styles.costLabel]}>
                                    Mã khuyến mãi ({appointmentInProgress.promotionCode})
                                </Text>
                                <Text style={[styles.costValue, { color: Colors.green34 }]}>
                                    -
                                    {(appointmentInProgress.promotionDiscount || 0).toLocaleString(
                                        'vi-VN',
                                    )}{' '}
                                    đ
                                </Text>
                            </View>
                        </>
                    )}

                    <Spacer height={16} />
                    <View style={styles.divider} />
                    <Spacer height={16} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalAmount}>
                            {totalAmount.toLocaleString('vi-VN')} đ
                        </Text>
                    </View>
                </View>

                <Spacer height={10} />
                <Selection
                    title="Phương thức thanh toán"
                    data={paymentMethods}
                    keyValue={paymentMethod}
                    onSelect={(selectedItem: any) => {
                        setPaymentMethod(selectedItem?.key)
                        console.log('Selected fields:', selectedItem)
                    }}
                />
                <Spacer height={4} />
                <Text style={{ ...DefaultStyles.textRegular12Red, marginLeft: 4 }}>
                    Hãy trao đổi với khách hàng về phương thức trước khi chọn (*)
                </Text>

                {paymentMethod === 'qr' && (
                    <>
                        <Spacer height={20} />
                        <Text style={{ textAlign: 'center', ...DefaultStyles.textBold16Black }}>
                            Khung QR
                        </Text>
                        <Spacer height={10} />
                        <View style={styles.qrBox}>
                            {loading && <ActivityIndicator size="large" color={Colors.primary} />}
                            {!loading && qrUrl && (
                                <>
                                    <Image
                                        source={{ uri: qrUrl }}
                                        style={{ width: 220, height: 220, borderRadius: 12 }}
                                        resizeMode="contain"
                                    />
                                    <Spacer height={10} />
                                    {countdown > 0 && (
                                        <Text style={styles.timerText}>
                                            Mã QR hết hạn sau: {formatTime(countdown)}
                                        </Text>
                                    )}
                                </>
                            )}
                            {!loading && !qrUrl && (
                                <Text style={{ color: Colors.black01 }}>Chưa có mã QR</Text>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            <View style={{ margin: 10 }}>
                {paymentMethod === 'cash' ? (
                    <Button
                        title="Khách hàng đã thanh toán"
                        onPress={() => handleCompleteAppointment()}
                    />
                ) : paymentMethod === 'qr' ? (
                    <Button
                        title={countdown > 0 ? 'Đang chờ thanh toán...' : 'Tạo mã QR thanh toán'}
                        onPress={createQR}
                        disable={loading || countdown > 0}
                    />
                ) : (
                    <Button title="Chọn kiểu thanh toán" disable />
                )}
            </View>
        </SafeAreaView>
    )
}

export default AppointmentInProgress5View

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: Colors.whiteFF,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border01,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBalance: {
        width: 24,
        height: 24,
    },
    cardTitle: { ...DefaultStyles.textBold18Black },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    costLabel: { ...DefaultStyles.textMedium14Black, flex: 1 },
    costValue: { ...DefaultStyles.textBold16Black },
    divider: { height: 1, backgroundColor: Colors.border01 },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: { ...DefaultStyles.textBold16Black },
    totalAmount: {
        ...DefaultStyles.textBold18Black,
        color: Colors.primary,
    },
    qrBox: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.green34,
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 260,
        minHeight: 260,
        backgroundColor: Colors.whiteAE,
    },
    timerText: {
        color: Colors.red30,
        fontWeight: 'bold',
    },
})
