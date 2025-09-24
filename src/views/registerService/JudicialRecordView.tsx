import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'
import PhotoOptionsPicker from '../components/PhotoOptionsPicker'
import FastImage from 'react-native-fast-image'
import { scaleModerate } from '../../styles/scaleDimensions'
import { ic_balence } from '../../assets'
import { uploadKycPhoto } from '../../services/uploadKycPhoto '
import Button from '../components/Button'
import DateSelection from '../components/DateSelection'
import Spacer from '../components/Spacer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserKYCAction } from '../../store/actions/authAction'

const JudicialRecordView = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const route = useRoute<any>()
    const { data, storageKey, auth } = route.params || {}
    const { data: authData } = useSelector((store: any) => store.auth)
    const [showCameraOption, setShowCameraOption] = useState(false)
    const [judicialRecord, setJudicialRecord] = useState('')
    const [issuedDate, setIssuedDate] = useState()
    const KYC_USER_DATA = authData?.user?.partner?.kyc
    useEffect(() => {
        if (data) {
            setJudicialRecord(data.judicialRecord || '')
            setIssuedDate(data.issuedDate)
            console.log('Loaded judicial record data from params:', data)
        } else if (auth) {
            setJudicialRecord(KYC_USER_DATA.criminalRecordImageUrl || '')
        }
    }, [data])

    const handleUploadAvatar = async (image: any) => {
        const uploadedImage = await uploadKycPhoto(image, 'criminalRecordImageUrl')
        if (uploadedImage?.url) {
            console.log('Uploaded Judicial Record URL:', uploadedImage.url)
            setJudicialRecord(uploadedImage.url)
        }
    }

    const handleSave = async () => {
        if (data) {
            const judicialData = {
                issuedDate,
                judicialRecord,
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

                // Update judicial data
                const updatedData = {
                    ...currentData,
                    judicial: judicialData,
                }

                // Save back to storage
                await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData))
                console.log('Saved judicial record data:', judicialData)
            } catch (e) {
                console.error('Error saving judicial record data:', e)
            }
        } else if (auth) {
            console.log('!@#$%')
            dispatch(
                updateUserKYCAction(
                    {
                        id: authData?.user?.partner?.kyc?._id,
                        updateData: {
                            criminalRecordImageUrl: judicialRecord,
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
            <Header isBack title="Lý lịch tư pháp" />
            <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                    <Text style={DefaultStyles.textBold12Black}>HÌNH ẢNH</Text>
                    <Spacer height={10} />
                    {/* <DateSelection
                        dob="yes"
                        title="Ngày cấp"
                        date={
                            issuedDate && moment(issuedDate).isValid()
                                ? moment(issuedDate).toDate()
                                : ''
                        }
                        onDateChange={(date: any) => setIssuedDate(date)}
                    /> */}
                </View>

                <TouchableOpacity
                    style={[styles.imageBox, judicialRecord && styles.imageBoxCaptured]}
                    onPress={() => setShowCameraOption(true)}
                    activeOpacity={0.7}
                >
                    {judicialRecord ? (
                        <>
                            <FastImage
                                source={{ uri: judicialRecord }}
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

export default JudicialRecordView

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
