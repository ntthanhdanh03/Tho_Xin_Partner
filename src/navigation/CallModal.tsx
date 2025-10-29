import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Sound from 'react-native-sound'
import { Colors } from '../styles/Colors'
import SocketUtil from '../utils/socketUtil'
import WebRTCPartner from '../utils/webrtcClient'

const { height } = Dimensions.get('window')

// ==================== TYPES ====================

export interface CallModalProps {
    type: 'outgoing' | 'incoming'
    role_Call?: 'client' | 'partner'
    role_Receiver?: 'client' | 'partner'
    sdp?: string
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

// ==================== GLOBALS ====================

let modalRef: CallModalRef | null = null
let ringtone: Sound | null = null

// ==================== COMPONENT ====================

const CallModalComponent = forwardRef<CallModalRef>((_, ref) => {
    // State
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<CallModalProps | null>(null)
    const [callPhase, setCallPhase] = useState<'ringing' | 'inCall'>('ringing')
    const [isSpeakerOn, setIsSpeakerOn] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [callDuration, setCallDuration] = useState(0)

    // Refs
    const translateY = useRef(new Animated.Value(height)).current
    const callTimerRef = useRef<NodeJS.Timeout | null>(null)
    const pulseAnim = useRef(new Animated.Value(1)).current

    // ==================== IMPERATIVE HANDLE ====================

    useImperativeHandle(ref, () => ({
        show: (props: CallModalProps) => {
            setData(props)
            setVisible(true)

            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start()

            ringtone = new Sound('ringring', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('❌ Lỗi tải âm thanh:', error)
                    return
                }
                ringtone?.setNumberOfLoops(-1)
                ringtone?.play()
            })
        },
        hide: () => {
            Animated.timing(translateY, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false)
                setData(null)
                setCallPhase('ringing')
                setIsSpeakerOn(false)
                setIsMuted(false)
                setCallDuration(0)

                if (callTimerRef.current) {
                    clearInterval(callTimerRef.current)
                    callTimerRef.current = null
                }
            })

            ringtone?.stop(() => {
                ringtone?.release()
                ringtone = null
            })
        },
    }))

    // ==================== EFFECTS ====================

    // Pulse animation effect
    useEffect(() => {
        if (callPhase === 'ringing') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ).start()
        }
    }, [callPhase, pulseAnim])

    // Call timer effect
    useEffect(() => {
        if (callPhase === 'inCall') {
            callTimerRef.current = setInterval(() => {
                setCallDuration((prev) => prev + 1)
            }, 1000)
        }

        return () => {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current)
                callTimerRef.current = null
            }
        }
    }, [callPhase])

    // Socket listeners effect
    useEffect(() => {
        SocketUtil.on('call.accepted', (payload) => {
            console.log('✅ Call accepted:', payload)
            setCallPhase('inCall')
            ringtone?.stop(() => {
                ringtone?.release()
                ringtone = null
            })
        })

        SocketUtil.on('call.ended', () => {
            console.log('📴 Cuộc gọi kết thúc')
            WebRTCPartner.endCall()
            modalRef?.hide()
            setCallPhase('ringing')
        })

        return () => {
            SocketUtil.off('call.accepted')
            SocketUtil.off('call.ended')
        }
    }, [])

    // Outgoing call effect
    useEffect(() => {
        if (!data?.to_userId || !data?.from_userId) return

        if (data?.type === 'outgoing' && data?.to_userId) {
            SocketUtil.emit('call.request', {
                from_userId: data.from_userId,
                role_Call: data.role_Call,
                to_userId: data.to_userId,
                form_name: data.form_name,
                form_avatar: data.form_avatar,
            })

            WebRTCPartner.startCall(data.to_userId, data.from_userId)
        }
    }, [data])

    // ==================== HANDLERS ====================

    const handleAcceptCall = async () => {
        ringtone?.stop(() => {
            ringtone?.release()
            ringtone = null
        })

        if (!data?.from_userId || !data?.to_userId || !data?.sdp) {
            console.warn('⚠️ Thiếu thông tin cuộc gọi:', data)
            return
        }

        const fromUserId = data.from_userId
        const toUserId = data.to_userId
        const sdp = data.sdp

        SocketUtil.emit('call.accept', {
            from_userId: toUserId,
            to_userId: fromUserId,
            to_role: 'client',
        })

        setCallPhase('inCall')

        try {
            await WebRTCPartner.handleOffer(fromUserId, sdp, toUserId)
            console.log('✅ Call setup completed')
        } catch (error) {
            console.error('❌ Error handling offer:', error)
        }
    }

    const handleDeclineCall = () => {
        ringtone?.stop(() => {
            ringtone?.release()
            ringtone = null
        })

        SocketUtil.emit('call.decline', {
            to: data?.from_userId,
            role: 'client',
        })

        modalRef?.hide()
    }

    const callRequestCancel = () => {
        SocketUtil.emit('call.request_cancel', {
            to: data?.to_userId,
            role: 'partner',
        })

        WebRTCPartner.endCall()
        modalRef?.hide()
    }

    const handleEndCall = () => {
        ringtone?.stop(() => {
            ringtone?.release()
            ringtone = null
        })

        WebRTCPartner.endCall()

        SocketUtil.emit('call.end', {
            to_userId: data?.to_userId,
            from_userId: data?.from_userId,
        })

        setCallPhase('ringing')
        modalRef?.hide()
    }

    const toggleSpeaker = () => {
        setIsSpeakerOn(!isSpeakerOn)
    }

    const toggleMute = () => {
        const newMutedState = !isMuted
        setIsMuted(newMutedState)

        if (WebRTCPartner.localStream) {
            WebRTCPartner.localStream.getAudioTracks().forEach((track: any) => {
                track.enabled = !newMutedState
            })
        }
    }

    // ==================== HELPERS ====================

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const getDisplayName = () => {
        return data?.type === 'incoming' ? data?.form_name : data?.to_name || 'Khách hàng'
    }

    const getAvatarLetter = () => {
        const name = data?.type === 'incoming' ? data?.form_name : data?.to_name
        return name?.charAt(0).toUpperCase() || 'K'
    }

    // ==================== RENDER ====================

    if (!visible || !data) return null

    const { type } = data

    return (
        <Animated.View style={[styles.overlay, { transform: [{ translateY }] }]}>
            <View style={styles.container}>
                {callPhase === 'ringing' ? (
                    // Ringing Phase
                    <>
                        <Animated.View
                            style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}
                        >
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{getAvatarLetter()}</Text>
                            </View>
                        </Animated.View>

                        <View style={styles.callerInfo}>
                            <Text style={styles.name}>{getDisplayName()}</Text>
                            <Text style={styles.sub}>
                                {type === 'incoming' ? 'Cuộc gọi đến...' : 'Đang gọi...'}
                            </Text>
                        </View>

                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={[styles.button, styles.decline]}
                                onPress={
                                    type === 'incoming' ? handleDeclineCall : callRequestCancel
                                }
                            >
                                <Text style={styles.btnIcon}>✕</Text>
                                <Text style={styles.btnLabel}>
                                    {type === 'incoming' ? 'Từ chối' : 'Hủy'}
                                </Text>
                            </TouchableOpacity>

                            {type === 'incoming' && (
                                <TouchableOpacity
                                    style={[styles.button, styles.accept]}
                                    onPress={handleAcceptCall}
                                >
                                    <Text style={styles.btnIcon}>✓</Text>
                                    <Text style={styles.btnLabel}>Trả lời</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                ) : (
                    // In-Call Phase
                    <View style={styles.inCallContainer}>
                        <View style={styles.avatarContainerSmall}>
                            <Text style={styles.avatarTextSmall}>{getAvatarLetter()}</Text>
                        </View>

                        <Text style={styles.nameInCall}>{getDisplayName()}</Text>
                        <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>

                        <View style={styles.controlButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.controlButton,
                                    isMuted && styles.controlButtonActive,
                                ]}
                                onPress={toggleMute}
                            >
                                <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎤'}</Text>
                                <Text
                                    style={[
                                        styles.controlLabel,
                                        isMuted && styles.controlLabelActive,
                                    ]}
                                >
                                    {isMuted ? 'Đã tắt' : 'Mic'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.controlButton,
                                    isSpeakerOn && styles.controlButtonActive,
                                ]}
                                onPress={toggleSpeaker}
                            >
                                <Text style={styles.controlIcon}>{isSpeakerOn ? '🔊' : '🔉'}</Text>
                                <Text
                                    style={[
                                        styles.controlLabel,
                                        isSpeakerOn && styles.controlLabelActive,
                                    ]}
                                >
                                    {isSpeakerOn ? 'Loa ngoài' : 'Loa'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, styles.endCallButton]}
                            onPress={handleEndCall}
                        >
                            <Text style={styles.btnIcon}>✕</Text>
                            <Text style={styles.btnLabel}>Kết thúc</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Animated.View>
    )
})

// ==================== EXPORT ====================

const CallModal = {
    setRef: (ref: any) => (modalRef = ref),
    show: (props: CallModalProps) => modalRef?.show(props),
    hide: () => modalRef?.hide(),
}

export { CallModalComponent }
export default CallModal

// ==================== STYLES ====================

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
        paddingHorizontal: 20,
        paddingBottom: 60,
    },

    // Avatar Styles
    avatarContainer: {
        marginBottom: 40,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(76, 217, 100, 0.2)',
        borderWidth: 3,
        borderColor: '#4CD964',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 48,
        fontWeight: '700',
        color: '#4CD964',
    },
    avatarContainerSmall: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(76, 217, 100, 0.2)',
        borderWidth: 2,
        borderColor: '#4CD964',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarTextSmall: {
        fontSize: 32,
        fontWeight: '700',
        color: '#4CD964',
    },

    // Caller Info Styles
    callerInfo: {
        alignItems: 'center',
        marginBottom: 80,
    },
    name: {
        fontSize: 32,
        color: '#ffffff',
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    nameInCall: {
        fontSize: 28,
        color: '#ffffff',
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    sub: {
        fontSize: 18,
        color: '#a0a0a0',
    },
    durationText: {
        fontSize: 16,
        color: '#4CD964',
        fontWeight: '600',
        marginBottom: 50,
    },

    // In-Call Container
    inCallContainer: {
        alignItems: 'center',
        width: '100%',
    },

    // Button Styles
    buttons: {
        flexDirection: 'row',
        gap: 50,
        alignItems: 'center',
    },
    button: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    decline: {
        backgroundColor: '#FF3B30',
    },
    accept: {
        backgroundColor: '#4CD964',
    },
    endCallButton: {
        backgroundColor: '#FF3B30',
        marginTop: 60,
    },
    btnIcon: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '700',
    },
    btnLabel: {
        fontSize: 13,
        color: '#fff',
        marginTop: 4,
        fontWeight: '600',
    },

    // Control Buttons
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
    },
    controlButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    controlButtonActive: {
        backgroundColor: '#4CD964',
        borderColor: '#4CD964',
    },
    controlIcon: {
        fontSize: 28,
    },
    controlLabel: {
        fontSize: 10,
        color: '#a0a0a0',
        marginTop: 4,
        textAlign: 'center',
        fontWeight: '600',
    },
    controlLabelActive: {
        color: '#fff',
    },
})
