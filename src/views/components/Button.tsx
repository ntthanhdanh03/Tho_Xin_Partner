import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'
import React from 'react'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import { DefaultStyles } from '../../styles/DefaultStyles'

interface IButton {
    title: string
    type?: 'small' | 'large'
    onPress?: any
    disable?: boolean
    isColor?: boolean
    containerStyle?: ViewStyle
    color?: string
    isLoading?: boolean
}
const Button = (props: IButton) => {
    return (
        <>
            {props?.type === 'small' ? (
                <TouchableOpacity
                    disabled={props?.disable === true}
                    style={[
                        styles.smallBtnWrap,
                        {
                            backgroundColor: props?.isColor ? Colors.primary : Colors.primary0,
                        },
                        props?.color ? { backgroundColor: props?.color } : {},
                        props?.containerStyle,
                        props?.disable === true && { backgroundColor: '#c7c6c6' },
                    ]}
                    onPress={() => {
                        props?.onPress && props?.onPress()
                    }}
                >
                    <Text
                        style={[
                            DefaultStyles.textMedium14White,
                            { color: props?.isColor ? Colors.whiteFF : Colors.whiteFF },
                            props?.disable === true && { color: Colors.whiteFF },
                        ]}
                    >
                        {props?.title}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={[props?.containerStyle]}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={props?.isLoading || props?.disable === true}
                        onPress={() => {
                            props?.onPress && props?.onPress()
                        }}
                        style={[
                            styles.wrapButton,
                            {
                                backgroundColor: props?.isColor ? Colors.primary : Colors.primary0,
                            },
                            props?.color ? { backgroundColor: props?.color } : {},
                            props?.disable === true && { backgroundColor: '#c7c6c6' },
                        ]}
                    >
                        {props?.isLoading ? (
                            <ActivityIndicator animating />
                        ) : (
                            <Text
                                style={[
                                    props?.isColor
                                        ? DefaultStyles.textBold14White
                                        : DefaultStyles.textBold14White,
                                    props?.disable === true && { color: Colors.whiteFF },
                                ]}
                            >
                                {props?.title}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </>
    )
}

export default Button

const styles = StyleSheet.create({
    wrapButton: {
        flexDirection: 'row',
        height: scaleModerate(46),
        borderRadius: scaleModerate(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallBtnWrap: {
        alignSelf: 'flex-end',
        borderRadius: scaleModerate(4),
        height: scaleModerate(28),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: scaleModerate(16),
    },
})
