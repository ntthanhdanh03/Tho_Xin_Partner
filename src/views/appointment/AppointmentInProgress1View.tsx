import React, { useEffect, useRef, useState, useMemo } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Linking,
    Platform,
    PermissionsAndroid,
    StatusBar,
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
import { updateLocationPartnerAction } from '../../store/actions/locationAction'

// ✅ Import từ utils/MapboxConfig.ts
import {
    MAPVIEW_CONFIG,
    CAMERA_CONFIG,
    getDistance,
    getBounds,
    fetchRoute,
} from '../../utils/mapboxUtils'
import { ic_chat, ic_map_gg, ic_phone_native } from '../../assets'

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
    const [initialCameraSet, setInitialCameraSet] = useState(false)

    const lastRouteLocationRef = useRef<[number, number] | null>(null)
    const locationUpdateTimerRef = useRef<NodeJS.Timeout | null>(null)

    const destination: any = useMemo(() => {
        if (!order?.longitude || !order?.latitude) return null
        const lng = parseFloat(order.longitude)
        const lat = parseFloat(order.latitude)
        return !isNaN(lng) && !isNaN(lat) ? [lng, lat] : null
    }, [order?.longitude, order?.latitude])

    // ✅ Debounce gửi vị trí lên server
    useEffect(() => {
        if (!userLocation || !authData?.user?._id) return

        if (locationUpdateTimerRef.current) clearTimeout(locationUpdateTimerRef.current)

        locationUpdateTimerRef.current = setTimeout(() => {
            const postData = {
                userId: authData.user._id,
                longitude: userLocation[0],
                latitude: userLocation[1],
                clientId: appointment?.clientId?._id || '',
            }
            dispatch(updateLocationPartnerAction({ postData }))
        }, 3000)

        return () => {
            if (locationUpdateTimerRef.current) clearTimeout(locationUpdateTimerRef.current)
        }
    }, [userLocation, authData?.user?._id])

    // ✅ Theo dõi vị trí người dùng (chỉ update khi di chuyển >10m)
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
                    const newLoc: [number, number] = [pos.coords.longitude, pos.coords.latitude]
                    setUserLocation((prev) => {
                        if (!prev) return newLoc
                        const dist = getDistance(prev, newLoc)
                        return dist > 10 ? newLoc : prev
                    })
                },
                (err) => {
                    console.error('📍 Location error:', err)
                    setLoading(false)
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 10,
                    interval: 10000,
                    fastestInterval: 5000,
                },
            )
        }

        startWatch()
        return () => {
            if (watchId != null) Geolocation.clearWatch(watchId)
        }
    }, [isFocused])

    // ✅ Fetch route (chỉ khi di chuyển >50m)
    useEffect(() => {
        if (!isFocused || !userLocation || !destination) return

        if (lastRouteLocationRef.current) {
            const moved = getDistance(lastRouteLocationRef.current, userLocation)
            if (moved < 50) return
        }

        const fetchRouteData = async () => {
            setLoading(true)
            const routeData = await fetchRoute(userLocation, destination)
            if (routeData) {
                setRoute(routeData.coordinates)
                setDistance(routeData.distance)
                setDuration(routeData.duration)
                lastRouteLocationRef.current = userLocation

                if (cameraRef.current && !initialCameraSet) {
                    const bounds = getBounds([userLocation, destination])
                    cameraRef.current.fitBounds(
                        [bounds.minLng, bounds.minLat],
                        [bounds.maxLng, bounds.maxLat],
                        [100, 50, 350, 50],
                        1000,
                    )
                    setInitialCameraSet(true)
                }
            }
            setLoading(false)
        }

        const timer = setTimeout(fetchRouteData, 2000)
        return () => clearTimeout(timer)
    }, [userLocation, destination, isFocused])

    const moveToUserLocation = () => {
        if (userLocation && cameraRef.current) {
            cameraRef.current.setCamera({
                centerCoordinate: userLocation,
                zoomLevel: CAMERA_CONFIG.zoomLevel,
                animationDuration: CAMERA_CONFIG.animationDuration,
            })
        }
    }

    const handleSwipe = () => {
        GlobalModalController.onActionChange((value: any) => {
            if (value) {
                const postData = { status: 2 }
                const dataUpdate = {
                    id: appointment._id,
                    typeUpdate: 'APPOINTMENT_UPDATE_IN_PROGRESS',
                    postData,
                }
                dispatch(updateAppointmentAction(dataUpdate))
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
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* 🗺️ Map */}
            {isFocused && userLocation && destination ? (
                <MapboxGL.MapView
                    style={styles.map}
                    styleURL={MAPVIEW_CONFIG.styleURL}
                    compassEnabled={MAPVIEW_CONFIG.compassEnabled}
                    logoEnabled={MAPVIEW_CONFIG.logoEnabled}
                    attributionEnabled={MAPVIEW_CONFIG.attributionEnabled}
                    pitchEnabled={MAPVIEW_CONFIG.pitchEnabled}
                    rotateEnabled={MAPVIEW_CONFIG.rotateEnabled}
                >
                    <MapboxGL.Camera
                        ref={cameraRef}
                        zoomLevel={CAMERA_CONFIG.zoomLevel}
                        centerCoordinate={userLocation}
                        animationMode="none"
                        minZoomLevel={MAPVIEW_CONFIG.minZoomLevel}
                        maxZoomLevel={MAPVIEW_CONFIG.maxZoomLevel}
                    />

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

            {/* 🧾 Thông tin địa chỉ */}
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

            {/* 🧭 Nút thao tác */}
            <View style={styles.bottom}>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}
                >
                    <TouchableOpacity
                        onPress={() => phoneNumber && Linking.openURL(`tel:${phoneNumber}`)}
                    >
                        <FastImage source={ic_phone_native} style={styles.icon} />
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
                        <FastImage source={ic_chat} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => mapsUrl && Linking.openURL(mapsUrl)}>
                        <FastImage source={ic_map_gg} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <SwipeButton
                    title="Bạn đã tới địa điểm"
                    onSwipeSuccess={handleSwipe}
                    containerStyles={{
                        borderRadius: 8,
                        overflow: 'hidden',
                        marginHorizontal: 16,
                        marginBottom: 10,
                    }}
                    railBackgroundColor={Colors.whiteAE}
                    railFillBackgroundColor={'rgba(0,0,0,0.4)'}
                    railBorderColor={Colors.gray72}
                    railFillBorderColor={Colors.whiteAE}
                    railStyles={{ borderRadius: 8 }}
                    thumbIconBorderColor="transparent"
                    thumbIconBackgroundColor={Colors.gray44}
                    thumbIconStyles={{ borderRadius: 4, width: 40, height: 40 }}
                    titleStyles={{ ...DefaultStyles.textBold16Black }}
                    titleColor={Colors.black01}
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
    icon: { height: 28, width: 28, marginLeft: 10 },
    meButton: {
        position: 'absolute',
        bottom: '22%',
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
