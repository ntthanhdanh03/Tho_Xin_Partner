import React, { useEffect, useState } from 'react'
import { DeviceEventEmitter, StyleSheet } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FirebaseMessagingTypes, getMessaging } from '@react-native-firebase/messaging'
import Toast from 'react-native-toast-message'

import OutsideStack from './OutsideStack'
import InsideStack from './InsideStack'
import WorkingInProgressStack from './WorkingInProgressStack'
import NotificationModal from './NotificationModal'
import CallModal, { CallModalComponent } from './CallModal'
import { navigationRef } from './NavigationService'
import SocketUtil from '../utils/socketUtil'
import WebRTCPartner from '../utils/webrtcClient'
import { getFCMToken, initNotificationConfig } from '../utils/notificationUtils'
import '../utils/appStateUtil'

import {
    connectSocketSuccessAction,
    createInstallationAction,
    disconnectSocketSuccessAction,
    refreshTokenAction,
} from '../store/actions/authAction'
import { getOrderAction } from '../store/actions/orderAction'
import { getChatRoomByApplicantAction } from '../store/actions/chatAction'
import { getAppointmentAction } from '../store/actions/appointmentAction'
import RNBootSplash from 'react-native-bootsplash'

const Stack = createNativeStackNavigator()

// ==================== GLOBALS ====================

let pendingCallData: any = null

// ==================== COMPONENT ====================

const RootNavigator = () => {
    const dispatch = useDispatch()
    const { data: authData } = useSelector((store: any) => store.auth)
    const { data: appointmentData } = useSelector((store: any) => store.appointment)

    const [isAuthChecked, setIsAuthChecked] = useState(false)
    const [prevUserState, setPrevUserState] = useState<any>(null)
    const [notif, setNotif] = useState<{ title?: string; message?: string; visible: boolean }>({
        visible: false,
    })

    // ==================== BOOTSTRAP ====================

    useEffect(() => {
        const timer = setTimeout(() => {
            RNBootSplash.hide({ fade: true })
        }, 3500)
        const bootstrap = async () => {
            const token = await AsyncStorage.getItem('authToken')
            if (token) {
                dispatch(
                    refreshTokenAction({ refreshToken: token }, async (data: any) => {
                        if (!data) {
                            await AsyncStorage.removeItem('authToken')
                        }
                        setIsAuthChecked(true)
                    }),
                )
            } else {
                setIsAuthChecked(true)
            }
        }
        bootstrap()
    }, [])

    // ==================== SOCKET EVENTS ====================

    useEffect(() => {
        if (!authData?.user?._id) return

        const socketEvents = [
            {
                name: 'connect',
                handler: () => dispatch(connectSocketSuccessAction()),
            },
            {
                name: 'disconnect',
                handler: () => dispatch(disconnectSocketSuccessAction()),
            },
            {
                name: 'new_order',
                handler: () => {
                    DeviceEventEmitter.emit('NEW_ORDER')
                    dispatch(getOrderAction({ typeService: authData.user.partner.kyc.choseField }))
                },
            },
            {
                name: 'cancel_order',
                handler: (order: any) => console.log('Cancel order:', order),
            },
            {
                name: 'update_order',
                handler: (order: any) => console.log('Update order:', order),
            },
            {
                name: 'order.selectApplicant',
                handler: () => dispatch(getAppointmentAction({ partnerId: authData.user._id })),
            },
            {
                name: 'chat.newMessage',
                handler: () =>
                    dispatch(getChatRoomByApplicantAction({ _applicantId: authData.user._id })),
            },
            {
                name: 'appointment_updated',
                handler: (data: any) => {
                    console.log('📅 appointment_updated event received', data)
                    dispatch(getAppointmentAction({ partnerId: data.partnerId }))
                },
            },
        ]

        const callEvents = [
            {
                name: 'webrtc.offer',
                handler: (data: any) => {
                    console.log('📥 Nhận offer từ:', data.from_userId)
                    CallModal.show({
                        type: 'incoming',
                        role_Receiver: 'partner',
                        from_userId: data.from_userId,
                        form_name: data?.form_name,
                        form_avatar: data?.form_avatar,
                        to_userId: data.to_userId,
                        sdp: data.sdp,
                    })
                },
            },
            {
                name: 'webrtc.answer',
                handler: (data: any) => {
                    console.log('📥 Nhận answer')
                    WebRTCPartner.handleAnswer(data.sdp)
                },
            },
            {
                name: 'webrtc.ice-candidate',
                handler: (data: any) => {
                    console.log('❄️ Nhận ICE candidate:', data.to_role)

                    if (data.to_role === 'partner') {
                        if (!WebRTCPartner.pc) {
                            const fromUserId = data.from_userId || pendingCallData?.from_userId
                            if (fromUserId) {
                                ;(WebRTCPartner.constructor as any).queueCandidateBeforeConnection(
                                    fromUserId,
                                    data.candidate,
                                )
                            } else {
                                console.warn('⚠️ Cannot queue candidate: no from_userId')
                            }
                        } else {
                            WebRTCPartner.handleCandidate(data)
                        }
                    }
                },
            },
            {
                name: 'call.request_cancel',
                handler: (data: any) => {
                    console.log('📞 call.request_cancel', data)
                    pendingCallData = null
                    CallModal.hide()
                },
            },
            {
                name: 'call.ended',
                handler: (data: any) => {
                    console.log('📴 call.ended', data)
                    pendingCallData = null
                    CallModal.hide()
                },
            },
            {
                name: 'call.declined',
                handler: (data: any) => {
                    console.log('❌ call.declined', data)
                    pendingCallData = null
                    CallModal.hide()
                },
            },
        ]

        const allEvents = [...socketEvents, ...callEvents]
        const subscriptions = allEvents.map((e) =>
            DeviceEventEmitter.addListener(e.name, e.handler),
        )

        return () => {
            subscriptions.forEach((sub) => sub.remove())
            pendingCallData = null
        }
    }, [authData])

    // ==================== AUTH & NOTIFICATIONS ====================

    useEffect(() => {
        if (!authData) return
        if (prevUserState !== null) return

        initNotificationConfig((installationData: any) => {
            handleCreateInstallation(authData, installationData)

            getMessaging().onMessage((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
                console.log('🔔 Foreground notification:', remoteMessage)
                setNotif({
                    visible: true,
                    title: remoteMessage.notification?.title,
                    message: remoteMessage.notification?.body,
                })
            })
        })

        dispatch(getChatRoomByApplicantAction({ _applicantId: authData.user._id }))
        dispatch(
            getAppointmentAction({ partnerId: authData.user._id }, (data: any) => {
                if (data?.appointmentInProgress?.length > 0) {
                    SocketUtil.connect(authData.user._id, 'partner')
                }
            }),
        )

        setPrevUserState(authData)
    }, [authData])

    // ==================== APP STATE HANDLERS ====================

    useEffect(() => {
        const onForeground = () => {
            if (authData) {
                console.log('🚀 APP_FOREGROUND | User:', authData?.user?._id)
                dispatch(getAppointmentAction({ partnerId: authData.user._id }))
                dispatch(getChatRoomByApplicantAction({ _applicantId: authData.user._id }))
                dispatch(getOrderAction({ typeService: authData.user.partner.kyc.choseField }))
            }
        }

        const onBackground = () => {
            console.log('🌙 APP_BACKGROUND')
        }

        const subForeground = DeviceEventEmitter.addListener('APP_FOREGROUND', onForeground)
        const subBackground = DeviceEventEmitter.addListener('APP_BACKGROUND', onBackground)

        return () => {
            subForeground.remove()
            subBackground.remove()
        }
    }, [authData])

    // ==================== HELPERS ====================

    const handleCreateInstallation = async (userData: any, installationData: any) => {
        if (installationData?.token && userData.user.deviceToken !== installationData.token) {
            const fcmToken = await getFCMToken()
            dispatch(
                createInstallationAction({
                    userId: userData.user._id,
                    deviceToken: {
                        token: installationData.token,
                        osVersion: installationData.os,
                        fcmToken: fcmToken,
                    },
                }),
            )
        }
    }

    // ==================== RENDER ====================

    if (!isAuthChecked) return null

    return (
        <>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {authData ? (
                        appointmentData?.appointmentInProgress?.length > 0 ? (
                            <Stack.Screen
                                name="WorkingInProgressStack"
                                component={WorkingInProgressStack}
                            />
                        ) : (
                            <Stack.Screen name="InsideStack" component={InsideStack} />
                        )
                    ) : (
                        <Stack.Screen name="OutsideStack" component={OutsideStack} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>

            <NotificationModal
                visible={notif.visible}
                title={notif.title}
                message={notif.message}
                onHide={() => setNotif({ ...notif, visible: false })}
            />

            <CallModalComponent ref={(ref) => CallModal.setRef(ref)} />
        </>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})
