import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import GlobalModalController, { GlobalModalRef } from './GlobalModalController'
import { StyleSheet, Text, View } from 'react-native'
import { scaleModerate } from '../../../styles/scaleDimensions'
import { Colors } from '../../../styles/Colors'
import Modal from 'react-native-modal'
import Button from '../Button'
import Spacer from '../Spacer'
import FastImage from 'react-native-fast-image'
import { ic_fail, ic_fix_car, ic_success, ic_warning } from '../../../assets'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import { useTranslation } from 'react-i18next'

const getIcon = (icon: string) => {
    switch (icon) {
        case 'success':
            return ic_success
        case 'fail':
            return ic_fail
        case 'warning':
            return ic_warning
        case 'fixCar':
            return ic_fix_car
        case 'successV2':
            return ic_fix_car
        default:
            return undefined
    }
}
const GlobalModal = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const modalRef = useRef<GlobalModalRef>(null)
    const [data, setData] = useState<any>(null)
    const { t } = useTranslation()

    useLayoutEffect(() => {
        GlobalModalController.setModalRef(modalRef)
    }, [])

    useImperativeHandle(
        modalRef,
        () => ({
            show: (value) => {
                setData(value)
                setModalVisible(true)
            },
            hide: () => {
                setModalVisible(false)
            },
        }),
        [],
    )

    return (
        <Modal
            presentationStyle="overFullScreen"
            statusBarTranslucent
            isVisible={modalVisible}
            style={styles.modal}
            onModalHide={() => {
                GlobalModalController.onActionChange(null)
            }}
        >
            <View style={styles.container}>
                {data?.icon && <FastImage source={getIcon(data?.icon)} style={styles.icon} />}
                <Text style={[DefaultStyles.textBold18Black, { fontSize: 19 }]}>
                    {data?.title || ''}
                </Text>
                <Spacer height={5} />
                <Text style={DefaultStyles.textRegular16Gray}>{data?.description || ''}</Text>
                <Spacer height={15} />
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        title={t('Đóng')}
                        onPress={() => {
                            GlobalModalController.setActionChange(false)
                            setModalVisible(false)
                        }}
                        color={Colors.gray72}
                        containerStyle={{ flex: data?.type ? 1 : 0.5 }}
                    />
                    {data?.type === 'yesNo' && (
                        <>
                            <Spacer width={15} />
                            <Button
                                title={t('Xác nhận')}
                                onPress={() => {
                                    GlobalModalController.setActionChange(true)
                                    setModalVisible(false)
                                }}
                                isColor
                                color={Colors.primary}
                                containerStyle={{ flex: 1 }}
                            />
                        </>
                    )}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        // justifyContent: 'flex-end',
        // margin: 0,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.whiteFF,
        padding: scaleModerate(20),
        borderRadius: scaleModerate(15),
    },
    icon: {
        height: scaleModerate(80),
        width: scaleModerate(70),
        marginBottom: scaleModerate(5),
    },
})

export default forwardRef(GlobalModal as any)
