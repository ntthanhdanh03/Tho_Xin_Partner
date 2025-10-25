import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Header'
import { Colors } from '../../styles/Colors'
import { getHistoryTransactionAction } from '../../store/actions/transactionAction'
import moment from 'moment'

const TransactionHistoryView = () => {
    const dispatch = useDispatch()
    const { data: authData } = useSelector((store: any) => store.auth)
    const [transactions, setTransactions] = useState<any[]>([])

    useEffect(() => {
        dispatch(
            getHistoryTransactionAction({ partnerId: authData?.user?._id }, (data: any) => {
                setTransactions(data?.transactions || [])
            }),
        )
    }, [])

    const renderItem = ({ item }: any) => {
        let displayAmount = item.amount
        let sign = '+'
        let color = Colors.green34

        if (item.type === 'appointment') {
            if (item.paymentMethod === 'qr') {
                displayAmount = item.amount * 0.8
                sign = '+'
                color = Colors.green34
            } else if (item.paymentMethod === 'cash') {
                displayAmount = item.amount * 0.2 - +item.promotionDiscount
                sign = '-'
                color = Colors.red30
            }
        } else if (item.type === 'topUp') {
            displayAmount = item.amount
            sign = '+'
            color = Colors.green34
        }
        return (
            <View style={styles.itemContainer}>
                <View style={styles.rowBetween}>
                    <Text style={styles.typeText}>
                        {item.type === 'appointment'
                            ? 'Thanh toán cuộc hẹn'
                            : item.type === 'topUp'
                              ? 'Nạp tiền'
                              : item.type}
                    </Text>

                    <Text style={[styles.amountText, { color }]}>
                        {sign}
                        {displayAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}đ
                    </Text>
                </View>

                {item.paymentMethod && (
                    <Text style={styles.methodText}>
                        Phương thức:{' '}
                        {item.paymentMethod === 'cash'
                            ? 'Tiền mặt'
                            : item.paymentMethod.toUpperCase()}
                    </Text>
                )}

                <Text style={styles.dateText}>
                    {moment(item.createdAt).format('HH:mm DD/MM/YYYY')}
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Lịch sử giao dịch" isBack />
            <FlatList
                data={transactions}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={<Text style={styles.emptyText}>Không có giao dịch nào</Text>}
            />
        </SafeAreaView>
    )
}

export default TransactionHistoryView

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeText: {
        fontSize: 16,
        fontWeight: '500',
    },
    amountText: {
        fontSize: 16,
        fontWeight: '600',
    },
    methodText: {
        color: '#555',
        marginTop: 4,
    },
    dateText: {
        color: '#888',
        fontSize: 12,
        marginTop: 4,
    },
    separator: {
        height: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#777',
        marginTop: 30,
    },
})
