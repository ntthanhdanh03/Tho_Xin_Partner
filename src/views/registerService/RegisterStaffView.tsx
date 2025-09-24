import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import Header from '../components/Header'
import ItemDocumentRequirement from './components/itemDocumentRequirement'
import { REQUIRED_DOCUMENTS } from '../../constants/Constants'
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { updateUserAction, updateUserKYCAction } from '../../store/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import LoadingView from '../components/LoadingView'

const STORAGE_KEY = 'KYC_PARTNER_REGISTRATION'

const RegisterStaffView = () => {
    const navigation = useNavigation<any>()
    const dispatch = useDispatch()
    const { data: authData } = useSelector((store: any) => store.auth)
    const [isLoading, setLoading] = useState(false)
    const [registrationData, setRegistrationData] = useState({
        identity: {
            fullName: '',
            idCard: '',
            password: '',
            dob: null,
            issuedDate: null,
            gender: '',
            capturedImages: {
                front: null,
                back: null,
            },
        },
        judicial: {
            issuedDate: null,
            judicialRecord: '',
        },
        owner: {
            judicialRecord: '',
        },
        avatar: {
            avatarUrl: '',
        },
        field: {
            field: '',
        },
    })

    useFocusEffect(
        React.useCallback(() => {
            const loadRegistrationData = async () => {
                try {
                    const json = await AsyncStorage.getItem(STORAGE_KEY)
                    if (json) {
                        const data = JSON.parse(json)
                        setRegistrationData(data)
                        console.log('Loaded registration data:', data)
                    }
                } catch (e) {
                    console.error('Error loading registration data:', e)
                }
            }
            loadRegistrationData()
        }, []),
    )

    const handleNavigateToDocument = (doc: any) => {
        let params = {}

        switch (doc.id) {
            case 'identity_chip':
                params = {
                    data: registrationData.identity,
                    storageKey: STORAGE_KEY,
                    firstLogin: 'true',
                }
                break
            case 'judicial_record':
                params = {
                    data: registrationData.judicial,
                    storageKey: STORAGE_KEY,
                    firstLogin: 'true',
                }
                break
            case 'owner_verification':
                params = {
                    data: registrationData.owner,
                    storageKey: STORAGE_KEY,
                    firstLogin: 'true',
                }
                break
            case 'avt_view':
                params = {
                    data: registrationData.avatar,
                    storageKey: STORAGE_KEY,
                    firstLogin: 'true',
                }
                break
            case 'chose_field_view':
                params = {
                    data: registrationData.field,
                    storageKey: STORAGE_KEY,
                    firstLogin: 'true',
                }
                break
        }
        navigation.navigate(doc.navigationTo, params)
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY)
            const finalData = json ? JSON.parse(json) : registrationData

            dispatch(
                updateUserAction(
                    {
                        id: authData?.user?._id,
                        updateData: {
                            fullName: finalData.identity.fullName,
                            dateOfBirth: finalData.identity.dob,
                            gender: finalData.identity.gender,
                            avatarUrl: finalData.avatar.avtImage,
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
                            idCardNumber: finalData.identity.idCard,
                            idCardFrontImageUrl: finalData.identity.capturedImages.front?.uri,
                            idCardBackImageUrl: finalData.identity.capturedImages.back?.uri,
                            criminalRecordImageUrl: finalData.judicial.judicialRecord,
                            registeredSimImageUrl: finalData.owner.judicialRecord,
                            idCardExpirationDate: finalData.identity.issuedDate,
                            approved: 'WAITING',
                            choseField: finalData.field.choseField.map((item: any) => item.key),
                        },
                    },
                    async (data: any, error: any) => {
                        if (data) {
                            // await AsyncStorage.removeItem(STORAGE_KEY)
                            setLoading(false)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'BottomTab' }],
                            })
                        }
                    },
                ),
            )
        } catch (e) {
            console.error('Error submitting registration:', e)
        }
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Đăng ký trở thành đối tác" />
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: Colors.blueB9 }}>
                    <Text
                        style={[
                            DefaultStyles.textMedium14White,
                            {
                                color: Colors.black01,
                                marginHorizontal: scaleModerate(16),
                                paddingVertical: scaleModerate(10),
                            },
                        ]}
                    >
                        Để tiết kiệm thời gian duyệt hồ sơ. Quý đối tác hãy chuẩn bị trước những
                        loại giấy tờ sau
                    </Text>
                </View>
                <View>
                    {REQUIRED_DOCUMENTS.map((doc, index) => (
                        <ItemDocumentRequirement
                            key={doc.id}
                            label={doc.label}
                            navigationTo={doc.navigationTo}
                            index={index}
                            onPress={() => handleNavigateToDocument(doc)}
                        />
                    ))}
                </View>
            </View>
            <View style={{ padding: scaleModerate(16) }}>
                <Button title="Gửi hồ sơ" onPress={handleSubmit} />
            </View>
            <LoadingView loading={isLoading} />
        </SafeAreaView>
    )
}

export default RegisterStaffView

const styles = StyleSheet.create({})
