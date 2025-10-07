import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Linking,
    Platform,
    PermissionsAndroid,
} from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import Geolocation from 'react-native-geolocation-service'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import SwipeButton from 'rn-swipe-button'
import { Colors } from '../../styles/Colors'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Spacer from '../components/Spacer'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import { updateAppointmentAction } from '../../store/actions/appointmentAction'
import { ic_check_select, ic_eye_off } from '../../assets'
import { updateLocationPartnerAction } from '../../store/actions/locationAction'

const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A'
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)

const AppointmentInProgress1View = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const isFocused = useIsFocused()

    const { data: authData } = useSelector((s: any) => s.auth)
    const { data: appointmentData } = useSelector((s: any) => s.appointment)

    const appointment = appointmentData?.appointmentInProgress?.[0]
    const order = appointment?.orderId
    const phoneNumber = appointment?.clientId?.phoneNumber

    const cameraRef = useRef<MapboxGL.Camera>(null)
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
    const [route, setRoute] = useState<number[][] | null>(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [loading, setLoading] = useState(true)

    const destination: any = useMemo(() => {
        if (!order?.longitude || !order?.latitude) return null
        const lng = parseFloat(order.longitude)
        const lat = parseFloat(order.latitude)
        return !isNaN(lng) && !isNaN(lat) ? [lng, lat] : null
    }, [order])

    useEffect(() => {
        if (!userLocation || !authData?.user?._id) return
        const postData = {
            userId: authData.user._id,
            longitude: userLocation[0],
            latitude: userLocation[1],
            clientId: appointment?.clientId?._id || '',
        }
        dispatch(updateLocationPartnerAction({ postData }))
    }, [userLocation])

    useEffect(() => {
        if (!isFocused) return
        let watchId: number | null = null

        const startWatch = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                )
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    setLoading(false)
                    return
                }
            }
            watchId = Geolocation.watchPosition(
                (pos) => {
                    setUserLocation([pos.coords.longitude, pos.coords.latitude])
                },
                (err) => {
                    console.error('📍 Location error:', err)
                    setLoading(false)
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 10,
                    interval: 5000,
                    fastestInterval: 3000,
                },
            )
        }

        startWatch()
        return () => {
            if (watchId != null) Geolocation.clearWatch(watchId)
        }
    }, [isFocused])

    useEffect(() => {
        if (!isFocused || !userLocation || !destination) return
        const fetchRoute = async () => {
            try {
                setLoading(true)
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
                const res = await fetch(url)
                const data = await res.json()
                if (data.routes?.[0]) {
                    const r = data.routes[0]
                    setRoute(r.geometry.coordinates)
                    setDistance(`${(r.distance / 1000).toFixed(1)} km`)
                    setDuration(`${Math.round(r.duration / 60)} phút`)
                    if (cameraRef.current) {
                        const bounds = getBounds([userLocation, destination])
                        cameraRef.current.fitBounds(
                            [bounds.minLng, bounds.minLat],
                            [bounds.maxLng, bounds.maxLat],
                            [100, 50, 350, 50],
                            1000,
                        )
                    }
                }
            } catch (err) {
                console.error('❌ Fetch route failed:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRoute()
    }, [userLocation, destination, isFocused])

    const getBounds = (coords: [number, number][]) => {
        const lngs = coords.map((c) => c[0])
        const lats = coords.map((c) => c[1])
        return {
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs),
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats),
        }
    }

    const moveToUserLocation = () => {
        if (userLocation && cameraRef.current) {
            cameraRef.current.flyTo(userLocation, 1000)
        }
    }

    const handleSwipe = () => {
        // navigation.reset({ // index: 0, // routes: [ // { // name: 'AppointmentInProgress2View', // params: { dataAppointment }, // }, // ] as never, // })
        GlobalModalController.onActionChange((value: any) => {
            if (value) {
                const postData = { status: 2 }
                const dataUpdate = {
                    id: appointment._id,
                    typeUpdate: 'APPOINTMENT_UPDATE_IN_PROGRESS',
                    postData,
                }
                dispatch(
                    updateAppointmentAction(dataUpdate, (res: any) => {
                        if (res) {
                            navigation.navigate(...(['AppointmentInProgress2View'] as never))
                        }
                    }),
                )
            } else GlobalModalController.hideModal()
        })
        GlobalModalController.showModal({
            title: 'Xác nhận đã đến địa chỉ?',
            description: 'Đảm bảo rằng bạn đã gặp được khách hàng.',
            type: 'yesNo',
            icon: 'warning',
        })
    }

    const mapsUrl = destination
        ? `https://www.google.com/maps/dir/?api=1&destination=${destination[1]},${destination[0]}`
        : ''

    return (
        <View style={{ flex: 1 }}>
            {/* 🗺️ Map */}
            {isFocused && userLocation && destination ? (
                <MapboxGL.MapView style={styles.map}>
                    <MapboxGL.Camera ref={cameraRef} />
                    {route && (
                        <MapboxGL.ShapeSource
                            id="routeSource"
                            shape={{
                                type: 'Feature',
                                geometry: { type: 'LineString', coordinates: route },
                                properties: {},
                            }}
                        >
                            <MapboxGL.LineLayer
                                id="routeLine"
                                style={{ lineColor: Colors.black01, lineWidth: 3 }}
                            />
                        </MapboxGL.ShapeSource>
                    )}
                    <MapboxGL.PointAnnotation id="userMarker" coordinate={userLocation}>
                        <View style={styles.userMarker} />
                    </MapboxGL.PointAnnotation>
                    <MapboxGL.PointAnnotation id="destMarker" coordinate={destination}>
                        <Text style={{ fontSize: 22 }}>📍</Text>
                    </MapboxGL.PointAnnotation>
                </MapboxGL.MapView>
            ) : (
                <View style={styles.loadingMap}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}

            {/* 🧾 Info */}
            <View style={styles.infoCard}>
                <Text style={styles.infoAddress}>{order?.address || 'Địa chỉ không xác định'}</Text>
                <Spacer height={4} />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.infoLabel}>Khoảng cách: </Text>
                    <Text style={styles.infoValue}>{distance}</Text>
                    <Text style={styles.infoLabel}> • Thời gian: </Text>
                    <Text style={styles.infoValue}>{duration}</Text>
                </View>
            </View>
            <View style={styles.bottom}>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}
                >
                    <TouchableOpacity
                        onPress={() => phoneNumber && Linking.openURL(`tel:${phoneNumber}`)}
                    >
                        <FastImage source={ic_eye_off} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                ...([
                                    'ChatViewVer2',
                                    {
                                        dataRoomChat: {
                                            orderId: order?._id,
                                            clientId: appointment?.clientId?._id,
                                        },
                                    },
                                ] as never),
                            )
                        }
                    >
                        <FastImage source={ic_check_select} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => mapsUrl && Linking.openURL(mapsUrl)}>
                        <FastImage source={ic_eye_off} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <SwipeButton
                    title="Bạn đã tới địa điểm"
                    onSwipeSuccess={handleSwipe}
                    containerStyles={{ borderRadius: 8 }}
                    railBackgroundColor={Colors.whiteAE}
                    railFillBackgroundColor={'rgba(0,0,0,0.4)'}
                    titleStyles={{ ...DefaultStyles.textBold16Black }}
                />
            </View>

            <TouchableOpacity style={styles.meButton} onPress={moveToUserLocation}>
                <Text style={{ fontSize: 22 }}>📍</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AppointmentInProgress1View

const styles = StyleSheet.create({
    map: { flex: 1 },
    loadingMap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    userMarker: {
        height: 18,
        width: 18,
        backgroundColor: '#007AFF',
        borderRadius: 9,
        borderColor: Colors.whiteAE,
        borderWidth: 2,
    },
    infoCard: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: Colors.whiteAE,
        borderRadius: 12,
        padding: 14,
        shadowColor: Colors.black01,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    infoAddress: { ...DefaultStyles.textRegular16Black },
    infoLabel: { ...DefaultStyles.textRegular13Gray },
    infoValue: { ...DefaultStyles.textMedium14Black, color: Colors.primary300 },
    bottom: {
        position: 'absolute',
        bottom: 30,
        left: 10,
        right: 10,
        backgroundColor: Colors.whiteAE,
        borderRadius: 12,
        padding: 15,
        elevation: 4,
    },
    icon: { height: 24, width: 24, marginLeft: 12 },
    meButton: {
        position: 'absolute',
        bottom: 250,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
})
