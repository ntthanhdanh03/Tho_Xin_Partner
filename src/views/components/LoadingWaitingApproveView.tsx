import { ActivityIndicator, StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { HEIGHT_SCREEN, WIDTH_SCREEN } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import { Text } from 'react-native-paper'
import { DefaultStyles } from '../../styles/DefaultStyles'

interface LoadingWaitingApproveViewProps {
    loading: boolean
    text?: string
    onConfirm?: () => void
    onCancel?: () => void
}

const LoadingWaitingApproveView = ({
    loading,
    text,
    onConfirm,
    onCancel,
}: LoadingWaitingApproveViewProps) => {
    if (!loading) return null

    return (
        <View style={styles.overlay}>
            <ActivityIndicator animating color={Colors.whiteFF} size="large" />
            {text && <Text style={styles.text}>{text}</Text>}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                    <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LoadingWaitingApproveView

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: HEIGHT_SCREEN,
        width: WIDTH_SCREEN,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        paddingHorizontal: 20,
    },
    text: {
        marginTop: 10,
        textAlign: 'center',
        ...DefaultStyles.textBold16White,
    },
    buttonContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.gray72,
    },
    confirmButton: {
        backgroundColor: Colors.black01,
    },
    buttonText: {
        ...DefaultStyles.textBold16White,
    },
})
