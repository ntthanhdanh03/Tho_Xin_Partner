import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import FastImage from 'react-native-fast-image'
import ImageViewing from 'react-native-image-viewing'

import Header from '../components/Header'
import Spacer from '../components/Spacer'
import Button from '../components/Button'

import { Colors } from '../../styles/Colors'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { getAppointmentByIdAction } from '../../store/actions/appointmentAction'

const AppointmentView = ({ route }: any) => {
    const { appointmentId } = route.params
    const dispatch = useDispatch()

    const [appointmentData, setAppointmentData] = useState<any>(null)
    const [isImageViewVisible, setIsImageViewVisible] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    const [currentImageType, setCurrentImageType] = useState<'before' | 'after' | 'additional'>(
        'before',
    )

    useEffect(() => {
        dispatch(
            getAppointmentByIdAction({ appointmentId: appointmentId }, (data: any) => {
                if (data) {
                    setAppointmentData(data)
                }
            }),
        )
    }, [])
    const getStatusInfo = (status: number) => {
        switch (status) {
            case 6:
                return {
                    text: 'Hoàn thành',
                    color: Colors.green34,
                    bg: Colors.greenD6,
                }
            case 0:
                return { text: 'Đã hủy', color: Colors.redFD, bg: Colors.pinkFC }
            default:
                return {
                    text: 'Không xác định',
                    color: Colors.gray72,
                    bg: Colors.grayF5,
                }
        }
    }

    const statusInfo = getStatusInfo(appointmentData?.status || 0)

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${day}/${month}/${year} - ${hours}:${minutes}`
    }

    const formatCurrency = (amount: number) => {
        return `${amount.toLocaleString('vi-VN')} VND`
    }

    // Handle image press
    const handleImagePress = (
        images: string[],
        index: number,
        type: 'before' | 'after' | 'additional',
    ) => {
        setCurrentImageType(type)
        setImageIndex(index)
        setIsImageViewVisible(true)
    }

    // Get current images for viewer
    const getCurrentImages = () => {
        if (!appointmentData) return []

        if (currentImageType === 'before') {
            return appointmentData.beforeImages?.images || []
        } else if (currentImageType === 'after') {
            return appointmentData.afterImages?.images || []
        } else {
            const additionalImages: string[] = []
            appointmentData.additionalIssues?.forEach((issue: any) => {
                additionalImages.push(...(issue.images || []))
            })
            return additionalImages
        }
    }

    if (!appointmentData) {
        return (
            <SafeAreaView style={DefaultStyles.container}>
                <Header isBack title="Chi tiết cuộc hẹn" />
                <View style={styles.loadingContainer}>
                    <Text style={DefaultStyles.textRegular14Gray}>Đang tải...</Text>
                </View>
            </SafeAreaView>
        )
    }

    const order = appointmentData.orderId

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header isBack title="Chi tiết cuộc hẹn" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    <Spacer height={16} />

                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                            {statusInfo.text}
                        </Text>
                    </View>

                    <Spacer height={16} />

                    {/* Order Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🔧 Thông tin dịch vụ</Text>
                        <Spacer height={12} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Dịch vụ:</Text>
                            <Text style={styles.infoValue}>{order?.service}</Text>
                        </View>

                        <Spacer height={8} />

                        <View style={styles.infoColumn}>
                            <Text style={styles.infoLabel}>Mô tả:</Text>
                            <Text style={styles.describeText}>{order?.describe}</Text>
                        </View>

                        <Spacer height={8} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Mã đơn:</Text>
                            <Text style={styles.orderIdText}>
                                #{order?._id.slice(-8).toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <Spacer height={16} />

                    {/* Time & Location */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thời gian & Địa điểm</Text>
                        <Spacer height={12} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Thời gian hẹn:</Text>
                            <Text style={styles.infoValue}>{formatDate(order?.dateTimeOder)}</Text>
                        </View>

                        <Spacer height={8} />

                        <View style={styles.infoColumn}>
                            <Text style={styles.infoLabel}>Địa chỉ:</Text>
                            <Text style={styles.addressText}>{order?.address}</Text>
                        </View>
                    </View>

                    <Spacer height={16} />

                    {/* Partner Info */}

                    {/* Price Breakdown */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}> Chi phí dịch vụ</Text>
                        <Spacer height={12} />

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Giá đã thỏa thuận:</Text>
                            <Text style={styles.priceValue}>
                                {formatCurrency(appointmentData.agreedPrice)}
                            </Text>
                        </View>

                        <Spacer height={8} />

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Chi phí công:</Text>
                            <Text style={styles.priceValue}>
                                {formatCurrency(appointmentData.laborCost)}
                            </Text>
                        </View>

                        {appointmentData.promotionCode && (
                            <>
                                <Spacer height={8} />
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>
                                        Mã giảm giá ({appointmentData.promotionCode}):
                                    </Text>
                                    <Text style={styles.discountValue}>
                                        -{formatCurrency(appointmentData.promotionDiscount)}
                                    </Text>
                                </View>
                            </>
                        )}

                        <View style={styles.divider} />

                        <View style={styles.priceRow}>
                            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                            <Text style={styles.totalValue}>
                                {formatCurrency(
                                    appointmentData.finalAmount || appointmentData.agreedPrice,
                                )}
                            </Text>
                        </View>

                        <Spacer height={8} />

                        <View style={styles.paymentMethodContainer}>
                            <Text style={styles.paymentMethodLabel}>Phương thức thanh toán:</Text>
                            <Text style={styles.paymentMethodValue}>
                                {appointmentData.paymentMethod === 'qr'
                                    ? '🏦 QR Code'
                                    : '💵 Tiền mặt'}
                            </Text>
                        </View>
                    </View>

                    <Spacer height={16} />

                    {/* Before Images */}
                    {appointmentData.beforeImages?.images &&
                        appointmentData.beforeImages.images.length > 0 && (
                            <>
                                <View style={styles.section}>
                                    <View style={styles.imagesSectionHeader}>
                                        <Text style={styles.sectionTitle}>
                                            Hình ảnh trước sửa (
                                            {appointmentData.beforeImages.images.length})
                                        </Text>
                                    </View>

                                    {appointmentData.beforeImages.note && (
                                        <>
                                            <Spacer height={8} />
                                            <Text style={styles.imageNote}>
                                                {appointmentData.beforeImages.note}
                                            </Text>
                                        </>
                                    )}

                                    <Spacer height={12} />

                                    <View style={styles.imagesWrapper}>
                                        {appointmentData.beforeImages.images.map(
                                            (img: string, index: number) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.imageBox}
                                                    onPress={() =>
                                                        handleImagePress(
                                                            appointmentData.beforeImages.images,
                                                            index,
                                                            'before',
                                                        )
                                                    }
                                                    activeOpacity={0.8}
                                                >
                                                    <FastImage
                                                        source={{ uri: img }}
                                                        style={styles.image}
                                                        resizeMode={FastImage.resizeMode.cover}
                                                    />
                                                </TouchableOpacity>
                                            ),
                                        )}
                                    </View>
                                </View>

                                <Spacer height={16} />
                            </>
                        )}

                    {/* After Images */}
                    {appointmentData.afterImages?.images &&
                        appointmentData.afterImages.images.length > 0 && (
                            <>
                                <View style={styles.section}>
                                    <View style={styles.imagesSectionHeader}>
                                        <Text style={styles.sectionTitle}>
                                            Hình ảnh sau sửa (
                                            {appointmentData.afterImages.images.length})
                                        </Text>
                                    </View>

                                    {appointmentData.afterImages.note && (
                                        <>
                                            <Spacer height={8} />
                                            <Text style={styles.imageNote}>
                                                {appointmentData.afterImages.note}
                                            </Text>
                                        </>
                                    )}

                                    <Spacer height={12} />

                                    <View style={styles.imagesWrapper}>
                                        {appointmentData.afterImages.images.map(
                                            (img: string, index: number) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.imageBox}
                                                    onPress={() =>
                                                        handleImagePress(
                                                            appointmentData.afterImages.images,
                                                            index,
                                                            'after',
                                                        )
                                                    }
                                                    activeOpacity={0.8}
                                                >
                                                    <FastImage
                                                        source={{ uri: img }}
                                                        style={styles.image}
                                                        resizeMode={FastImage.resizeMode.cover}
                                                    />
                                                </TouchableOpacity>
                                            ),
                                        )}
                                    </View>
                                </View>

                                <Spacer height={16} />
                            </>
                        )}

                    {appointmentData.additionalIssues &&
                        appointmentData.additionalIssues.length > 0 && (
                            <>
                                <View style={styles.section}>
                                    <View style={styles.imagesSectionHeader}>
                                        <Text style={styles.sectionTitle}>
                                            Phụ tùng ({appointmentData.additionalIssues.length})
                                        </Text>
                                    </View>
                                    <Spacer height={12} />
                                    {appointmentData.additionalIssues.map(
                                        (issue: any, issueIndex: number) => (
                                            <View
                                                key={issue._id}
                                                style={styles.additionalIssueCard}
                                            >
                                                <View style={styles.issueHeader}>
                                                    <Text style={styles.issueTitle}>
                                                        Phụ tùng #{issueIndex + 1}
                                                    </Text>
                                                    <Text style={styles.issueCost}>
                                                        {formatCurrency(issue.cost)}
                                                    </Text>
                                                </View>

                                                {issue.note && (
                                                    <>
                                                        <Spacer height={8} />
                                                        <Text style={styles.issueNote}>
                                                            {issue.note}
                                                        </Text>
                                                    </>
                                                )}

                                                {issue.images && issue.images.length > 0 && (
                                                    <>
                                                        <Spacer height={12} />
                                                        <View style={styles.imagesWrapper}>
                                                            {issue.images.map(
                                                                (img: string, imgIndex: number) => (
                                                                    <TouchableOpacity
                                                                        key={imgIndex}
                                                                        style={styles.imageBox}
                                                                        onPress={() => {
                                                                            const allAdditionalImages: string[] =
                                                                                []
                                                                            appointmentData.additionalIssues.forEach(
                                                                                (iss: any) => {
                                                                                    allAdditionalImages.push(
                                                                                        ...(iss.images ||
                                                                                            []),
                                                                                    )
                                                                                },
                                                                            )
                                                                            const globalIndex =
                                                                                appointmentData.additionalIssues
                                                                                    .slice(
                                                                                        0,
                                                                                        issueIndex,
                                                                                    )
                                                                                    .reduce(
                                                                                        (
                                                                                            acc: number,
                                                                                            iss: any,
                                                                                        ) =>
                                                                                            acc +
                                                                                            (iss
                                                                                                .images
                                                                                                ?.length ||
                                                                                                0),
                                                                                        0,
                                                                                    ) + imgIndex
                                                                            handleImagePress(
                                                                                allAdditionalImages,
                                                                                globalIndex,
                                                                                'additional',
                                                                            )
                                                                        }}
                                                                        activeOpacity={0.8}
                                                                    >
                                                                        <FastImage
                                                                            source={{ uri: img }}
                                                                            style={styles.image}
                                                                            resizeMode={
                                                                                FastImage.resizeMode
                                                                                    .cover
                                                                            }
                                                                        />
                                                                    </TouchableOpacity>
                                                                ),
                                                            )}
                                                        </View>
                                                    </>
                                                )}

                                                {issueIndex <
                                                    appointmentData.additionalIssues.length - 1 && (
                                                    <View style={styles.issueDivider} />
                                                )}
                                            </View>
                                        ),
                                    )}
                                </View>

                                <Spacer height={16} />
                            </>
                        )}

                    {/* Appointment Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin cuộc hẹn</Text>
                        <Spacer height={12} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Mã cuộc hẹn:</Text>
                            <Text style={styles.orderIdText}>
                                #{appointmentData._id.slice(-8).toUpperCase()}
                            </Text>
                        </View>

                        <Spacer height={8} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Tạo lúc:</Text>
                            <Text style={styles.infoValue}>
                                {formatDate(appointmentData.createdAt)}
                            </Text>
                        </View>

                        <Spacer height={8} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Cập nhật:</Text>
                            <Text style={styles.infoValue}>
                                {formatDate(appointmentData.updatedAt)}
                            </Text>
                        </View>
                    </View>

                    <Spacer height={20} />
                </View>
            </ScrollView>

            {/* Bottom Action */}
            {appointmentData.status < 6 && appointmentData.status > 0 && (
                <View style={styles.bottomBar}>
                    <Button
                        title="Liên hệ hỗ trợ"
                        containerStyle={styles.contactButton}
                        onPress={() => {
                            // Handle contact support
                        }}
                    />
                </View>
            )}

            {/* Image Viewer */}
            <ImageViewing
                images={getCurrentImages().map((uri: string) => ({ uri }))}
                imageIndex={imageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
                HeaderComponent={({ imageIndex }) => (
                    <View style={styles.headerIndicator}>
                        <Text style={styles.indicatorText}>
                            {imageIndex + 1} / {getCurrentImages().length}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default AppointmentView

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: Colors.grayF5,
    },
    contentContainer: {
        paddingHorizontal: scaleModerate(16),
        paddingBottom: scaleModerate(20),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: scaleModerate(16),
        paddingVertical: scaleModerate(8),
        borderRadius: scaleModerate(20),
        gap: scaleModerate(8),
    },
    statusDot: {
        width: scaleModerate(8),
        height: scaleModerate(8),
        borderRadius: scaleModerate(4),
    },
    statusText: {
        ...DefaultStyles.textMedium14Black,
    },
    section: {
        backgroundColor: Colors.whiteFF,
        borderRadius: scaleModerate(16),
        padding: scaleModerate(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        ...DefaultStyles.textBold16Black,
        color: Colors.black1B,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    infoColumn: {
        flexDirection: 'column',
    },
    infoLabel: {
        ...DefaultStyles.textRegular14Gray,
        color: Colors.gray72,
        flex: 1,
    },
    infoValue: {
        ...DefaultStyles.textMedium14Black,
        color: Colors.black1B,
        flex: 1.5,
        textAlign: 'right',
    },
    describeText: {
        ...DefaultStyles.textRegular14Black,
        color: Colors.black1B,
        marginTop: scaleModerate(4),
        lineHeight: scaleModerate(20),
    },
    addressText: {
        ...DefaultStyles.textRegular14Black,
        color: Colors.black1B,
        marginTop: scaleModerate(4),
        lineHeight: scaleModerate(20),
    },
    orderIdText: {
        ...DefaultStyles.textMedium14Black,
        color: Colors.primary,
        fontFamily: 'monospace',
    },
    applicantCard: {
        backgroundColor: Colors.grayF5,
        borderRadius: scaleModerate(12),
        padding: scaleModerate(12),
    },
    applicantHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scaleModerate(12),
    },
    avatarPlaceholder: {
        width: scaleModerate(48),
        height: scaleModerate(48),
        borderRadius: scaleModerate(24),
        backgroundColor: Colors.primary300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...DefaultStyles.textBold18White,
        color: Colors.whiteFF,
    },
    applicantInfo: {
        flex: 1,
    },
    applicantName: {
        ...DefaultStyles.textMedium16Black,
        color: Colors.black1B,
    },
    applicantNote: {
        ...DefaultStyles.textRegular14Gray,
        color: Colors.gray72,
        marginTop: scaleModerate(2),
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        ...DefaultStyles.textRegular14Black,
        color: Colors.black1B,
    },
    priceValue: {
        ...DefaultStyles.textMedium14Black,
        color: Colors.black1B,
    },
    discountValue: {
        ...DefaultStyles.textMedium14Black,
        color: Colors.green34,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border01,
        marginVertical: scaleModerate(12),
    },
    totalLabel: {
        ...DefaultStyles.textBold16Black,
        color: Colors.black1B,
    },
    totalValue: {
        ...DefaultStyles.textBold18Black,
        color: Colors.green34,
    },
    paymentMethodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.grayF5,
        padding: scaleModerate(12),
        borderRadius: scaleModerate(8),
    },
    paymentMethodLabel: {
        ...DefaultStyles.textRegular14Black,
        color: Colors.gray72,
    },
    paymentMethodValue: {
        ...DefaultStyles.textMedium14Black,
        color: Colors.primary,
    },
    imagesSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    approvedBadge: {
        backgroundColor: Colors.greenD6,
        paddingHorizontal: scaleModerate(8),
        paddingVertical: scaleModerate(4),
        borderRadius: scaleModerate(12),
    },
    approvedText: {
        ...DefaultStyles.textMedium12Black,
        color: Colors.green34,
    },
    pendingBadge: {
        backgroundColor: Colors.yellowFFF,
        paddingHorizontal: scaleModerate(8),
        paddingVertical: scaleModerate(4),
        borderRadius: scaleModerate(12),
    },
    pendingText: {
        ...DefaultStyles.textMedium12Black,
        color: Colors.yellowDC,
    },
    imageNote: {
        ...DefaultStyles.textRegular13Black,
        color: Colors.gray72,
        fontStyle: 'italic',
    },
    imagesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scaleModerate(12),
    },
    imageBox: {
        width: scaleModerate(78),
        height: scaleModerate(78),
        borderRadius: scaleModerate(12),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border01,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    additionalIssueCard: {
        backgroundColor: Colors.grayF5,
        borderRadius: scaleModerate(12),
        padding: scaleModerate(12),
        marginBottom: scaleModerate(12),
    },
    issueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    issueTitle: {
        ...DefaultStyles.textMedium14Black,
        color: Colors.black1B,
    },
    issueCost: {
        ...DefaultStyles.textBold14Black,
        color: Colors.redFD,
    },
    issueNote: {
        ...DefaultStyles.textRegular13Black,
        color: Colors.gray72,
    },
    issueDivider: {
        height: 1,
        backgroundColor: Colors.border01,
        marginTop: scaleModerate(12),
    },
    bottomBar: {
        paddingHorizontal: scaleModerate(16),
        paddingVertical: scaleModerate(16),
        borderTopWidth: 1,
        borderTopColor: Colors.border01,
        backgroundColor: Colors.whiteFF,
    },
    contactButton: {
        marginHorizontal: 0,
    },
    headerIndicator: {
        position: 'absolute',
        top: scaleModerate(50),
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: scaleModerate(16),
        paddingVertical: scaleModerate(8),
        borderRadius: scaleModerate(20),
    },
    indicatorText: {
        ...DefaultStyles.textMedium14White,
        color: Colors.whiteFF,
    },
})
