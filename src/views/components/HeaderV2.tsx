import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { ic_chevron_left } from '../../assets'
import { scaleModerate } from '../../styles/scaleDimensions'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import { DefaultStyles } from '../../styles/DefaultStyles'

interface IHeader {
    title?: string
    isBack?: boolean
    onPressBack?: () => void
    containerStyle?: ViewStyle
    rightIcon?: any
    secondRightIcon?: any
    onRightButtonPress?: () => void
    onSecondRightButtonPress?: () => void
    type?: 'full' | 'simple' | 'double-right'
    renderRight?: any
}

const HeaderV2 = (props: IHeader) => {
    const navigation = useNavigation()

    const handleGoBack = () => {
        if (props?.onPressBack) {
            props.onPressBack()
        } else {
            navigation.canGoBack() && navigation.goBack()
        }
    }

    return (
        <View style={[styles.container, props.containerStyle]}>
            {props.isBack && (
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <FastImage source={ic_chevron_left} style={styles.iconBack} />
                </TouchableOpacity>
            )}

            <View
                style={[
                    styles.titleContainer,
                    props.type === 'full' && { flex: 1 },
                    props.type === 'double-right' && { flex: 1 },
                    !props.isBack &&
                        (props.rightIcon || props.secondRightIcon) && {
                            marginStart: scaleModerate(36),
                        },
                ]}
            >
                <Text
                    style={[
                        styles.title,
                        props.type === 'simple' && {
                            textAlign: 'center',
                            marginRight: scaleModerate(30),
                        },
                        props.type === 'double-right' && {
                            marginStart: scaleModerate(25),
                        },
                    ]}
                >
                    {props.title}
                </Text>
            </View>

            {/* Icon phải */}
            {props.type === 'full' && props.rightIcon && !props?.renderRight && (
                <TouchableOpacity onPress={props.onRightButtonPress} style={styles.rightButton}>
                    <FastImage source={props.rightIcon} style={styles.iconRight} />
                </TouchableOpacity>
            )}
            {props?.renderRight && props?.renderRight()}

            {/* Hai nút phải */}
            {props.type === 'double-right' && (
                <View style={styles.doubleRightContainer}>
                    {props.rightIcon && (
                        <TouchableOpacity
                            onPress={props.onRightButtonPress}
                            style={styles.rightButton}
                        >
                            <FastImage source={props.rightIcon} style={styles.iconRight} />
                        </TouchableOpacity>
                    )}
                    {props.secondRightIcon && (
                        <TouchableOpacity
                            onPress={props.onSecondRightButtonPress}
                            style={styles.rightButton}
                        >
                            <FastImage source={props.secondRightIcon} style={styles.iconRight} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}

export default HeaderV2

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaleModerate(20),
        height: scaleModerate(56),
        backgroundColor: Colors.whiteFF,
        borderBottomWidth: scaleModerate(1),
        borderColor: Colors.border01,
    },
    backButton: {
        // padding: scaleModerate(10),
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        ...DefaultStyles.textBold16Black,
        textAlign: 'center',
    },
    iconBack: {
        height: scaleModerate(24),
        width: scaleModerate(24),
    },
    rightButton: {
        padding: scaleModerate(5),
    },
    iconRight: {
        height: scaleModerate(24),
        width: scaleModerate(24),
    },
    doubleRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
