import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
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
import { updateAppointmentAction } from '../../store/actions/appointmentAction'
import LoadingWaitingApproveView from '../components/LoadingWaitingApproveView'
import ImageViewing from 'react-native-image-viewing'
import Button from '../components/Button'
import CustomModal from '../home/CustomModal'

const AppointmentInProgress2View = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { data: appointmentData } = useSelector((store: any) => store.appointment)

    const APPOINTMENT_UPDATE_IN_PROGRESS = appointmentData?.appointmentInProgress?.[0]

    const [description, setDescription] = useState<string>('')
    const [price, setPrice] = useState<number>(0)
    const [images, setImages] = useState<string[]>([])
    const [showCameraOption, setShowCameraOption] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)

    const [isImageViewVisible, setIsImageViewVisible] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)

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
                    value={price ? `${price}` : ''}
                    onChangeText={(txt: any) => {
                        setPrice(txt)
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
                            <FastImage
                                source={ic_balence}
                                style={styles.image}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text style={DefaultStyles.textMedium12Black}>Thêm ảnh</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
                    containerStyle={{ width: '50%' }}
                    color={Colors.red30}
                    onPress={() => {
                        setIsModalVisible(true)
                    }}
                />
                <Spacer height={16} />
                <Button
                    title="Tiếp tục"
                    containerStyle={{ width: '50%' }}
                    color={Colors.primary0}
                    onPress={() => {
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
                    <Input area title="Vui lòng nhập lí do" />
                </ScrollView>
                <Button title="Xác nhận thất bại" />
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
})
