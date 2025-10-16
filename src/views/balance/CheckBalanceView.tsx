import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Header from '../components/Header'
import Line from '../components/Line'
import Button from '../components/Button'
import Spacer from '../components/Spacer'
import { Colors } from '../../styles/Colors'

const CheckBalanceView = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: authData } = useSelector((store: any) => store.auth)

    const balance = authData?.user?.partner?.profile?.balance || 0

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header
                title="Tài khoản"
                isBack
                renderRight={() => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('TransactionHistoryView' as never)}
                    >
                        <Text style={styles.headerRight}>Lịch sử</Text>
                    </TouchableOpacity>
                )}
            />
            <Spacer height={10} />
            <View style={[DefaultStyles.wrapBody, { flex: 1 }]}>
                {/* Card Số dư */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceTitle}>SỐ DƯ TẠM TÍNH (*)</Text>
                    <Spacer height={8} />
                    <Text style={styles.balanceAmount}>{balance.toLocaleString()} VND</Text>
                    <Spacer height={16} />
                    <TouchableOpacity
                        style={styles.topUpButton}
                        onPress={() => navigation.navigate('TopUpAccountView' as never)}
                    >
                        <Text style={styles.topUpText}>Nạp tiền</Text>
                    </TouchableOpacity>
                </View>

                <Spacer height={24} />

                {/* Có thể rút */}
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Có thể rút</Text>
                    <Text style={[styles.value, { color: Colors.green34 }]}>
                        {balance > 500000 ? `${(balance - 500000).toLocaleString()} VND` : '0 VND'}
                    </Text>
                </View>
                <Spacer height={6} />
                <Line />
            </View>

            {/* Ghi chú + nút rút tiền */}
            <View style={{ margin: 20 }}>
                <Text style={styles.note}>* Không thể rút 500.000 VND - Phí duy trì tài khoản</Text>
                <Text style={styles.note}>* Mức tối đa bạn có thể rút là 3.000.000 VND / ngày</Text>
                <Spacer height={16} />
                <Button title="Rút tiền" onPress={() => console.log('Withdraw pressed')} />
            </View>
        </SafeAreaView>
    )
}

export default CheckBalanceView

const styles = StyleSheet.create({
    headerRight: {
        ...DefaultStyles.textBold16Black,
        color: Colors.primary,
    },
    balanceCard: {
        backgroundColor: Colors.primary0,
        borderRadius: 16,
        paddingVertical: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    balanceTitle: {
        ...DefaultStyles.textBold16White,
        letterSpacing: 0.5,
    },
    balanceAmount: {
        ...DefaultStyles.textBold24Black,
        color: Colors.whiteAE,
    },
    topUpButton: {
        marginTop: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 18,
        paddingVertical: 6,
    },
    topUpText: {
        ...DefaultStyles.textBold14Black,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        ...DefaultStyles.textBold16Black,
        color: Colors.gray44,
    },
    value: {
        ...DefaultStyles.textBold16Black,
    },
    note: {
        textAlign: 'center',
        marginBottom: 4,
        ...DefaultStyles.textBold14Black,
    },
})
