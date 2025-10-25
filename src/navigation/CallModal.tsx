import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Colors } from '../styles/Colors'
import SocketUtil from '../utils/socketUtil'
import { DefaultStyles } from '../styles/DefaultStyles'

const { height } = Dimensions.get('window')

export interface CallModalProps {
    type: 'outgoing' | 'incoming'
    role_Call?: 'client' | 'partner'
    role_Receiver?: 'client' | 'partner'

    from_userId?: string
    form_name?: string
    form_avatar?: string

    to_userId?: string
    to_name?: string
    to_avatar?: string
}

export interface CallModalRef {
    show: (props: CallModalProps) => void
    hide: () => void
}

let modalRef: CallModalRef | null = null

const CallModalComponent = forwardRef<CallModalRef>((_, ref) => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<CallModalProps | null>(null)
    const translateY = useRef(new Animated.Value(height)).current
    const [callPhase, setCallPhase] = useState<'ringing' | 'inCall'>('ringing')

    useImperativeHandle(ref, () => ({
        show: (props: CallModalProps) => {
            setData(props)
            setVisible(true)
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
                setData(null)
            })
        },
    }))

    useEffect(() => {
        SocketUtil.on('call.accepted', (payload) => {
            setCallPhase('inCall')
        })

        SocketUtil.on('call.ended', () => {
            console.log('📴 Cuộc gọi kết thúc')
            modalRef?.hide()
            setCallPhase('ringing')
        })

        return () => {
            SocketUtil.off('call.accepted')
            SocketUtil.off('call.ended')
        }
    }, [])

    useEffect(() => {
        if (data?.type === 'outgoing' && data?.to_userId) {
            SocketUtil.emit('call.request', {
                from_userId: data.from_userId,
                role_Call: data.role_Call,
                to_userId: data.to_userId,
                form_name: data.form_name,
                form_avatar: data.form_avatar,
            })
            console.log('📤 Gửi tín hiệu gọi đi tới', data.to_userId)
        }
    }, [data])

    if (!visible || !data) return null

    const { type, to_name, to_avatar, form_name } = data

    const callRequestCancel = () => {
        SocketUtil.emit('call.request_cancel', {
            to: data.to_userId,
            role: 'partner',
        })

        modalRef?.hide()
    }

    const handleAcceptCall = () => {
        SocketUtil.emit('call.accept', {
            from_userId: data.to_userId,
            to_userId: data.from_userId,
            to_role: 'client',
        })
        setCallPhase('inCall')
    }

    const handleDeclineCall = () => {
        if (data.role_Receiver === 'client') {
            SocketUtil.emit('call.decline', {
                to: data.from_userId,
                role: 'client',
            })
        } else {
            SocketUtil.emit('call.decline', {
                to: data.from_userId,
                role: 'partner',
            })
        }
        modalRef?.hide()
    }

    return (
        <Animated.View style={[styles.overlay, { transform: [{ translateY }] }]}>
            <View style={styles.container}>
                {callPhase === 'ringing' ? (
                    <>
                        {type === 'incoming' ? (
                            <View>
                                <Text style={styles.btnText}>{form_name}</Text>
                            </View>
                        ) : (
                            <View>
                                <Text>Đang gọi tới Khách hàng ...</Text>
                            </View>
                        )}
                        {type === 'incoming' ? (
                            <View>
                                <TouchableOpacity
                                    style={[styles.button, styles.accept]}
                                    onPress={() => {
                                        handleDeclineCall()
                                    }}
                                >
                                    <Text style={styles.btnText}>Hủy</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.accept]}
                                    onPress={() => {
                                        handleAcceptCall()
                                    }}
                                >
                                    <Text style={styles.btnText}>Trả lời</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.buttons}>
                                <TouchableOpacity
                                    style={[styles.button, styles.decline]}
                                    onPress={() => callRequestCancel()}
                                >
                                    <Text style={styles.btnText}>Hủy</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        <View>
                            <Text>Trong cuộc gọi</Text>

                            <TouchableOpacity
                                style={[styles.button, styles.decline]}
                                onPress={() => {
                                    SocketUtil.emit('call.end', {
                                        to_userId: data?.to_userId,
                                        from_userId: data?.from_userId,
                                    })
                                    setCallPhase('ringing')
                                    modalRef?.hide()
                                }}
                            >
                                <Text style={styles.btnText}>Tắt cuộc gọi</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </Animated.View>
    )
})

const CallModal = {
    setRef: (ref: any) => (modalRef = ref),
    show: (props: CallModalProps) => modalRef?.show(props),
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
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        backgroundColor: '#eee',
    },
    name: {
        fontSize: 26,
        color: '#000',
        fontWeight: '700',
        marginBottom: 10,
    },
    sub: {
        fontSize: 16,
        color: '#777',
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
        ...DefaultStyles.textBold16Black,
    },
})
