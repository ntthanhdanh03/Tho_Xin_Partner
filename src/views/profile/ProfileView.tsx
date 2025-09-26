import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Spacer from '../components/Spacer'
import { DefaultStyles } from '../../styles/DefaultStyles'
import {
    ic_balence,
    img_default_avatar,
    // ic_alert_circle,
    // ic_camera,
    // ic_chevron_right,
    // ic_close_circle,
    // ic_keyChange,
    // ic_log_out,
    // ic_profile_circle,
    // ic_question_mark,
    // ic_shield,
    //img_default_avatar,
} from '../../assets'
import FastImage from 'react-native-fast-image'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import LanguageView from '../components/LanguageView'
import { useNavigation } from '@react-navigation/native'
import PhotoOptionsPicker from '../components/PhotoOptionsPicker'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import VersionCheck from 'react-native-version-check'
import { SafeAreaView } from 'react-native-safe-area-context'
import { deleteInstallationAction, logoutAction } from '../../store/actions/authAction'

const ProfileView = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { data: authData } = useSelector((store: any) => store.auth)
    const navigation = useNavigation()
    const currentVersion = VersionCheck.getCurrentVersion()
    const handlePressLogout = async () => {
        if (authData?.user?.deviceToken?.token) {
            dispatch(
                deleteInstallationAction({
                    userId: authData?.user?._id,
                    token: authData?.user?.deviceToken?.token,
                }),
            )
        }
        dispatch(logoutAction())
    }

    return (
        <SafeAreaView style={DefaultStyles.container} edges={['top']}>
            <Header
                title={t('Thông tin cá nhân')}
                renderRight={() => (
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.border01,
                            borderRadius: 25,
                        }}
                    >
                        <LanguageView />
                    </View>
                )}
            />

            <ScrollView style={[DefaultStyles.wrapBody, { flex: 1 }]}>
                <View style={{ alignItems: 'center' }}>
                    <Spacer height={5} />

                    <FastImage
                        source={
                            authData?.user?.avatarUrl
                                ? { uri: authData?.user?.avatarUrl }
                                : img_default_avatar
                        }
                        style={{
                            height: scaleModerate(80),
                            width: scaleModerate(80),
                            borderRadius: 40,
                        }}
                    />

                    {authData && (
                        <Text style={{ ...DefaultStyles.textRegular20Black }}>
                            {authData?.user?.fullName}
                        </Text>
                    )}

                    <Text style={{ ...DefaultStyles.textRegular16Black, color: '#344054' }}>
                        {authData?.user?.phoneNumber}
                    </Text>
                    <Spacer height={10} />
                </View>
                <View>
                    {authData && (
                        <View>
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => {
                                    console.log(authData)
                                    //   navigation.navigate('PersonalInformationView' as never)
                                }}
                            >
                                <View style={[styles.iconRow, { backgroundColor: Colors.whiteE5 }]}>
                                    <FastImage source={ic_balence} style={styles.icon} />
                                </View>
                                <Text style={styles.text}>{t('Thông tin cá nhân')}</Text>
                                <FastImage source={ic_balence} style={styles.rightIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => {
                                    navigation.navigate('ChangePasswordView' as never)
                                }}
                            >
                                <View style={[styles.iconRow, { backgroundColor: Colors.whiteE5 }]}>
                                    <FastImage source={ic_balence} style={styles.icon} />
                                </View>
                                <Text style={styles.text}>{t('Đổi mật khẩu')}</Text>
                                <FastImage source={ic_balence} style={styles.rightIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => {
                                    navigation.navigate('TransactionHistoryView' as never)
                                }}
                            >
                                <View style={[styles.iconRow, { backgroundColor: Colors.whiteE5 }]}>
                                    <FastImage source={ic_balence} style={styles.icon} />
                                </View>
                                <Text style={styles.text}>{t('Đánh giá từ khách hàng')}</Text>
                                <FastImage source={ic_balence} style={styles.rightIcon} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => {
                                    navigation.navigate('TransactionHistoryView' as never)
                                }}
                            >
                                <View style={[styles.iconRow, { backgroundColor: Colors.whiteE5 }]}>
                                    <FastImage source={ic_balence} style={styles.icon} />
                                </View>
                                <Text style={styles.text}>{t('Lịch sử')}</Text>
                                <FastImage source={ic_balence} style={styles.rightIcon} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity style={styles.row} onPress={handlePressLogout}>
                        <View style={[styles.iconRow, { backgroundColor: Colors.whiteE5 }]}>
                            <FastImage
                                source={ic_balence}
                                style={{ height: scaleModerate(16), width: scaleModerate(16) }}
                            />
                        </View>
                        <Text style={styles.text}>{t('Đăng xuất')}</Text>
                        <FastImage source={ic_balence} style={styles.rightIcon} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Text
                style={[DefaultStyles.textRegular13Gray, { textAlign: 'center' }]}
            >{`v${currentVersion}`}</Text>
        </SafeAreaView>
    )
}

export default ProfileView

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleModerate(10),
    },
    iconRow: {
        height: scaleModerate(30),
        width: scaleModerate(30),
        borderRadius: scaleModerate(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: scaleModerate(18),
        width: scaleModerate(18),
    },
    rightIcon: {
        height: scaleModerate(24),
        width: scaleModerate(24),
    },
    text: {
        flex: 1,
        marginLeft: scaleModerate(10),
        ...DefaultStyles.textRegular14Black,
    },
    camera: {
        backgroundColor: Colors.blue11,
        position: 'absolute',
        bottom: 0,
        right: -5,
    },
})
