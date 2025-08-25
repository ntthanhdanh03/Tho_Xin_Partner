import { StyleSheet, View, ViewStyle } from 'react-native'
import React from 'react'
import { scaleModerate } from '../../styles/scaleDimensions'

interface IBorderBottomView {
    containerStyle: ViewStyle
    gapHeight?: number
    gapColor: string
    children?: JSX.Element
}
const BorderBottomView = (props: IBorderBottomView) => {
    return (
        <View
            style={{
                paddingBottom: props?.gapHeight
                    ? scaleModerate(props?.gapHeight)
                    : scaleModerate(4),
            }}
        >
            <View
                style={[
                    props?.containerStyle,
                    {
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: props?.gapColor,
                    },
                ]}
            ></View>
            <View style={props?.containerStyle}>{props?.children && props?.children}</View>
        </View>
    )
}

export default BorderBottomView

const styles = StyleSheet.create({})
