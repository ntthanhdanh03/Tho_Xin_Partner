import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import Spacer from './Spacer'

interface IInput extends TextInputProps {
    title?: string
    error?: boolean
    message?: string
    containerStyle?: ViewStyle
    area?: boolean
}
const Input = (props: IInput) => {
    return (
        <View style={[props?.containerStyle]}>
            <View
                style={[
                    styles.wrapInput,
                    props?.editable === false && {
                        borderColor: '#706f6f',
                    },
                    props?.error && {
                        borderColor: Colors.redFD,
                    },
                    props?.area && {
                        height: scaleModerate(100),
                    },
                ]}
            >
                {props?.title && (
                    <View>
                        <Text
                            style={[
                                styles.title,
                                props?.editable === false && {
                                    color: '#706f6f',
                                },
                            ]}
                        >
                            {props?.title}
                        </Text>
                    </View>
                )}

                <TextInput
                    multiline={props?.area}
                    selectionColor={'#626161'}
                    editable={props?.editable !== false}
                    style={[
                        styles.input,
                        Boolean(props?.title) && {
                            marginTop: scaleModerate(15),
                            fontSize: scaleModerate(13),
                        },
                        props?.editable === false && {
                            color: '#706f6f',
                        },
                        props?.area && {
                            height: scaleModerate(70),
                            marginTop: scaleModerate(-10),
                            textAlignVertical: 'top',
                        },
                    ]}
                    {...props}
                />
            </View>
            {props?.message && <Text style={styles.message}>{props?.message}</Text>}
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    title: {
        position: 'absolute',
        top: scaleModerate(8),
        ...DefaultStyles.textBold12Black,
        backgroundColor: Colors.whiteFF,
        paddingHorizontal: scaleModerate(5),
        fontSize: scaleModerate(12),
    },
    wrapInput: {
        borderWidth: scaleModerate(1),
        height: scaleModerate(54),
        borderRadius: scaleModerate(8),
        borderColor: Colors.whiteE6,
        backgroundColor: Colors.whiteFF,
        paddingHorizontal: scaleModerate(10),
        marginHorizontal: 0,
    },
    leftIcon: {
        width: scaleModerate(20),
        height: scaleModerate(20),
        marginLeft: scaleModerate(14),
    },
    input: {
        flex: 1,
        ...DefaultStyles.textMedium12Black,
    },
    rightIcon: {
        width: scaleModerate(18),
        height: scaleModerate(18),
    },
    message: {
        marginTop: scaleModerate(5),
        marginLeft: scaleModerate(10),
        ...DefaultStyles.textRegular12Red,
    },
})
