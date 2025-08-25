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

const ForgotPasswordView = () => {
    const navigation = useNavigation()
    const handleCheckPhoneNumber = () => {
        navigation.navigate('ResetPasswordView' as never)
    }
    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header isBack />
            <View style={[DefaultStyles.wrapBody, { flex: 1 }]}>
                <Text style={[DefaultStyles.textBold22Black, { fontSize: 26 }]}>
                    {'Nhập mã xác thực'}
                </Text>
                <Spacer height={8} />
                <Text style={[DefaultStyles.textBold14Black]}>
                    {'Mã xác thực sẽ được gửi dến số'}
                </Text>
                <View style={{ flexDirection: 'row', width: '80%' }}>
                    <Text style={[DefaultStyles.textBold14Black]}>
                        {'+840795528073'}
                        <Text style={[DefaultStyles.textRegular14Black]}>
                            {'Vui lòng kiểm tra tin nhắn và nhập mã xác thực vào đây'}
                        </Text>
                    </Text>
                </View>
                <Spacer height={16} />
                <View style={{ paddingRight: scaleModerate(40) }}>
                    <OtpInput
                        autoFocus
                        numberOfDigits={6}
                        // ref={otpRef}
                        // onTextChange={(text) => setOtp(text)}
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
                <Text style={[DefaultStyles.textBold14Black, { color: Colors.blue11 }]}>
                    {'Gửi lại mã xác thực'}
                </Text>
            </View>
            <View style={{ marginHorizontal: scaleModerate(16) }}>
                <Spacer height={16} />
                <Button isColor title={'Xác nhận'} onPress={handleCheckPhoneNumber} />
                <Spacer height={20} />
            </View>
        </SafeAreaView>
    )
}

export default ForgotPasswordView

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
