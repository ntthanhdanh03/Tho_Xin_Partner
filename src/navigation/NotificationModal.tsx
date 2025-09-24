import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native'

interface NotificationModalProps {
    visible: boolean
    title?: string
    message?: string
    onHide?: () => void
    duration?: number
}

const SCREEN_WIDTH = Dimensions.get('window').width

const NotificationModal: React.FC<NotificationModalProps> = ({
    visible,
    title,
    message,
    onHide,
    duration = 4500,
}) => {
    const translateY = new Animated.Value(-100)

    useEffect(() => {
        if (visible) {
            // slide in
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start()

            // auto hide
            const timer = setTimeout(() => {
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onHide && onHide())
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [visible])

    if (!visible) return null

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
            <TouchableOpacity style={styles.content} activeOpacity={0.9} onPress={onHide}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        width: SCREEN_WIDTH,
        zIndex: 9999,
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#323232',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
        width: SCREEN_WIDTH - 32,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    message: {
        color: '#fff',
        fontSize: 14,
        marginTop: 4,
    },
})

export default NotificationModal
