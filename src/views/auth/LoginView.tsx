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

const LoginView = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleCheckPhoneNumber = () => {
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
                        }}
                        outlineColor={Colors.gray69}
                        activeOutlineColor={Colors.blue11}
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
                    />
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

const styles = StyleSheet.create({})
