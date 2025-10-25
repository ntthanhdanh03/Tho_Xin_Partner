import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getHistoryTransactionAction } from '../../store/actions/transactionAction'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import Spacer from '../components/Spacer'
import { useNavigation } from '@react-navigation/native'

const TransactionMonthView = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: authData } = useSelector((store: any) => store.auth)

    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const fetchTransactions = () => {
        if (!authData?.user?._id) return
        setLoading(true)
        dispatch(
            getHistoryTransactionAction(
                {
                    partnerId: authData.user._id,
                    type: 'appointment',
                    range: 'month',
                    month,
                    year,
                },
                (data: any) => {
                    setLoading(false)
                    if (data?.transactions) setTransactions(data.transactions)
                    else setTransactions([])
                },
            ),
        )
    }

    useEffect(() => {
        fetchTransactions()
    }, [authData?.user?._id, month, year])

    const handlePrevMonth = () => {
        setMonth((prev) => {
            if (prev === 1) {
                setYear((y) => y - 1)
                return 12
            }
            return prev - 1
        })
    }

    const handleNextMonth = () => {
        setMonth((prev) => {
            if (prev === 12) {
                setYear((y) => y + 1)
                return 1
            }
            return prev + 1
        })
    }

    const getTransactionDisplay = (item: any) => {
        let displayAmount = item.amount
        let sign = '+'
        let color = Colors.green34

        if (item.type === 'appointment') {
            if (item.paymentMethod === 'qr') {
                displayAmount = item.amount * 0.8
                sign = '+'
                color = Colors.green34
            } else if (item.paymentMethod === 'cash') {
                displayAmount = item.amount * 0.8
                sign = '+'
                color = Colors.green34
            }
        }

        return {
            text: `${sign}${displayAmount.toLocaleString()}đ`,
            color,
        }
    }

    const getTotalAmount = () => {
        return transactions.reduce((sum, t) => {
            const { text } = getTransactionDisplay(t)
            const val = Number(text.replace(/[^\d-]/g, ''))
            return sum + val * (text.startsWith('-') ? -1 : 1)
        }, 0)
    }

    const monthNames = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ]

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <Spacer height={26} />
                <View style={styles.monthSelector}>
                    <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                        <Text style={styles.navButtonText}>‹</Text>
                    </TouchableOpacity>

                    <View style={styles.monthDisplay}>
                        <Text style={styles.monthText}>{monthNames[month - 1]}</Text>
                        <Text style={styles.yearText}>{year}</Text>
                    </View>

                    <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                        <Text style={styles.navButtonText}>›</Text>
                    </TouchableOpacity>
                </View>

                {!loading && transactions.length > 0 && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Tổng giao dịch</Text>
                            <Text style={styles.summaryValue}>{transactions.length}</Text>
                        </View>
                        <View style={[styles.summaryRow, { marginTop: 12 }]}>
                            <Text style={styles.summaryLabel}>Tổng tiền</Text>
                            <Text
                                style={[
                                    styles.totalAmount,
                                    {
                                        color:
                                            getTotalAmount() >= 0 ? Colors.green34 : Colors.red30,
                                    },
                                ]}
                            >
                                {getTotalAmount().toLocaleString()}đ
                            </Text>
                        </View>
                        <Spacer height={10} />
                    </View>
                )}
            </View>

            {/* Transaction List */}
            <View style={styles.body}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Đang tải...</Text>
                    </View>
                ) : transactions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyTitle}>Không có giao dịch</Text>
                        <Text style={styles.emptySubtitle}>
                            Chưa có giao dịch nào trong tháng này
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.transactionList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {transactions.map((t, i) => {
                            const { text, color } = getTransactionDisplay(t)
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.transactionCard}
                                    onPress={() => {
                                        navigation.navigate(
                                            ...([
                                                'AppointmentView',
                                                { appointmentId: t?.appointmentId },
                                            ] as never),
                                        )
                                    }}
                                >
                                    <View style={styles.transactionLeft}>
                                        <View style={styles.transactionInfo}>
                                            {t.paymentMethod && (
                                                <Text style={styles.transactionDate}>
                                                    Phương thức:{' '}
                                                    {t.paymentMethod === 'cash'
                                                        ? 'Tiền mặt'
                                                        : t.paymentMethod.toUpperCase()}
                                                </Text>
                                            )}
                                            <Text style={styles.transactionDate}>
                                                {new Date(t.createdAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.transactionAmount, { color }]}>
                                        {text}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                )}
            </View>
        </View>
    )
}

export default TransactionMonthView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grayF5,
    },
    headerCard: {
        backgroundColor: Colors.whiteFF,
        paddingHorizontal: scaleModerate(16),
        borderBottomLeftRadius: scaleModerate(24),
        borderBottomRightRadius: scaleModerate(24),
        ...DefaultStyles.shadow,
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scaleModerate(16),
    },
    navButton: {
        width: scaleModerate(40),
        height: scaleModerate(40),
        backgroundColor: Colors.primary,
        borderRadius: scaleModerate(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 24,
        color: Colors.whiteFF,
        fontWeight: '600',
    },
    monthDisplay: {
        alignItems: 'center',
    },
    monthText: {
        ...DefaultStyles.textBold20Black,
        color: Colors.primary700,
    },
    yearText: {
        ...DefaultStyles.textRegular14Gray,
        marginTop: 2,
    },
    summaryCard: {},
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        ...DefaultStyles.textMedium14Black,
    },
    summaryValue: {
        ...DefaultStyles.textBold16Black,
        color: Colors.primary,
    },
    totalAmount: {
        ...DefaultStyles.textBold18Black,
    },
    body: {
        flex: 1,
        paddingTop: scaleModerate(16),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...DefaultStyles.textRegular14Gray,
        marginTop: scaleModerate(12),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scaleModerate(32),
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: scaleModerate(16),
    },
    emptyTitle: {
        ...DefaultStyles.textBold18Black,
        color: Colors.gray44,
        marginBottom: scaleModerate(8),
    },
    emptySubtitle: {
        ...DefaultStyles.textRegular14Gray,
        textAlign: 'center',
    },
    transactionList: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: scaleModerate(16),
        paddingBottom: scaleModerate(16),
    },
    transactionCard: {
        backgroundColor: Colors.whiteFF,
        borderRadius: scaleModerate(16),
        padding: scaleModerate(16),
        marginBottom: scaleModerate(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...DefaultStyles.shadow,
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        ...DefaultStyles.textMedium16Black,
        marginBottom: 4,
    },
    transactionDate: {
        ...DefaultStyles.textMedium14Black,
    },
    transactionAmount: {
        ...DefaultStyles.textBold14Black,
    },
})
