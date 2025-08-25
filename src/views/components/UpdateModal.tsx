import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import Spacer from './Spacer'
import { DefaultStyles } from '../../styles/DefaultStyles'
import FastImage from 'react-native-fast-image'
import { ic_close, ic_upgrade } from '../../assets'
import { useTranslation } from 'react-i18next'
import Button from './Button'

interface IUpdateModal {
    isVisible?: boolean
    onClose?: any
    data?: any
}

const UpdateModal = (props: IUpdateModal) => {
    const { t } = useTranslation()
    return (
        <Modal
            isVisible={props?.isVisible}
            style={styles.modal}
            onBackdropPress={() => props?.onClose()}
        >
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <Text style={DefaultStyles.textBold18Black}>{t('newVersionAvailable')}</Text>
                    <TouchableOpacity onPress={() => props?.onClose()}>
                        <FastImage
                            source={ic_close}
                            style={{ height: scaleModerate(24), width: scaleModerate(24) }}
                        />
                    </TouchableOpacity>
                </View>
                <Spacer height={16} />
                <View style={{ borderTopWidth: 1, borderColor: Colors.gray72 }}></View>
                <Spacer height={20} />
                <FastImage
                    source={ic_upgrade}
                    style={{
                        height: scaleModerate(70),
                        width: scaleModerate(70),
                        alignSelf: 'center',
                    }}
                />
                <Spacer height={14} />
                <Text style={[DefaultStyles.textBold16Black, { textAlign: 'center' }]}>
                    {t('version') + ': '}
                    {props?.data?.latestVersion && props?.data?.latestVersion}
                </Text>
                <Spacer height={5} />
                <Text style={DefaultStyles.textRegular14Black}>{t('updateVersionMessage')}</Text>
                <Spacer height={20} />
                <Button
                    title={t('update')}
                    onPress={() => {
                        if (props?.data?.storeUrl) Linking.openURL(props?.data?.storeUrl)
                        props?.onClose && props?.onClose()
                    }}
                />
                <Spacer height={25} />
            </View>
        </Modal>
    )
}

export default UpdateModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: Colors.whiteFF,
        paddingTop: scaleModerate(24),
        paddingHorizontal: scaleModerate(24),
        paddingBottom: scaleModerate(40),
        borderTopRightRadius: scaleModerate(24),
        borderTopLeftRadius: scaleModerate(24),
        maxHeight: '90%',
    },
    itemWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.black1B,
        borderWidth: 1,
        borderRadius: scaleModerate(10),
        padding: scaleModerate(12),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
