import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
interface ILine {
    size?: number
    color?: string
}
const Line = (props: ILine) => {
    return (
        <View
            style={{
                borderBottomWidth: props?.size ? props?.size : scaleModerate(1),
                borderBottomColor: props?.color ? props?.color : Colors.gray72,
            }}
        ></View>
    )
}

export default Line

const styles = StyleSheet.create({})
