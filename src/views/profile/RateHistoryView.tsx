import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, Image, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Header from '../components/Header'
import Line from '../components/Line'
import Spacer from '../components/Spacer'
import { Colors } from '../../styles/Colors'
import { getRateAction } from '../../store/actions/rateAction'
import { scaleModerate } from '../../styles/scaleDimensions'
import FastImage from 'react-native-fast-image'
import { img_default_avatar } from '../../assets'

const RateHistoryView = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: authData } = useSelector((store: any) => store.auth)
    const [ratingData, setRatingData] = useState<any>(null)

    useEffect(() => {
        dispatch(
            getRateAction({ partnerId: authData?.user?._id }, (data: any) => {
                if (data) {
                    setRatingData(data)
                }
            }),
        )
    }, [])

    const renderStars = (rating: number) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={styles.starIcon}>
                        {star <= rating ? '⭐' : '☆'}
                    </Text>
                ))}
            </View>
        )
    }

    const renderRateItem = ({ item }: any) => {
        const createdDate = new Date(item.createdAt)
        const formattedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`

        return (
            <View style={styles.rateCard}>
                <View style={styles.rateHeader}>
                    {item.clientId?.avatarUrl ? (
                        <FastImage
                            source={{ uri: item.clientId.avatarUrl }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <FastImage source={img_default_avatar} style={styles.avatarImage} />
                    )}
                    <View style={styles.headerInfo}>
                        <Text style={DefaultStyles.textMedium16Black}>
                            {item.clientId?.fullName || 'Khách hàng'}
                        </Text>
                        <Text style={[DefaultStyles.textRegular13Gray, { marginTop: 2 }]}>
                            {formattedDate}
                        </Text>
                    </View>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{item.rating}</Text>
                        <Text style={styles.starSmall}>⭐</Text>
                    </View>
                </View>

                <Spacer height={12} />
                {renderStars(item.rating)}

                {item.comment && (
                    <>
                        <Spacer height={12} />
                        <Text style={DefaultStyles.textRegular14Black}>{item.comment}</Text>
                    </>
                )}

                {item.images && item.images.length > 0 && (
                    <>
                        <Spacer height={12} />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.imagesContainer}>
                                {item.images.map((imageUrl: string, index: number) => (
                                    <Image
                                        key={index}
                                        source={{ uri: imageUrl }}
                                        style={styles.reviewImage}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </>
                )}

                {item.appointmentId && (
                    <>
                        <Spacer height={12} />
                        <View style={styles.appointmentInfo}>
                            <Text style={DefaultStyles.textRegular12Gray}>
                                Mã cuộc hẹn: {item.appointmentId._id}
                            </Text>
                        </View>
                    </>
                )}
            </View>
        )
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Đánh giá từ khách hàng" isBack />

            {ratingData && (
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.averageRating}>{ratingData.averageRating}</Text>
                        <Text style={styles.starLarge}>⭐</Text>
                    </View>
                    <View style={styles.summaryInfo}>
                        <Text style={DefaultStyles.textMedium18Black}>Đánh giá trung bình</Text>
                        <Text style={DefaultStyles.textRegular14Gray}>
                            Dựa trên {ratingData.total} đánh giá
                        </Text>
                    </View>
                </View>
            )}

            <Line />

            <FlatList
                data={ratingData?.rates || []}
                renderItem={renderRateItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Spacer height={16} />
                        <Text style={DefaultStyles.textMedium16Black}>Chưa có đánh giá nào</Text>
                        <Spacer height={8} />
                        <Text style={[DefaultStyles.textRegular14Gray, { textAlign: 'center' }]}>
                            Các đánh giá từ khách hàng sẽ xuất hiện tại đây
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}

export default RateHistoryView

const styles = StyleSheet.create({
    summaryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaleModerate(16),
        paddingVertical: scaleModerate(20),
        backgroundColor: Colors.whiteFF,
    },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray72,
        paddingHorizontal: scaleModerate(20),
        paddingVertical: scaleModerate(12),
        borderRadius: 24,
        marginRight: scaleModerate(16),
    },
    averageRating: {
        ...DefaultStyles.textBold24Black,
        color: Colors.whiteFF,
        marginRight: scaleModerate(4),
    },
    starLarge: {
        fontSize: 24,
    },
    summaryInfo: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: scaleModerate(16),
        paddingBottom: scaleModerate(20),
    },
    rateCard: {
        backgroundColor: Colors.whiteFF,
        borderRadius: 12,
        padding: scaleModerate(16),
        marginTop: scaleModerate(16),
        borderWidth: 1,
        borderColor: Colors.border01,
        ...DefaultStyles.shadow,
    },
    rateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: scaleModerate(48),
        height: scaleModerate(48),
        borderRadius: scaleModerate(24),
        backgroundColor: Colors.primary300,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scaleModerate(12),
    },
    avatarImage: {
        width: scaleModerate(48),
        height: scaleModerate(48),
        borderRadius: scaleModerate(24),
        marginRight: scaleModerate(12),
        backgroundColor: Colors.grayF5,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.whiteFF,
    },
    headerInfo: {
        flex: 1,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.yellowFFF,
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(6),
        borderRadius: 20,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.yellowDC,
        marginRight: scaleModerate(4),
    },
    starSmall: {
        fontSize: 14,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    starIcon: {
        fontSize: 20,
        marginRight: scaleModerate(4),
    },
    imagesContainer: {
        flexDirection: 'row',
    },
    reviewImage: {
        width: scaleModerate(100),
        height: scaleModerate(100),
        borderRadius: 8,
        marginRight: scaleModerate(8),
        backgroundColor: Colors.grayF5,
    },
    appointmentInfo: {
        backgroundColor: Colors.grayF5,
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(8),
        borderRadius: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scaleModerate(60),
    },
    emptyIcon: {
        fontSize: 64,
    },
})
