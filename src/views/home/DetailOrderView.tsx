import React, { useState } from 'react'
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ScrollView,
    TextInput,
    Image,
    Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { Colors } from '../../styles/Colors'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Button from '../components/Button'
import CustomModal from './CustomModal'
import Input from '../components/Input'
import Spacer from '../components/Spacer'
import { useDispatch, useSelector } from 'react-redux'
import { applicantOrderAction } from '../../store/actions/orderAction'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import { useNavigation } from '@react-navigation/native'
import { getChatRoomByApplicantAction } from '../../store/actions/chatAction'

const formatCurrency = (value: string) => {
    if (!value) return ''
    const numeric = value.replace(/\D/g, '')
    if (!numeric) return ''
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const DetailOrderView = ({ route }: any) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: authData } = useSelector((store: any) => store.auth)
    const { item } = route.params
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [price, setPrice] = useState('')
    const [note, setNote] = useState('')

    const handleApplicant = () => {
        const postData = {
            partnerId: authData?.user?._id,
            name: authData?.user?.fullName,
            avatarUrl: authData?.user?.avatarUrl,
            offeredPrice: price,
            note: note,
        }

        dispatch(
            applicantOrderAction(
                {
                    id: item._id,
                    postData,
                },
                (data: any, error: any) => {
                    if (data) {
                        GlobalModalController.showModal({
                            title: 'Báo giá thành công',
                            description: error || 'Báo giá thành công',
                            icon: 'success',
                        })
                        dispatch(getChatRoomByApplicantAction({ _applicantId: authData.user._id }))
                        navigation.goBack()
                        setIsModalVisible(false)
                    } else {
                        GlobalModalController.showModal({
                            title: 'Báo giá thất bại',
                            description: error || 'Vui lòng kiểm tra lại thông tin',
                            icon: 'fail',
                        })
                        setIsModalVisible(false)
                    }
                },
            ),
        )
    }

    return (
        <SafeAreaView style={[DefaultStyles.container]} edges={['top']}>
            <Header isBack title="Chi Tiết Yêu Cầu" />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.serviceCard}>
                    <View style={styles.serviceHeader}>
                        <Text style={[DefaultStyles.textBold16Black, { flex: 1 }]}>
                            {item.service}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[DefaultStyles.textMedium14Black, { marginBottom: 8 }]}>
                        Mô tả tình trạng
                    </Text>
                    <Text style={[DefaultStyles.textRegular16Black, { lineHeight: 22 }]}>
                        {item.describe}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[DefaultStyles.textMedium14Black, { marginBottom: 6 }]}>
                        📍 Địa chỉ
                    </Text>
                    <Text style={[DefaultStyles.textRegular16Black]}>{item.address}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[DefaultStyles.textMedium14Black, { marginBottom: 6 }]}>
                        Giá tham khảo
                    </Text>
                    <View style={styles.priceBox}>
                        <Text style={[DefaultStyles.textBold16Black, { color: Colors.green34 }]}>
                            {item.rangePrice}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[DefaultStyles.textMedium14Black, { marginBottom: 10 }]}>
                        Hình ảnh
                    </Text>
                    {item.images && item.images.length > 0 ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginLeft: -16 }}
                        >
                            {item.images.map((image: string, index: number) => (
                                <Image
                                    key={index}
                                    source={{ uri: image }}
                                    style={styles.imageItem}
                                />
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={[DefaultStyles.textRegular13Gray]}>Không có hình ảnh</Text>
                    )}
                </View>

                <Spacer height={20} />
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Button
                    title="Báo giá"
                    containerStyle={styles.button}
                    onPress={() => {
                        setIsModalVisible(true)
                    }}
                />
            </View>

            <CustomModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                configHeight={0.8}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[DefaultStyles.textBold16Black, { marginBottom: 16 }]}>
                        Gửi báo giá
                    </Text>

                    <Input
                        title="Ghi chú"
                        value={note}
                        area
                        onChangeText={(text) => setNote(text)}
                        placeholder="Nhập ghi chú của bạn"
                    />
                    <Spacer height={14} />

                    <Input
                        title="Báo giá (VNĐ)"
                        keyboardType="number-pad"
                        value={price}
                        onChangeText={(text) => setPrice(formatCurrency(text))}
                        placeholder="Nhập số tiền"
                    />
                    <Spacer height={20} />
                </ScrollView>

                <View style={styles.modalButtonContainer}>
                    <Button title="Xác nhận" onPress={handleApplicant} disable={!price.trim()} />
                </View>
            </CustomModal>
        </SafeAreaView>
    )
}

export default DetailOrderView

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    serviceCard: {
        backgroundColor: Colors.whiteF2,
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary700,
    },
    serviceHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    section: {
        marginBottom: 18,
    },
    priceBox: {
        backgroundColor: Colors.whiteF2,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: Colors.green34,
    },
    imageItem: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 12,
        marginLeft: 16,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.grayDE,
    },
    button: {
        margin: 0,
    },
    modalButtonContainer: {},
})
