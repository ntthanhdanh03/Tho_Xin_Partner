import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'
import { scaleModerate } from '../../styles/scaleDimensions'
import PhotoOptionsPicker from '../components/PhotoOptionsPicker'
import Spacer from '../components/Spacer'
import { uploadKycPhoto } from '../../services/uploadKycPhoto '
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Selection from '../components/Selection'
import { FIELD, GENDER } from '../../constants/Constants'
import { useDispatch, useSelector } from 'react-redux'
import { at } from 'lodash'
import { updateUserKYCAction } from '../../store/actions/authAction'

const ChoseFieldView = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const route = useRoute<any>()
    const { data, storageKey, auth, firstLogin } = route.params || {}
    const { data: authData } = useSelector((store: any) => store.auth)
    const [showCameraOption, setShowCameraOption] = useState(false)
    const [choseField, setChoseField] = useState<string[]>([])
    const KYC_USER_DATA = authData?.user?.partner?.kyc

    useEffect(() => {
        if (data?.choseField) {
            const value = Array.isArray(data.choseField) ? data.choseField : [data.choseField]
            setChoseField(value)
        } else if (auth) {
            setChoseField(KYC_USER_DATA?.choseField || [])
        }
    }, [data])

    const handleUploadAvatar = async (image: any) => {
        const uploadedImage = await uploadKycPhoto(image, 'criminalRecordImageUrl')
        if (uploadedImage?.url) {
            console.log('Uploaded Owner Verification URL:', uploadedImage.url)
            setChoseField(uploadedImage.url)
        }
    }

    const handleSave = async () => {
        if (firstLogin === 'true') {
            try {
                const json = await AsyncStorage.getItem(storageKey)
                const currentData = json
                    ? JSON.parse(json)
                    : {
                          identity: {},
                          judicial: {},
                          owner: {},
                      }

                const updatedData = {
                    ...currentData,
                    field: { choseField },
                }

                await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData))
                console.log('Saved owner verification data:', choseField)
            } catch (e) {
                console.error('Error saving owner verification data:', e)
            }
        } else if (auth) {
            dispatch(
                updateUserKYCAction(
                    {
                        id: authData?.user?.partner?.kyc?._id,
                        updateData: {
                            choseField: choseField.map((item: any) => item.key),
                        },
                    },
                    (data: any, error: any) => {
                        if (data) {
                        }
                    },
                ),
            )
        }
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header isBack title="Chọn lĩnh vực của bạn" />
            <View style={{ backgroundColor: Colors.blueB9 }}>
                <View
                    style={{
                        marginHorizontal: scaleModerate(16),
                        paddingVertical: scaleModerate(10),
                    }}
                >
                    <Text style={DefaultStyles.textMedium13Black}>
                        - Điên (Sửa ổ cắm , bóng đèn , công tắc , lắp đặt thiết bị điện...)
                    </Text>
                    <Spacer height={6} />
                    <Text style={DefaultStyles.textMedium13Black}>
                        - Nước (Sửa ống nước , lắp đặt thiết bị vệ sinh , thông tắc cống...)
                    </Text>
                    <Text style={DefaultStyles.textMedium13Black}>
                        - Khóa (Sửa khóa , làm chìa khóa , lắp đặt khóa , mở khóa...)
                    </Text>
                    <Text style={DefaultStyles.textMedium13Black}>
                        - Điện lạnh (Sửa tủ lạnh , máy giặt , máy lạnh , lò vi sóng...)
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1, paddingTop: 20, marginHorizontal: 10 }}>
                <Selection
                    title="Chuyên môn"
                    data={FIELD}
                    multiple={true}
                    keyValues={auth ? choseField : choseField.map((item: any) => item.key)}
                    onSelect={(selectedItems: string[]) => {
                        setChoseField(selectedItems)
                        console.log('Selected fields:', selectedItems)
                    }}
                />
            </View>

            <Button title="Lưu" onPress={handleSave} containerStyle={{ paddingHorizontal: 10 }} />
            <PhotoOptionsPicker
                isVisible={showCameraOption}
                onSelectPhoto={(image) => {
                    handleUploadAvatar(image)
                }}
                onClose={() => {
                    setShowCameraOption(false)
                }}
            />
        </SafeAreaView>
    )
}

export default ChoseFieldView

const styles = StyleSheet.create({
    imageBox: {
        alignSelf: 'center',
        width: '80%',
        height: '60%',
        backgroundColor: Colors.grayF5,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.border01,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    imageBoxCaptured: {
        borderStyle: 'solid',
        borderColor: '#4CAF50',
        backgroundColor: 'transparent',
    },
    image: {
        width: scaleModerate(70),
        height: scaleModerate(70),
        borderRadius: 10,
    },
    capturedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 9,
    },
    capturedOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
    },
})
