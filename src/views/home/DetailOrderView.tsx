import React, { useState } from 'react'
import { StyleSheet, FlatList, View, Text, ScrollView, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Button from '../components/Button'
import CustomModal from './CustomModal'
import Input from '../components/Input'
import Spacer from '../components/Spacer'
import { useDispatch, useSelector } from 'react-redux'
import { applicantOrderAction } from '../../store/actions/orderAction'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import { useNavigation } from '@react-navigation/native'

const formatCurrency = (value: string) => {
    if (!value) return ''
    // loại bỏ ký tự không phải số
    const numeric = value.replace(/\D/g, '')
    if (!numeric) return ''
    // format có dấu chấm
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
}

const DetailOrderView = ({ route }: any) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: authData } = useSelector((store: any) => store.auth)
    const { item } = route.params
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [price, setPrice] = useState('')
    const [note, setNote] = useState('')

    const handleApplicant = () => {
        const postData = {
            partnerId: authData?.user?._id,
            name: authData?.user?.fullName,
            avatarUrl: authData?.user?.avatarUrl,
            offeredPrice: price,
            note: note,
        }

        console.log({
            id: item._id,
            postData,
        })
        dispatch(
            applicantOrderAction(
                {
                    id: item._id,
                    postData,
                },
                (data: any, error: any) => {
                    if (data) {
                        GlobalModalController.showModal({
                            title: 'Báo giá thành công',
                            description: error || 'Báo giá thành công',
                            icon: 'success',
                        })
                        navigation.goBack()
                        setIsModalVisible(false)
                    } else {
                        GlobalModalController.showModal({
                            title: 'Báo giá thất bại',
                            description: error || 'Vui lòng kiểm tra lại thông tin',
                            icon: 'fail',
                        })
                        setIsModalVisible(false)
                    }
                },
            ),
        )
    }

    return (
        <SafeAreaView style={[DefaultStyles.container, { borderWidth: 1 }]} edges={['top']}>
            <Header isBack title="Chi Tiết Yêu Cầu" />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.service}</Text>
                <Text>{item.describe}</Text>
                <Text>{item.address}</Text>
                <Text>{item.rangePrice}</Text>
                <Text>Trạng thái: {item.status}</Text>
                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Ảnh:</Text>
            </View>
            <Button
                title="Báo giá"
                containerStyle={{ margin: 10, marginBottom: 20 }}
                onPress={() => {
                    setIsModalVisible(true)
                }}
            />

            <CustomModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                configHeight={0.7}
            >
                <ScrollView>
                    <Input title="Ghi chú" value={note} onChangeText={(text) => setNote(text)} />
                    <Spacer height={10} />
                    <Input
                        title="Báo giá"
                        keyboardType="number-pad"
                        value={price}
                        onChangeText={(text) => setPrice(formatCurrency(text))}
                        placeholder="Nhập số tiền"
                    />
                </ScrollView>
                <Button title="Xác nhận" onPress={handleApplicant} disable={!price.trim()} />
            </CustomModal>
        </SafeAreaView>
    )
}

export default DetailOrderView

const styles = StyleSheet.create({})
