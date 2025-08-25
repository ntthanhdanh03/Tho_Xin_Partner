import { Alert, PermissionsAndroid } from 'react-native'

export const getImagePermissionAndroid = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Image Download Permission',
                message: 'Your permission is required to save images to your device',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        }
        Alert.alert(
            'Save remote Image',
            'Grant Me Permission to save Image',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false },
        )
    } catch (err: any) {
        Alert.alert(
            'Save remote Image',
            'Failed to save Image: ' + err?.message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false },
        )
    }
}
