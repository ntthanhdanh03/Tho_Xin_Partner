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
        console.log('appointmentData', appointmentData)
        // const postData = {
        //     status: 3,
        //     agreedPrice: price,

        //     beforeImages: {
        //         images: images,
        //         note: description,
        //     },
        // }
        // const typeUpdate = 'APPOINTMENT_UPDATE_IN_PROGRESS'
        // const dataUpdate = {
        //     id: appointmentData.appointmentInProgress[0]._id,
        //     typeUpdate,
        //     postData,
        // }
        // console.log('dataUpdate', dataUpdate)
        // dispatch(
        //     updateAppointmentAction(dataUpdate, (data: any) => {
        //         if (data) {
        //             navigation.navigate(...(['AppointmentInProgress3View'] as never))
        //         }
        //     }),
        // )
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Thanh toán" />
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
