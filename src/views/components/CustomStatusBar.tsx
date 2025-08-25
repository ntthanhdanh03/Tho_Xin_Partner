import { NativeModules, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
const { StatusBarManager } = NativeModules

const CustomStatusBar = () => {
    const [statusBarHeight, setStatusBarHeight] = React.useState(20)

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBarManager.getHeight((heightData: any) => {
                setStatusBarHeight(heightData.height)
            })
        } else if (Platform.OS === 'android') {
            setStatusBarHeight(StatusBar.currentHeight || 0)
        }
    }, [])

    return (
        <View style={{ height: statusBarHeight, backgroundColor: Colors.primary }}>
            <StatusBar translucent barStyle="dark-content" backgroundColor={Colors.primary} />
        </View>
    )
}

export default CustomStatusBar

const styles = StyleSheet.create({})
