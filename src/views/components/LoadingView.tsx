import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React from 'react'
import { HEIGHT_SCREEN, WIDTH_SCREEN } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'

const LoadingView = ({ loading }: { loading: boolean }) => {
    if (!loading) return null // tốt hơn display: none

    return (
        <View style={styles.overlay}>
            <ActivityIndicator animating color={Colors.black01} size="large" />
        </View>
    )
}

export default LoadingView

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: HEIGHT_SCREEN,
        width: WIDTH_SCREEN,
        backgroundColor: 'rgba(0,0,0,0.4)', // nền đen mờ mờ
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // đảm bảo nổi lên trên
    },
})
