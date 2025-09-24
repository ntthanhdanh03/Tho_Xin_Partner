// utils/LocationService.ts
import { Platform, PermissionsAndroid } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

type LocationCallback = (coords?: { latitude: number; longitude: number }, error?: string) => void

export class LocationService {
    static async requestPermission(): Promise<boolean> {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Quyền truy cập vị trí',
                        message: 'App cần quyền truy cập vị trí của bạn',
                        buttonPositive: 'OK',
                    },
                )
                return granted === PermissionsAndroid.RESULTS.GRANTED
            } catch (err) {
                console.error('Request location permission error:', err)
                return false
            }
        }
        return true // iOS tự xử lý qua Info.plist
    }

    static async getCurrentLocation(callback: LocationCallback) {
        const hasPermission = await this.requestPermission()
        if (!hasPermission) {
            callback(undefined, 'Không có quyền truy cập vị trí')
            return
        }

        Geolocation.getCurrentPosition(
            (position) => {
                // position: { coords: { latitude, longitude, ... }, timestamp }
                callback(
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    undefined,
                )
            },
            (error) => {
                console.error('Lỗi lấy vị trí:', error.message)
                callback(undefined, error.message)
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            },
        )
    }
}
