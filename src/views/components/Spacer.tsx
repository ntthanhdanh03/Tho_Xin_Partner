import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scaleModerate } from '../../styles/scaleDimensions'

const Spacer = ({ width = 1, height = 1 }: { width?: number; height?: number }) => {
    return (
        <View
            style={{
                width: scaleModerate(width),
                height: scaleModerate(height),
            }}
        ></View>
    )
}

export default Spacer

const styles = StyleSheet.create({})
