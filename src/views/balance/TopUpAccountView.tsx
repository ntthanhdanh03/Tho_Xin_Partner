import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Image, ActivityIndicator, DeviceEventEmitter } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Header from '../components/Header'
import Spacer from '../components/Spacer'
import Button from '../components/Button'
import Input from '../components/Input'
import { Colors } from '../../styles/Colors'
import { createQrTopUpAction, TopUpSuccessAction } from '../../store/actions/transactionAction'
import SocketUtil from '../../utils/socketUtil'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import { startSocketBackground } from '../../services/backgroundSocket'

const TopUpAccountView = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: authData } = useSelector((store: any) => store.auth)

    const [amount, setAmount] = useState('')
    const [qrUrl, setQrUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState<number>(0)

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const handleTopUpSuccess = (payload: any) => {
            console.log('💰 Nhận event nạp tiền thành công:', payload)
            setSuccess(true)
            setCountdown(0)
            if (timerRef.current) clearInterval(timerRef.current)

            dispatch(TopUpSuccessAction(payload?.newBalance))
            GlobalModalController.showModal({
                title: 'Thành công',
                description: 'Nạp tiền thành công!',
                icon: 'success',
            })
            GlobalModalController.onActionChange(() => {
                navigation.goBack()
            })
        }
        SocketUtil.on('transaction.top_up.success', handleTopUpSuccess)
        const subscription = DeviceEventEmitter.addListener('TOP_UP_SUCCESS', handleTopUpSuccess)

        return () => {
            SocketUtil.off('transaction.top_up.success', handleTopUpSuccess)
            subscription.remove()
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const createQR = () => {
        const value = Number(amount)
        if (!value || value < 2000) {
            setError('Số tiền nạp tối thiểu là 2.000đ')
            return
        }

        setError(null)
        setQrUrl(null)
        setSuccess(false)
        setLoading(true)
        startSocketBackground(authData.user._id, 'partner')
        dispatch(
            createQrTopUpAction(
                { amount: value, userId: authData?.user?._id },
                (qrUrl: string, error: string) => {
                    setLoading(false)
                    if (error) {
                        console.log('❌ Lỗi tạo QR:', error)
                        return
                    }
                    console.log('✅ Nhận được QR URL:', qrUrl)
                    setQrUrl(qrUrl)
                    setCountdown(600) // 10 phút
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

    const handleChangeAmount = (text: string) => {
        setAmount(text)
        const value = Number(text)
        if (value >= 2000 || !text) {
            setError(null)
        } else {
            setError('Số tiền nạp tối thiểu là 2.000đ')
        }
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header
                title="Nạp tiền"
                isBack
                onPressBack={() => {
                    navigation.goBack()
                }}
            />
            <View style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
                <Input
                    title="Nhập số tiền cần nạp (VND)"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={handleChangeAmount}
                    error={!!error}
                    message={error || ''}
                />

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
            </View>

            <Button
                title={countdown > 0 ? 'Đang chờ thanh toán...' : 'Tạo lệnh nạp tiền'}
                onPress={createQR}
                containerStyle={{ margin: 10 }}
                disable={error ? true : countdown > 0} // không cho tạo khi đang đếm
            />
        </SafeAreaView>
    )
}

export default TopUpAccountView

const styles = StyleSheet.create({
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
