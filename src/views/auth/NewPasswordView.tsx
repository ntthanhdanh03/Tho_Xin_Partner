import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Spacer from '../components/Spacer'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import { OtpInput } from 'react-native-otp-entry'
import Header from '../components/Header'
import { useDispatch } from 'react-redux'
import { partnerRegisterAction } from '../../store/actions/authAction'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'

const NewPasswordView = ({ route }: any) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { phoneNumber } = route.params
    const [password, setPassword] = useState('')
    const [hidePassword, setHidePassword] = useState(true)

    // Check if password has 6 digits
    const isPasswordValid = password.length === 6

    const handlePartnerRegister = () => {
        // Validate password before calling API
        if (!isPasswordValid) {
            return
        }

        const postData = {
            phoneNumber: phoneNumber,
            password: password,
            role: 'partner',
        }
        console.log(postData)
        dispatch(
            partnerRegisterAction(postData, (data: any, error: any) => {
                if (data && data.success === true) {
                    GlobalModalController.showModal({
                        title: 'Đăng ký thành công',
                        description: data.message,
                        icon: 'success',
                    })
                    GlobalModalController.onActionChange(() => {
                        navigation.navigate('LoginView' as never)
                    })
                } else {
                    GlobalModalController.showModal({
                        title: 'Thất bại',
                        description: error || 'Đăng ký không thành công',
                        icon: 'fail',
                    })
                }
            }),
        )
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header isBack />
            <View style={[DefaultStyles.wrapBody, { flex: 1 }]}>
                <Text style={[DefaultStyles.textBold22Black, { fontSize: 26 }]}>
                    {'Tạo mật khẩu'}
                </Text>
                <Spacer height={8} />
                <Text style={[DefaultStyles.textRegular14Black, { color: Colors.gray44 }]}>
                    {'Mật khẩu phải có 6 chữ số'}
                </Text>
                <Spacer height={16} />
                <View style={{ paddingRight: scaleModerate(40) }}>
                    <OtpInput
                        autoFocus
                        secureTextEntry={hidePassword}
                        numberOfDigits={6}
                        onTextChange={(text) => setPassword(text)}
                        theme={{
                            focusStickStyle: {
                                backgroundColor: Colors.primary,
                            },
                            focusedPinCodeContainerStyle: {
                                borderColor: Colors.primary,
                                borderWidth: 1,
                            },
                            filledPinCodeContainerStyle: {
                                borderColor: Colors.green34,
                                borderWidth: 1,
                            },
                            pinCodeTextStyle: {
                                ...DefaultStyles.textRegular16Black,
                                fontSize: 32,
                            },
                            pinCodeContainerStyle: {
                                height: scaleModerate(42),
                                width: scaleModerate(42),
                            },
                        }}
                    />
                </View>
                <Spacer height={20} />
                <Text
                    style={[DefaultStyles.textBold14Black, { color: Colors.blue11 }]}
                    onPress={() => setHidePassword(!hidePassword)}
                >
                    {hidePassword ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'}
                </Text>
            </View>
            <View style={{ marginHorizontal: scaleModerate(16) }}>
                <Spacer height={16} />
                <Button
                    isColor
                    title={'Xác nhận'}
                    onPress={handlePartnerRegister}
                    disable={!isPasswordValid}
                />
                <Spacer height={20} />
            </View>
        </SafeAreaView>
    )
}

export default NewPasswordView

const styles = StyleSheet.create({
    signUp: {
        ...DefaultStyles.textRegular16Black,
        color: Colors.primary300,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
})
