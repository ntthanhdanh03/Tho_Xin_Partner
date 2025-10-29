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
import { loginAction } from '../../store/actions/authAction'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'

const LoginViewPW = ({ route }: any) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [password, setPassword] = useState('')
    const { phoneNumber } = route.params

    // Check if password has 6 digits
    const isPasswordValid = password.length === 6

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPasswordView' as never)
    }

    const handleLogin = () => {
        // Double check validation before calling API
        // if (!isPasswordValid) {
        //     return
        // }

        const postData = {
            phoneNumber: phoneNumber,
            password: password,
            role: 'partner',
        }
        dispatch(
            loginAction(postData, (data: any, error: any) => {
                if (data && data.token) {
                    // Login success - navigation will be handled by Redux/action
                } else {
                    GlobalModalController.showModal({
                        title: 'Đăng nhập thất bại',
                        description: error || 'Vui lòng kiểm tra lại thông tin',
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
                    {'Nhập mật khẩu'}
                </Text>
                <Spacer height={16} />
                <View style={{ paddingRight: scaleModerate(40) }}>
                    <OtpInput
                        autoFocus
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
                    onPress={handleForgotPassword}
                >
                    {'Quên mật khẩu'}
                </Text>
            </View>
            <View style={{ marginHorizontal: scaleModerate(16) }}>
                <Text style={DefaultStyles.textRegular14Black}>
                    Bằng việc nhấn vào <Text style={{ fontWeight: 'bold' }}>Tiếp tục</Text>. Bạn
                    đồng ý với quy chế của Thợ Xịn và Thợ Xịn sẽ được xử lí dữ liệu cá nhân của mình
                </Text>
                <Spacer height={16} />
                <Button
                    isColor
                    title={'Tiếp tục'}
                    onPress={handleLogin}
                    // disable={!isPasswordValid}
                />
                <Spacer height={20} />
            </View>
        </SafeAreaView>
    )
}

export default LoginViewPW

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
