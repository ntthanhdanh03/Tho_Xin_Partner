import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState, useMemo } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { SafeAreaView } from 'react-native-safe-area-context'

import Spacer from '../components/Spacer'
import Input from '../components/Input'
import FastImage from 'react-native-fast-image'
import { ic_balence } from '../../assets'
import { Colors } from '../../styles/Colors'
import PhotoOptionsPicker from '../components/PhotoOptionsPicker'
import SwipeButton from 'rn-swipe-button'
import Header from '../components/Header'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import { uploadKycPhoto } from '../../services/uploadKycPhoto '
import {
    getAppointmentAction,
    updateAppointmentAction,
    updateCancelAppointmentAction,
} from '../../store/actions/appointmentAction'
import LoadingWaitingApproveView from '../components/LoadingWaitingApproveView'
import ImageViewing from 'react-native-image-viewing'
import Button from '../components/Button'
import CustomModal from '../home/CustomModal'

const AppointmentInProgress2View = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { data: appointmentData } = useSelector((store: any) => store.appointment)
    const { data: authData } = useSelector((store: any) => store.auth)

    const APPOINTMENT_UPDATE_IN_PROGRESS = appointmentData?.appointmentInProgress?.[0]

    const [reason, setReason] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [price, setPrice] = useState<number>(0)
    const [images, setImages] = useState<string[]>([])
    const [showCameraOption, setShowCameraOption] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)

    const [isImageViewVisible, setIsImageViewVisible] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)

    // ✅ VALIDATION: Kiểm tra form đã đủ thông tin chưa
    const isFormValid = useMemo(() => {
        const hasImages = images.length > 0
        const hasPrice = price > 0
        const hasDescription = description.trim().length > 0

        return hasImages && hasPrice && hasDescription
    }, [images, price, description])

    const handleUploadPhoto = async (image: any) => {
        const uploadedImage = await uploadKycPhoto(image, 'imageService')
        if (uploadedImage?.url) {
            setImages((prev) => [...prev, uploadedImage.url])
        }
    }

    const handleConfirm = async () => {
        setLoading(true)
        const postData = {
            agreedPrice: price,
            beforeImages: {
                images: images,
                note: description,
            },
        }
        const typeUpdate = 'APPOINTMENT_UPDATE_IN_PROGRESS'
        const dataUpdate = {
            id: APPOINTMENT_UPDATE_IN_PROGRESS._id,
            typeUpdate,
            postData,
        }

        dispatch(
            updateAppointmentAction(dataUpdate, (data: any) => {
                if (data) {
                }
            }),
        )
    }

    const handleCancelAppointment = async () => {
        const dataUpdate = {
            id: APPOINTMENT_UPDATE_IN_PROGRESS._id,
            reason: reason,
        }
        dispatch(
            updateCancelAppointmentAction(dataUpdate, (data: any) => {
                if (data) {
                    dispatch(getAppointmentAction({ partnerId: authData.user._id }))
                }
            }),
        )
    }

    const imagesForGallery =
        images.length > 0 ? images : APPOINTMENT_UPDATE_IN_PROGRESS?.beforeImages?.images || []

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Kiểm tra tình trạng" />

            <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
                <Spacer height={10} />

                <Input
                    title="Mô tả vấn đề của Khách"
                    area
                    value={description}
                    onChangeText={setDescription}
                />
                <Spacer height={10} />

                <Input
                    title="Giá tiền cho công việc (Giá cuối cùng thỏa thuận)"
                    containerStyle={{ width: '100%' }}
                    message="Hãy trao đổi giá cả tiền công và vật tư với khách hàng trước khi nhập."
                    keyboardType="numeric"
                    value={price ? price.toLocaleString('vi-VN') : ''}
                    onChangeText={(txt) => {
                        const numeric = txt.replace(/\D/g, '')
                        setPrice(numeric ? parseInt(numeric, 10) : 0)
                    }}
                />

                <Spacer height={20} />

                <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
                    Tình trạng trước (Tối đa 5 ảnh)
                </Text>
                <View style={styles.imagesWrapper}>
                    {images.map((img, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setImageIndex(index)
                                setIsImageViewVisible(true)
                            }}
                        >
                            <FastImage
                                source={{ uri: img }}
                                style={styles.imageBox}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() =>
                                    setImages((prev) => prev.filter((_, i) => i !== index))
                                }
                            >
                                <Text style={styles.deleteText}>×</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}

                    {images.length < 5 && (
                        <TouchableOpacity
                            style={[styles.imageBox, styles.addBox]}
                            onPress={() => setShowCameraOption(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={DefaultStyles.textMedium12Black}>Thêm ảnh</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ⚠️ Hiển thị cảnh báo nếu thiếu thông tin */}
                {!isFormValid && (
                    <View style={styles.warningBox}>
                        <Text style={styles.warningText}>
                            ⚠️ Vui lòng điền đầy đủ: {!images.length && '• Ảnh tình trạng '}
                            {!price && '• Giá tiền '}
                            {!description.trim() && '• Mô tả vấn đề'}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View
                style={{
                    borderTopWidth: 1,
                    borderColor: Colors.border01,
                    flexDirection: 'row',
                    marginHorizontal: 10,
                }}
            >
                <Spacer height={10} />
                <Button
                    title="Sửa Thất Bại"
                    containerStyle={{ width: '48%' }}
                    color={Colors.red30}
                    onPress={() => {
                        setIsModalVisible(true)
                    }}
                />
                <Spacer height={10} />
                <Button
                    title="Tiếp tục"
                    containerStyle={{ width: '48%' }}
                    color={isFormValid ? Colors.primary0 : Colors.gray72} // ✅ Đổi màu khi disable
                    disable={!isFormValid} // ✅ Disable nếu chưa đủ thông tin
                    onPress={() => {
                        if (!isFormValid) return // ✅ Không cho nhấn nếu chưa valid

                        GlobalModalController.onActionChange((value: boolean) => {
                            if (value) handleConfirm()
                            else GlobalModalController.hideModal()
                        })
                        GlobalModalController.showModal({
                            title: 'Xác nhận kiểm tra lần cuối?',
                            description:
                                'Hãy chắc chắn rằng bạn đã kiểm tra kỹ tình trạng công việc của khách hàng trước khi bắt đầu công việc.',
                            type: 'yesNo',
                            icon: 'warning',
                        })
                    }}
                />
            </View>

            <CustomModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                configHeight={0.75}
            >
                <ScrollView style={{ flex: 1 }}>
                    <Input
                        area
                        title="Vui lòng nhập lí do"
                        onChangeText={(text: any) => {
                            setReason(text)
                        }}
                        value={reason}
                    />
                </ScrollView>
                <Button
                    title="Xác nhận thất bại"
                    onPress={() => {
                        handleCancelAppointment()
                    }}
                />
            </CustomModal>
            <PhotoOptionsPicker
                isVisible={showCameraOption}
                onSelectPhoto={(image) => {
                    handleUploadPhoto(image)
                    setShowCameraOption(false)
                }}
                onClose={() => setShowCameraOption(false)}
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <LoadingWaitingApproveView
                        loading={loading}
                        text="Chờ khách hàng xác nhận trạng thái"
                        onCancel={() => {
                            console.log('Người dùng nhấn Hủy')
                            setLoading(false)
                        }}
                        onConfirm={() => {
                            console.log('Người dùng nhấn Xác nhận')
                            handleConfirm()
                        }}
                    />
                </View>
            )}

            <ImageViewing
                images={imagesForGallery.map((uri: any) => ({ uri }))}
                imageIndex={imageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
                HeaderComponent={({ imageIndex }) => (
                    <View style={styles.headerIndicator}>
                        <Text style={styles.indicatorText}>
                            {imageIndex + 1} / {imagesForGallery.length}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default AppointmentInProgress2View

const styles = StyleSheet.create({
    imagesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageBox: {
        width: 100,
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border01,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    capturedImage: {
        width: '100%',
        height: '100%',
    },
    addBox: {
        backgroundColor: Colors.whiteAE,
    },
    image: {
        width: 36,
        height: 36,
        marginBottom: 4,
    },
    deleteBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    headerIndicator: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    indicatorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // ✅ Style cho warning box
    warningBox: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#FFF3CD',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFC107',
    },
    warningText: {
        color: '#856404',
        fontSize: 13,
        lineHeight: 18,
    },
})
