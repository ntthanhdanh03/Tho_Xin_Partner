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
import EmptyView from '../components/EmptyView'
import { useNavigation } from '@react-navigation/native'

const TransactionWeekView = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: authData } = useSelector((store: any) => store.auth)

    const now = new Date()
    const [week, setWeek] = useState(getWeekNumber(now))
    const [year, setYear] = useState(now.getFullYear())
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [dateRange, setDateRange] = useState({ start: '', end: '' })

    /** ✅ Hàm tính số tuần ISO */
    function getWeekNumber(date: Date) {
        const tempDate = new Date(date.getTime())
        tempDate.setHours(0, 0, 0, 0)
        const dayNum = (tempDate.getDay() + 6) % 7
        tempDate.setDate(tempDate.getDate() - dayNum + 3)
        const firstThursday = new Date(tempDate.getFullYear(), 0, 4)
        const diff = tempDate.getTime() - firstThursday.getTime()
        return 1 + Math.round(diff / (7 * 24 * 3600 * 1000))
    }

    /** ✅ Lấy ngày bắt đầu và kết thúc (Thứ 2 - CN) theo ISO Week */
    function getDateRangeOfWeek(weekNumber: number, year: number) {
        const simple = new Date(year, 0, 4)
        const dayOfWeek = simple.getDay() || 7
        const monday = new Date(
            simple.getTime() +
                (weekNumber - 1) * 7 * 24 * 3600 * 1000 -
                (dayOfWeek - 1) * 24 * 3600 * 1000,
        )
        const sunday = new Date(monday.getTime() + 6 * 24 * 3600 * 1000)
        return { start: monday, end: sunday }
    }

    const fetchTransactions = () => {
        if (!authData?.user?._id) return
        setLoading(true)

        const { start, end } = getDateRangeOfWeek(week, year)
        setDateRange({
            start: start.toLocaleDateString('vi-VN'),
            end: end.toLocaleDateString('vi-VN'),
        })

        dispatch(
            getHistoryTransactionAction(
                {
                    partnerId: authData.user._id,
                    type: 'appointment',
                    range: 'week',
                    week,
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
    }, [authData?.user?._id, week, year])

    const handlePrevWeek = () => {
        setWeek((prev) => {
            if (prev === 1) {
                setYear((y) => y - 1)
                return 52
            }
            return prev - 1
        })
    }

    const handleNextWeek = () => {
        setWeek((prev) => {
            if (prev === 52) {
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
            if (item.paymentMethod === 'qr' || item.paymentMethod === 'cash') {
                displayAmount = item.amount * 0.8
                sign = '+'
                color = Colors.green34
            }
        }

        return {
            text: `${sign}${displayAmount.toLocaleString()}`,
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

    return (
        <View style={styles.container}>
            <View style={styles.headerCard}>
                <Spacer height={10} />
                <View style={styles.weekSelector}>
                    <TouchableOpacity onPress={handlePrevWeek} style={styles.navButton}>
                        <Text style={styles.navButtonText}>‹</Text>
                    </TouchableOpacity>

                    <View style={styles.weekDisplay}>
                        <Text style={styles.weekText}>Tuần {week}</Text>
                        <Text style={styles.yearText}>{year}</Text>
                        <View style={styles.dateRangeBadge}>
                            <Text style={styles.dateRangeText}>
                                {dateRange.start} - {dateRange.end}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
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
                            <Text style={styles.totalAmount}>
                                {getTotalAmount().toLocaleString()}đ
                            </Text>
                        </View>
                        <Spacer height={10} />
                    </View>
                )}
            </View>

            <View style={styles.body}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Đang tải...</Text>
                    </View>
                ) : transactions.length === 0 ? (
                    <EmptyView />
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
                                        {text}đ
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

export default TransactionWeekView

const styles = StyleSheet.create({
    container: {
        ...DefaultStyles.container,
    },
    headerCard: {
        backgroundColor: Colors.whiteFF,
        paddingHorizontal: scaleModerate(16),
        paddingBottom: scaleModerate(10),
        borderBottomLeftRadius: scaleModerate(24),
        borderBottomRightRadius: scaleModerate(24),
        ...DefaultStyles.shadow,
    },
    weekSelector: {
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
        elevation: 3,
    },
    navButtonText: {
        fontSize: 24,
        color: Colors.whiteFF,
        fontWeight: '600',
    },
    weekDisplay: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: scaleModerate(12),
    },
    weekText: {
        ...DefaultStyles.textBold20Black,
        color: Colors.primary700,
    },
    yearText: {
        ...DefaultStyles.textRegular12Gray,
        marginTop: 2,
    },
    dateRangeBadge: {
        backgroundColor: Colors.blueB9,
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(6),
        borderRadius: scaleModerate(12),
        marginTop: scaleModerate(8),
    },
    dateRangeText: {
        ...DefaultStyles.textMedium12Black,
        color: Colors.primary700,
    },
    summaryCard: {
        backgroundColor: Colors.whiteFF,
        borderRadius: scaleModerate(16),
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(8),
    },
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
        color: Colors.green34,
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
    transactionList: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: scaleModerate(16),
        paddingBottom: scaleModerate(24),
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
    transactionDate: {
        ...DefaultStyles.textMedium14Black,
    },
    transactionAmount: {
        ...DefaultStyles.textBold16Black,
    },
})
