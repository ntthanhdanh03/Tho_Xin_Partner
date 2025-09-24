import { DeviceEventEmitter, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import OutsideStack from './OutsideStack'
import InsideStack from './InsideStack'
import { navigationRef } from './NavigationService'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createInstallationAction, refreshTokenAction } from '../store/actions/authAction'
import BootSplash from 'react-native-bootsplash'
import { getFCMToken, initNotificationConfig } from '../utils/notificationUtils'
import SocketUtil from '../utils/socketUtil'
import { FirebaseMessagingTypes, getMessaging } from '@react-native-firebase/messaging'
import Toast from 'react-native-toast-message'
import NotificationModal from './NotificationModal'

const Stack = createNativeStackNavigator()

const RootNavigator = () => {
    const { data: authData } = useSelector((store: any) => store.auth)
    const dispatch = useDispatch()
    const [isAuthChecked, setIsAuthChecked] = useState(false)
    const [prevUserState, setPrevUserState] = useState<any>(null)
    const initialRoute = authData ? 'InsideStack' : 'OutsideStack'
    const [notif, setNotif] = useState<{ title?: string; message?: string; visible: boolean }>({
        visible: false,
    })

    useEffect(() => {
        const bootstrap = async () => {
            const token = await AsyncStorage.getItem('authToken')
            if (token) {
                dispatch(
                    refreshTokenAction({ refreshToken: token }, async (data: any, error?: any) => {
                        if (data) {
                            setIsAuthChecked(true)
                        } else {
                            await AsyncStorage.removeItem('authToken')
                            setIsAuthChecked(true)
                        }
                    }),
                )
            } else {
                setIsAuthChecked(true)
            }
        }
        bootstrap()
    }, [])

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('new_order', (order) => {
            console.log('Danh đẹp trai', order)
        })

        return () => subscription.remove()
    }, [])

    useEffect(() => {
        if (authData) {
            if (prevUserState === null) {
                initNotificationConfig((installationData: any) => {
                    handleCreateInstallation(authData, installationData)
                    const unsubscribe = getMessaging().onMessage(
                        (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
                            console.log('Foreground notification:', remoteMessage)
                            setNotif({
                                visible: true,
                                title: remoteMessage.notification?.title,
                                message: remoteMessage.notification?.body,
                            })
                        },
                    )
                })
            }
        }
        setPrevUserState(authData)
    }, [authData])

    const handleCreateInstallation = async (userData: any, installationData: any) => {
        if (installationData?.token && userData?.user?.deviceToken !== installationData?.token) {
            const fcmToken = await getFCMToken()
            dispatch(
                createInstallationAction({
                    userId: userData?.user?._id,
                    deviceToken: {
                        token: installationData?.token,
                        osVersion: installationData?.os,
                        fcmToken: fcmToken,
                    },
                }),
            )
        }
    }

    if (!isAuthChecked) return null

    return (
        <>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName={initialRoute}
                >
                    {authData ? (
                        <Stack.Screen name="InsideStack" component={InsideStack} />
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
        </>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})
