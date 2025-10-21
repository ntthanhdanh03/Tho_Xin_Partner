import React, { useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native'

interface NotificationModalProps {
    visible: boolean
    title?: string
    message?: string
    onHide?: () => void
    duration?: number
    appIcon?: string
    appName?: string
}

const SCREEN_WIDTH = Dimensions.get('window').width

const NotificationModal: React.FC<NotificationModalProps> = ({
    visible,
    title = 'Thông báo',
    message = '',
    onHide,
    duration = 4500,
    appIcon = '🔧',
    appName = 'Ứng dụng',
}) => {
    const translateY = useRef(new Animated.Value(-150)).current
    const opacity = useRef(new Animated.Value(0)).current
    const scale = useRef(new Animated.Value(0.9)).current

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start()

            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: -150,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 0.9,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]).start(() => onHide && onHide())
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [visible])

    const handlePress = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -150,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => onHide && onHide())
    }

    if (!visible) return null

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }, { scale }],
                    opacity,
                },
            ]}
        >
            <TouchableOpacity
                style={styles.touchableWrapper}
                activeOpacity={0.95}
                onPress={handlePress}
            >
                <View style={styles.notificationCard}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={styles.appIconContainer}>
                                <Text style={styles.appIcon}>{appIcon}</Text>
                            </View>
                            <View style={styles.headerText}>
                                <Text style={styles.appName} numberOfLines={1}>
                                    {appName}
                                </Text>
                                <Text style={styles.timeText}>bây giờ</Text>
                            </View>
                        </View>

                        <View style={styles.messageContainer}>
                            <Text style={styles.title} numberOfLines={1}>
                                {title}
                            </Text>
                            <Text style={styles.message} numberOfLines={3}>
                                {message}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 34,
        width: SCREEN_WIDTH,
        zIndex: 9999,
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    touchableWrapper: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 12,
    },
    notificationCard: {
        width: '100%',
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    appIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 7,
        backgroundColor: 'rgba(120, 120, 128, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    appIcon: {
        fontSize: 16,
    },
    headerText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        flex: 1,
        marginRight: 8,
    },
    timeText: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '400',
    },
    messageContainer: {
        paddingLeft: 38,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
        lineHeight: 20,
    },
    message: {
        fontSize: 14,
        color: '#3C3C43',
        lineHeight: 19,
        opacity: 0.85,
    },
})

export default NotificationModal
