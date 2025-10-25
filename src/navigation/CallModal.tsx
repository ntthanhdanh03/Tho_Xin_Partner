import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../styles/Colors'

const { height } = Dimensions.get('window')

// Biến toàn cục để gọi từ bất cứ đâu
let modalRef: any = null

const CallModalComponent = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)
    const [show, setShow] = useState(false)
    const translateY = useRef(new Animated.Value(height)).current // ban đầu nằm ngoài màn hình

    useImperativeHandle(ref, () => ({
        show: () => {
            setVisible(true)
            setShow(true)
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start()
        },
        hide: () => {
            Animated.timing(translateY, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false)
                setShow(false)
            })
        },
    }))

    if (!show && !visible) return null

    return (
        <Animated.View style={[styles.overlay, { transform: [{ translateY }] }]}>
            <View style={styles.container}>
                <Text style={styles.name}>📞 Cuộc gọi đến</Text>
                <Text style={styles.sub}>Nguyễn Văn A đang gọi cho bạn...</Text>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={[styles.button, styles.decline]}
                        onPress={() => modalRef?.hide()}
                    >
                        <Text style={styles.btnText}>Từ chối</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.accept]}
                        onPress={() => {
                            // TODO: điều hướng vào màn hình gọi
                            modalRef?.hide()
                        }}
                    >
                        <Text style={styles.btnText}>Trả lời</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    )
})

// API toàn cục
const CallModal = {
    setRef: (ref: any) => (modalRef = ref),
    show: () => modalRef?.show(),
    hide: () => modalRef?.hide(),
}

export { CallModalComponent }
export default CallModal

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.whiteFF,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    container: {
        flex: 1,
        width: '100%',
        height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.whiteFF,
        paddingHorizontal: 20,
    },
    name: {
        fontSize: 28,
        color: '#fff',
        fontWeight: '700',
        marginBottom: 10,
    },
    sub: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 40,
    },
    buttons: {
        flexDirection: 'row',
        gap: 30,
    },
    button: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    decline: {
        backgroundColor: '#FF3B30',
    },
    accept: {
        backgroundColor: '#4CD964',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})
