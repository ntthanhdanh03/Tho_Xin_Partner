// import PushNotificationIOS from '@react-native-community/push-notification-ios'
// import PushNotification from 'react-native-push-notification'
// import messaging from '@react-native-firebase/messaging'
// import { Platform } from 'react-native'
// import { startIncomingCall } from './callKeepUtils'
// export function initNotificationConfig(
//     onRegisterSuccess?: any,
//     onReceiveNotification?: any,
//     onPressNotification?: any
// ) {
//     try {
//         // Must be outside of any component LifeCycle (such as `componentDidMount`).
//         PushNotification.configure({
//             // (optional) Called when Token is generated (iOS and Android)
//             onRegister: function (token) {
//                 console.log('TOKEN:', token)
//                 onRegisterSuccess && onRegisterSuccess(token)
//             },

//             // (required) Called when a remote is received or opened, or local notification is opened
//             onNotification: function (notification) {
//                 console.log('NOTIFICATION:', notification)

//                 // process the notification
//                 try {
//                     if (notification?.userInteraction) {
//                         onPressNotification && onPressNotification(notification)
//                     } else {
//                         onReceiveNotification && onReceiveNotification(notification)
//                     }
//                 } catch (error) {
//                     console.log('onNotification err', error)
//                 }

//                 // (required) Called when a remote is received or opened, or local notification is opened
//                 notification.finish(PushNotificationIOS.FetchResult.NoData)
//             },

//             // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//             onAction: function (notification) {
//                 console.log('ACTION:', notification.action)
//                 console.log('NOTIFICATION:', notification)

//                 // process the action
//             },

//             // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//             onRegistrationError: function (err) {
//                 console.log('onRegistrationError', err?.message, err)
//             },

//             // IOS ONLY (optional): default: all - Permissions to register.
//             permissions: {
//                 alert: true,
//                 badge: true,
//                 sound: true,
//             },

//             // Should the initial notification be popped automatically
//             // default: true
//             popInitialNotification: true,

//             /**
//              * (optional) default: true
//              * - Specified if permissions (ios) and token (android and ios) will requested or not,
//              * - if not, you must call PushNotificationsHandler.requestPermissions() later
//              * - if you are not using remote notification or do not have Firebase installed, use this:
//              *     requestPermissions: Platform.OS === 'ios'
//              */
//             requestPermissions: true,
//         })

//         PushNotification.createChannel(
//             {
//                 channelId: 'CALL_NOTIFICATION',
//                 channelName: 'Call Channel',
//                 channelDescription: 'A channel to categorize your notifications',
//                 soundName: 'default',
//                 importance: 4,
//                 vibrate: true,
//             },
//             (created) => console.log(`createChannel returned '${created}'`)
//         )
//     } catch (e) {
//         console.log('setNotificationConfig', e)
//     }
// }

// export const setBackgroundService = async () => {
//     try {
//         console.log('setBackgroundService')
//         if (Platform.OS === 'ios') {
//             const authStatus = await messaging().requestPermission()
//             const enabled =
//                 authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//                 authStatus === messaging.AuthorizationStatus.PROVISIONAL

//             console.log('authStatus', authStatus)
//             if (enabled) {
//                 console.log('Notification IOS permission granted')

//                 messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
//                     console.log('setBackgroundMessageHandler', remoteMessage)
//                     if (remoteMessage?.data?.model === 'CallLog') {
//                         const callType = remoteMessage?.data?.callType // Get the call type from remoteMessage
//                         const callTransactionId = remoteMessage?.data?.callTransactionId
//                         const callUUID = remoteMessage?.data?.callUUID
//                         const callerName = remoteMessage?.data?.fromUserName // Get the caller's name or other data from remoteMessage
//                         console.log('xxx background', callUUID, callerName)

//                         // Display the incoming call UI
//                         startIncomingCall(callUUID, callerName)
//                     }
//                 })
//             } else {
//                 console.log('Notification IOS permission denied')
//             }
//         } else {
//             const permissionStatus = await messaging().requestPermission()
//             if (permissionStatus === messaging.AuthorizationStatus.AUTHORIZED) {
//                 console.log('Notification permission granted on Android 13+')
//                 // This will run when the app is in the background or closed
//                 messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
//                     if (remoteMessage?.data?.model === 'CallLog') {
//                         // PushNotification.localNotification({
//                         //     channelId: 'CALL_NOTIFICATION',
//                         //     title: 'Incoming Call',
//                         //     message: 'You have an incoming call',
//                         //     soundName: 'default', // or specify a custom sound like "call_sound.wav"
//                         //     actions: ['Answer', 'Decline'], // Custom buttons
//                         // })
//                         const callType = remoteMessage?.data?.callType // Get the call type from remoteMessage
//                         const callTransactionId = remoteMessage?.data?.callTransactionId
//                         const callUUID = remoteMessage?.data?.callUUID
//                         const callerName = remoteMessage?.data?.fromUserName // Get the caller's name or other data from remoteMessage
//                         console.log('xxx background', callUUID, callerName)

//                         // Display the incoming call UI
//                         startIncomingCall(callUUID, callerName)
//                     }
//                 })
//             } else {
//                 console.log('Notification permission denied on Android 13+')
//             }
//         }
//     } catch (error) {
//         console.log('Error requesting permission:', error)
//     }
// }

// export const getFCMToken = async () => {
//     try {
//         // Get FCM token
//         const fcmToken = await messaging().getToken()
//         console.log('FCM Token:', fcmToken)
//         return fcmToken
//     } catch (error) {
//         console.log('Error getting FCM token:', error)
//         return null
//     }
// }
