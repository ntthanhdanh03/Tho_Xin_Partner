import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'
import { scaleModerate } from '../../styles/scaleDimensions'
import PhotoOptionsPicker from '../components/PhotoOptionsPicker'
import FastImage from 'react-native-fast-image'
import { ic_balence } from '../../assets'
import DateSelection from '../components/DateSelection'
import Spacer from '../components/Spacer'
import { uploadKycPhoto } from '../../services/uploadKycPhoto '
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserAction } from '../../store/actions/authAction'

const UploadAvatarView = () => {
    const route = useRoute<any>()
    const dispatch = useDispatch()
    const { data, storageKey, auth, firstLogin } = route.params || {}
    const { data: authData } = useSelector((store: any) => store.auth)
    const [showCameraOption, setShowCameraOption] = useState(false)
    const [avtImage, setAvtImage] = useState('')

    useEffect(() => {
        if (data) {
            setAvtImage(data.avtImage || '')
            console.log('Loaded owner verification data from params:', data)
        } else if (auth) {
            setAvtImage(authData?.user?.avatarUrl || '')
        }
    }, [data])

    const handleUploadAvatar = async (image: any) => {
        const uploadedImage = await uploadKycPhoto(image, 'avatarImageUrl')
        if (uploadedImage?.url) {
            console.log('Uploaded Owner Verification URL:', uploadedImage.url)
            setAvtImage(uploadedImage.url)
        }
    }

    const handleSave = async () => {
        if (firstLogin === 'true') {
            const avtImageData = {
                avtImage,
            }
            try {
                const json = await AsyncStorage.getItem(storageKey)
                const currentData = json
                    ? JSON.parse(json)
                    : {
                          avatarUrl: {},
                      }
                // Update owner data
                const updatedData = {
                    ...currentData,
                    avatar: avtImageData,
                }

                await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData))
                console.log('Saved owner verification data:', avtImageData)
            } catch (e) {
                console.error('Error saving owner verification data:', e)
            }
        } else if (auth) {
            dispatch(
                updateUserAction(
                    {
                        id: authData?.user?._id,
                        updateData: {
                            avatarUrl: avtImage,
                        },
                    },
                    (data: any, error: any) => {
                        if (data) {
                            console.log('Cập nhật thông tin cá nhân thành công:', data)
                        }
                    },
                ),
            )
        }
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header isBack title="Ảnh đại diện" />
            <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                    <Text style={DefaultStyles.textBold12Black}>HÌNH ẢNH</Text>
                    <Spacer height={10} />
                </View>
                <View style={{ backgroundColor: Colors.blue8C }}>
                    <View
                        style={{
                            marginHorizontal: scaleModerate(16),
                            paddingVertical: scaleModerate(10),
                        }}
                    >
                        <Text style={DefaultStyles.textMedium13Black}>- Chụp chính diện</Text>
                        <Spacer height={6} />
                        <Text style={DefaultStyles.textMedium13Black}>
                            - Phông trơn, không cản vật
                        </Text>
                    </View>
                </View>
                <Spacer height={20} />
                <TouchableOpacity
                    style={[styles.imageBox, avtImage && styles.imageBoxCaptured]}
                    onPress={() => setShowCameraOption(true)}
                    activeOpacity={0.7}
                >
                    {avtImage ? (
                        <>
                            <FastImage
                                source={{ uri: avtImage }}
                                style={styles.capturedImage}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View style={styles.capturedOverlay}>
                                <Text style={{ ...DefaultStyles.textMedium14White }}>
                                    ✓ Đã chụp - Nhấn để chụp lại
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <FastImage
                                source={ic_balence}
                                style={styles.image}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </>
                    )}
                </TouchableOpacity>
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

export default UploadAvatarView

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
