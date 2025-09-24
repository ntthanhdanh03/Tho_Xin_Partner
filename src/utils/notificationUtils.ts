import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotification from 'react-native-push-notification'
import messaging from '@react-native-firebase/messaging'
import { Platform, PermissionsAndroid } from 'react-native'

export function initNotificationConfig(
    onRegisterSuccess?: any,
    onReceiveNotification?: any,
    onPressNotification?: any
) {
    try {
        PushNotification.configure({
            onRegister: function (token) {
                console.log('TOKEN:', token)
                onRegisterSuccess && onRegisterSuccess(token)
            },

            onNotification: function (notification) {
                console.log('NOTIFICATION:', notification)
                try {
                    if (notification?.userInteraction) {
                        onPressNotification && onPressNotification(notification)
                    } else {
                        onReceiveNotification && onReceiveNotification(notification)
                    }
                } catch (error) {
                    console.log('onNotification err', error)
                }
                notification.finish(PushNotificationIOS.FetchResult.NoData)
            },

            onAction: function (notification) {
                console.log('ACTION:', notification.action)
                console.log('NOTIFICATION:', notification)
            },

            onRegistrationError: function (err) {
                console.log('onRegistrationError', err?.message, err)
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            popInitialNotification: true,
            requestPermissions: true,
        })

      
    } catch (e) {
        console.log('setNotificationConfig', e)
    }
}



export const getFCMToken = async () => {
    try {
        const fcmToken = await messaging().getToken()
        console.log('FCM Token:', fcmToken)
        return fcmToken
    } catch (error) {
        console.log('Error getting FCM token:', error)
        return null
    }
}
