import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'
import Spacer from '../components/Spacer'
import { scaleModerate } from '../../styles/scaleDimensions'
import Button from '../components/Button'
import FastImage from 'react-native-fast-image'
import { ic_balence, ic_calendar } from '../../assets'
import Input from '../components/Input'
import DateSelection from '../components/DateSelection'
import Selection from '../components/Selection'
import { GENDER } from '../../constants/Constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserAction, updateUserKYCAction } from '../../store/actions/authAction'

interface CapturedPhoto {
    uri: string
    width: number
    height: number
}

interface CapturedImages {
    front: CapturedPhoto | null
    back: CapturedPhoto | null
}

const IdentityChipView: React.FC = () => {
    const navigation = useNavigation<any>()
    const dispatch = useDispatch()
    const route = useRoute<any>()
    const { data, storageKey, auth } = route.params || {}
    const { data: authData } = useSelector((store: any) => store.auth)
    const [fullName, setFullName] = useState('')
    const [idCard, setIdCard] = useState('')
    const [password, setPassword] = useState('')
    const [dob, setDob] = useState()
    const [issuedDate, setIssuedDate] = useState()
    const [gender, setGender] = useState('')
    const [capturedImages, setCapturedImages] = useState<CapturedImages>({
        front: null,
        back: null,
    })
    const KYC_USER_DATA = authData?.user?.partner?.kyc

    useEffect(() => {
        if (data) {
            setFullName(data.fullName || '')
            setIdCard(data.idCard || '')
            setPassword(data.password || '')
            setDob(data.dob)
            setIssuedDate(data.issuedDate)
            setGender(data.gender || '')
            setCapturedImages(data.capturedImages || { front: null, back: null })
            console.log('Loaded identity data from params:', data)
        } else if (auth) {
            console.log('Loaded identity data from KYC_USER_DATA:', KYC_USER_DATA)
            setFullName(authData?.user?.fullName || '')
            setIdCard(KYC_USER_DATA?.idCardNumber || '')
            setIssuedDate(KYC_USER_DATA?.idCardExpirationDate || '')
            setDob(authData?.user?.dateOfBirth || '')
            setGender(authData?.user?.gender || '')
            setCapturedImages({
                front: KYC_USER_DATA?.idCardFrontImageUrl
                    ? ({ uri: KYC_USER_DATA.idCardFrontImageUrl } as CapturedPhoto)
                    : null,
                back: KYC_USER_DATA?.idCardBackImageUrl
                    ? ({ uri: KYC_USER_DATA.idCardBackImageUrl } as CapturedPhoto)
                    : null,
            })
        }
    }, [data])

    const handleCameraPress = (type: 'front' | 'back', label: string) => {
        navigation.navigate('CCCDCameraScreen', {
            type: type,
            title: label,
            onCapture: (photo: CapturedPhoto) => {
                setCapturedImages((prev) => ({
                    ...prev,
                    [type]: photo,
                }))
            },
        })
    }

    const handleSave = async () => {
        if (data) {
            const identityData = {
                fullName,
                idCard,
                password,
                dob,
                issuedDate,
                gender,
                capturedImages,
            }

            try {
                // Load current data from storage
                const json = await AsyncStorage.getItem(storageKey)
                const currentData = json
                    ? JSON.parse(json)
                    : {
                          identity: {},
                          judicial: {},
                          owner: {},
                      }

                // Update identity data
                const updatedData = {
                    ...currentData,
                    identity: identityData,
                }

                // Save back to storage
                await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData))
                console.log('Saved identity data:', identityData)
            } catch (e) {
                console.error('Error saving identity data:', e)
            }
        } else if (auth) {
            dispatch(
                updateUserAction(
                    {
                        id: authData?.user?._id,
                        updateData: {
                            fullName: fullName,
                            dateOfBirth: dob,
                            gender: gender,
                        },
                    },
                    (data: any, error: any) => {
                        if (data) {
                            console.log('Cập nhật thông tin cá nhân thành công:', data)
                        }
                    },
                ),
            )

            dispatch(
                updateUserKYCAction(
                    {
                        id: authData?.user?.partner?.kyc?._id,
                        updateData: {
                            idCardNumber: idCard,
                            idCardFrontImageUrl: capturedImages.front?.uri,
                            idCardBackImageUrl: capturedImages.back?.uri,
                            idCardExpirationDate: issuedDate,
                            approved: 'WAITING',
                        },
                    },
                    async (data: any, error: any) => {
                        if (data) {
                        }
                    },
                ),
            )
        }
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header isBack title="CCCD gắn chip" />
            <Spacer height={2} />
            <ScrollView>
                <View style={DefaultStyles.wrapBody}>
                    <Text style={DefaultStyles.textBold12Black}>THÔNG TIN CƠ BẢN</Text>
                    <Spacer height={10} />
                    <Input title="HỌ VÀ TÊN" value={fullName} onChangeText={setFullName} />
                    <Spacer height={16} />
                    <Input
                        title="CCCD GẮN CHIP / CCCD / CMND"
                        value={idCard}
                        onChangeText={setIdCard}
                    />
                    <Spacer height={16} />
                    <DateSelection
                        dob="yes"
                        title="Ngày cấp"
                        date={
                            issuedDate && moment(issuedDate).isValid()
                                ? moment(issuedDate).toDate()
                                : ''
                        }
                        onDateChange={(date: any) => setIssuedDate(date)}
                    />
                    <Spacer height={16} />
                    <DateSelection
                        dob="yes"
                        title="Ngày sinh"
                        date={dob && moment(dob).isValid() ? moment(dob).toDate() : ''}
                        onDateChange={(date: any) => setDob(date)}
                    />
                    <Spacer height={16} />
                    <Selection
                        title="Giới tính"
                        data={GENDER}
                        keyValue={gender}
                        onSelect={(item: any) => setGender(item.key)}
                    />
                </View>
                <Spacer height={10} />
                <View style={{ backgroundColor: Colors.yellow00 }}>
                    <View
                        style={{
                            marginHorizontal: scaleModerate(16),
                            paddingVertical: scaleModerate(10),
                        }}
                    >
                        <Text style={DefaultStyles.textMedium13Black}>
                            Giấy tờ phải chụp 4 góc và rõ nét
                        </Text>
                        <Spacer height={6} />
                        <Text style={DefaultStyles.textMedium13Black}>
                            Hình ảnh bắt buộc phải xoay ngang
                        </Text>
                    </View>
                </View>
                <Spacer height={8} />
                <View style={DefaultStyles.wrapBody}>
                    <View>
                        {[
                            {
                                image: ic_calendar,
                                label: 'Chụp mặt trước',
                                type: 'front' as const,
                                captured: capturedImages.front,
                            },
                            {
                                image: ic_balence,
                                label: 'Chụp mặt sau',
                                type: 'back' as const,
                                captured: capturedImages.back,
                            },
                        ].map((item, index) => (
                            <React.Fragment key={index}>
                                <TouchableOpacity
                                    style={[
                                        styles.imageBox,
                                        item.captured && styles.imageBoxCaptured,
                                    ]}
                                    onPress={() => handleCameraPress(item.type, item.label)}
                                    activeOpacity={0.7}
                                >
                                    {item.captured ? (
                                        <>
                                            <FastImage
                                                source={{ uri: item.captured.uri }}
                                                style={styles.capturedImage}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                            <View style={styles.capturedOverlay}>
                                                <Text style={styles.recaptureText}>
                                                    ✓ Đã chụp - Nhấn để chụp lại
                                                </Text>
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <FastImage
                                                source={item.image}
                                                style={styles.image}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                            <Text
                                                style={[
                                                    DefaultStyles.textBold14Black,
                                                    { color: Colors.purple8D },
                                                ]}
                                            >
                                                {item.label}
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                {index === 0 && <Spacer height={8} />}
                            </React.Fragment>
                        ))}
                    </View>
                    <Spacer height={10} />
                    <Button title="Lưu" onPress={handleSave} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default IdentityChipView

const styles = StyleSheet.create({
    imageBox: {
        width: '100%',
        height: scaleModerate(170),
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
    recaptureText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
})
