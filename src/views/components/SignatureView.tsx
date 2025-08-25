import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { ic_close } from '../../assets'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import { useTranslation } from 'react-i18next'
import Signature from 'react-native-signature-canvas'

interface ISignatureView {
    onBegin?: any
    onEnd?: any
}
const SignatureView = React.forwardRef((props: ISignatureView, ref: any) => {
    const { t } = useTranslation()
    const signatureRef = React.useRef<any>(null)
    const [signature, setSignature] = useState<any>(null)

    ///TODO: Fixed error need to call getSignature() two times
    useImperativeHandle(
        ref,
        () => ({
            initSignature() {
                signatureRef?.current?.readSignature()
            },
            async getSignature() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(signature)
                    }, 100)
                })
            },
        }),
        [signature],
    )

    return (
        <View style={{ height: scaleModerate(150) }}>
            <Signature
                ref={signatureRef}
                descriptionText=""
                webStyle={`.m-signature-pad--footer {display: none;} .m-signature-pad {height: 150px;}`}
                autoClear={false}
                onOK={(imageBase64) => {
                    setSignature(imageBase64)
                }}
                onBegin={() => {
                    props.onBegin && props.onBegin()
                }}
                onEnd={() => {
                    props.onEnd && props.onEnd()
                }}
            />
            <TouchableOpacity
                style={styles.clearImageWrap}
                onPress={() => {
                    signatureRef?.current?.clearSignature()
                    setSignature(null)
                }}
            >
                <FastImage
                    source={ic_close}
                    style={{
                        height: scaleModerate(24),
                        aspectRatio: 1,
                        backgroundColor: Colors.whiteFF,
                        borderRadius: scaleModerate(24),
                    }}
                />
            </TouchableOpacity>
        </View>
    )
})

export default SignatureView

const styles = StyleSheet.create({
    clearImageWrap: {
        position: 'absolute',
        zIndex: 2,
        top: scaleModerate(6),
        right: scaleModerate(8),
    },
})
