import React, { useEffect, useRef, useState } from 'react'
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Pressable,
} from 'react-native'

const { height } = Dimensions.get('window')

const CustomModal = ({ visible, onClose, children, configHeight }: any) => {
    const translateY = useRef(new Animated.Value(height)).current
    const [show, setShow] = useState(visible)

    useEffect(() => {
        if (visible) {
            setShow(true)
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(translateY, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setShow(false))
        }
    }, [visible])

    if (!show) return null

    return (
        <View style={styles.overlay}>
            <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                <View style={[styles.content, { height: height * (configHeight || 0.5) }]}>
                    {children}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={{ color: 'white' }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    )
}

export default CustomModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end', // dính xuống đáy
        width: '100%',
    },
    content: {
        height: '90%',
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
    },
    closeBtn: {
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'black',
        alignItems: 'center',
    },
})
