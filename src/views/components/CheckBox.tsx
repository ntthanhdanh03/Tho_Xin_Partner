import { StyleSheet, Text, Touchable, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { ic_check, ic_x_red } from '../../assets'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Spacer from './Spacer'
import { use } from 'i18next'

const CheckBox = ({
    size = 26,
    containerStyle = {},
    onChange = () => {},
    isDisable = false,
    title = '',
    value = false,
    type = 'x',
}: {
    size?: number
    containerStyle?: ViewStyle
    onChange?: (isChecked?: boolean) => void
    isDisable?: boolean
    title?: string
    value?: boolean
    type?: 'x' | 'v'
}) => {
    const [isCheck, setIsCheck] = useState(value)

    useEffect(() => {
        setIsCheck(value)
    }, [value])

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity
                onPress={() => {
                    setIsCheck(!isCheck)
                    onChange && onChange(!isCheck)
                }}
                activeOpacity={0.5}
                style={[
                    styles.button,
                    {
                        height: scaleModerate(size),
                        backgroundColor: isDisable ? Colors.grayDE : Colors.whiteFC,
                    },
                ]}
                disabled={isDisable}
            >
                {isCheck && (
                    <FastImage
                        source={type === 'v' ? ic_check : ic_x_red}
                        style={
                            type === 'v'
                                ? { height: scaleModerate(size), aspectRatio: 1 }
                                : { height: scaleModerate(size - 10), aspectRatio: 1 }
                        }
                    />
                )}
            </TouchableOpacity>
            {title && <Text style={styles.text}>{title}</Text>}
        </View>
    )
}

export default CheckBox

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        aspectRatio: 1,
        borderWidth: 1.5,
        borderRadius: scaleModerate(5),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: Colors.whiteFC,
    },
    text: {
        ...DefaultStyles.textRegular14Black,
        marginLeft: scaleModerate(5),
    },
})
