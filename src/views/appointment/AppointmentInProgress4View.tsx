import { useNavigation, useRoute } from '@react-navigation/native'
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

const AppointmentInProgress4View = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const route = useRoute<any>()
    const { dataAppointment } = route.params || {}
    const { data: appointmentData } = useSelector((store: any) => store.appointment)

    const [description, setDescription] = useState<string>('')
    const [price, setPrice] = useState<number>(0)
    const [images, setImages] = useState<string[]>([])
    const [showCameraOption, setShowCameraOption] = useState(false)

    const handleUploadPhoto = async (image: any) => {
        const uploadedImage = await uploadKycPhoto(image, 'imageService')
        if (uploadedImage?.url) {
            setImages((prev) => [...prev, uploadedImage.url])
        }
    }

    const handleConfirm = async () => {
        const postData = {
            status: 5,
            agreedPrice: price,
            afterImages: {
                images: images,
                note: description,
            },
        }
        const typeUpdate = 'APPOINTMENT_UPDATE_IN_PROGRESS'
        const dataUpdate = {
            id: appointmentData.appointmentInProgress[0]._id,
            typeUpdate,
            postData,
        }
        console.log('dataUpdate', dataUpdate)
        dispatch(
            updateAppointmentAction(dataUpdate, (data: any) => {
                if (data) {
                    navigation.navigate(...(['AppointmentInProgress5View'] as never))
                }
            }),
        )
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Bàn giao" />

            <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
                <Spacer height={10} />

                <Input
                    title="Mô tả vấn đề của Khách"
                    area
                    value={description}
                    onChangeText={setDescription}
                />
                <Spacer height={10} />

                <Spacer height={20} />

                <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
                    Tình trạng trước (Tối đa 5 ảnh)
                </Text>
                <View style={styles.imagesWrapper}>
                    {images?.map((img, index) => (
                        <View key={index} style={styles.imageBox}>
                            <FastImage
                                source={{ uri: img }}
                                style={styles.capturedImage}
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
                        </View>
                    ))}

                    {images?.length < 5 && (
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

            <View style={{ borderTopWidth: 1, borderColor: Colors.border01 }}>
                <Spacer height={10} />
                <SwipeButton
                    containerStyles={{
                        borderRadius: 8,
                        overflow: 'hidden',
                        marginHorizontal: 16,
                        marginBottom: 10,
                    }}
                    railBackgroundColor={Colors.whiteAE}
                    railFillBackgroundColor={'rgba(0,0,0,0.4)'}
                    railBorderColor={Colors.gray72}
                    railFillBorderColor={Colors.whiteAE}
                    railStyles={{ borderRadius: 8 }}
                    thumbIconBorderColor="transparent"
                    thumbIconBackgroundColor={Colors.gray44}
                    thumbIconStyles={{ borderRadius: 4, width: 40, height: 40 }}
                    title="Hoàn thành kiểm tra "
                    titleStyles={{ ...DefaultStyles.textBold16Black }}
                    titleColor={Colors.black01}
                    onSwipeSuccess={() => {
                        GlobalModalController.onActionChange((value: boolean) => {
                            if (value) {
                                handleConfirm()
                            } else {
                                GlobalModalController.hideModal()
                            }
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

            <PhotoOptionsPicker
                isVisible={showCameraOption}
                onSelectPhoto={(image) => {
                    handleUploadPhoto(image)
                    setShowCameraOption(false)
                }}
                onClose={() => setShowCameraOption(false)}
            />
        </SafeAreaView>
    )
}

export default AppointmentInProgress4View

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
})
