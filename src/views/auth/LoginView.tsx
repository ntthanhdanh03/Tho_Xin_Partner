import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Spacer from '../components/Spacer'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import { TextInput } from 'react-native-paper'
import { ic_balence, ic_calendar } from '../../assets'
import { useDispatch } from 'react-redux'
import { checkPhoneExistAction } from '../../store/actions/authAction'
import LoadingView from '../components/LoadingView'

// Regex cho số điện thoại Việt Nam
const PHONE_REGEX = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/

const LoginView = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>()
    const [phoneError, setPhoneError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Validate số điện thoại
    const validatePhoneNumber = (phone: string): boolean => {
        if (!phone) {
            setPhoneError('Vui lòng nhập số điện thoại')
            return false
        }

        if (!PHONE_REGEX.test(phone)) {
            setPhoneError('Số điện thoại không hợp lệ')
            return false
        }

        setPhoneError('')
        return true
    }

    const handleCheckPhoneNumber = () => {
        if (!validatePhoneNumber(phoneNumber || '')) {
            return
        }

        setIsLoading(true)
        const postData = {
            phoneNumber: phoneNumber,
            role: 'partner',
        }
        dispatch(
            checkPhoneExistAction(postData, (data: any, error: any) => {
                if (data === true) {
                    setIsLoading(false)
                    navigation.navigate(...(['LoginViewPW', { phoneNumber }] as never))
                } else {
                    setIsLoading(false)
                    navigation.navigate(...(['RegisterOTPView', { phoneNumber }] as never))
                }
            }),
        )
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <View style={[DefaultStyles.wrapBody, { flex: 1 }]}>
                <Spacer height={30} />
                <View
                    style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                >
                    <Text style={[DefaultStyles.textRegular16Black]}>
                        {'Bắt đầu trải nghiệm với'}
                    </Text>
                    <Text style={[DefaultStyles.textBold14Black]}>{' Thợ Xịn Đối Tác'}</Text>
                </View>
                <Spacer height={16} />
                <View>
                    <TextInput
                        mode="outlined"
                        label="Số điện thoại"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={(text) => {
                            setPhoneNumber(text)
                            if (phoneError) {
                                setPhoneError('')
                            }
                        }}
                        outlineColor={phoneError ? Colors.red30 : Colors.gray69}
                        activeOutlineColor={phoneError ? Colors.red30 : Colors.blue11}
                        textColor={Colors.black01}
                        style={{ fontSize: scaleModerate(14) }}
                        theme={{
                            roundness: 12,
                            colors: {
                                onSurfaceVariant: Colors.gray44,
                            },
                        }}
                        left={<TextInput.Icon icon={ic_balence} size={30} />}
                        right={<TextInput.Icon icon={ic_calendar} />}
                        error={!!phoneError}
                    />
                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                </View>
                <Spacer height={30} />
            </View>
            <View style={{ marginHorizontal: scaleModerate(16) }}>
                <Text style={DefaultStyles.textRegular14Black}>
                    Bằng việc nhấn vào <Text style={{ fontWeight: 'bold' }}>Tiếp tục</Text>. Bạn
                    đồng ý với quy chế của Thợ Xịn và Thợ Xịn sẽ được xử lí dữ liệu cá nhân của mình
                </Text>
                <Spacer height={16} />
                <Button isColor title={'Tiếp tục'} onPress={handleCheckPhoneNumber} />
                <Spacer height={20} />
            </View>
            <LoadingView loading={isLoading} />
        </SafeAreaView>
    )
}

export default LoginView

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        fontSize: scaleModerate(12),
        marginTop: 4,
        marginLeft: 12,
    },
})
