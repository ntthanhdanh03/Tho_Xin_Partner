import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
    DeviceEventEmitter,
    Dimensions,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import FastImage from 'react-native-fast-image'
import { useDispatch, useSelector } from 'react-redux'
import Geolocation from 'react-native-geolocation-service'

import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { img_default_avatar } from '../../assets'

import SwitchButton from '../components/SwitchButton'
import SocketUtil from '../../utils/socketUtil'
import { useNavigation } from '@react-navigation/native'
import CustomModal from './CustomModal'
import ListOrderView from './ListOrderView'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import { getOrderAction } from '../../store/actions/orderAction'
import { getAppointmentAction } from '../../store/actions/appointmentAction'
import { startSocketBackground } from '../../services/backgroundSocket'
import {
    MAPVIEW_CONFIG,
    CAMERA_CONFIG,
    getDistance,
    type Coordinate,
} from '../../utils/mapboxUtils'

// ✅ Memoize MapView component để prevent re-renders
const MemoizedMapView = React.memo(
    ({
        userLocation,
        cameraRef,
    }: {
        userLocation: Coordinate | null
        cameraRef: React.RefObject<MapboxGL.Camera | null>
    }) => {
        return (
            <MapboxGL.MapView
                style={styles.map}
                // ✅ Áp dụng config từ utils để giảm tiles
                styleURL={MAPVIEW_CONFIG.styleURL}
                compassEnabled={MAPVIEW_CONFIG.compassEnabled}
                scaleBarEnabled={MAPVIEW_CONFIG.scaleBarEnabled}
                logoEnabled={MAPVIEW_CONFIG.logoEnabled}
                attributionEnabled={MAPVIEW_CONFIG.attributionEnabled}
                pitchEnabled={MAPVIEW_CONFIG.pitchEnabled}
                rotateEnabled={MAPVIEW_CONFIG.rotateEnabled}
            >
                {userLocation && (
                    <>
                        {/* ✅ Camera không có animationMode - chỉ set vị trí ban đầu */}
                        <MapboxGL.Camera
                            ref={cameraRef}
                            zoomLevel={CAMERA_CONFIG.zoomLevel}
                            centerCoordinate={userLocation}
                            minZoomLevel={MAPVIEW_CONFIG.minZoomLevel}
                            maxZoomLevel={MAPVIEW_CONFIG.maxZoomLevel}
                        />
                        <MapboxGL.PointAnnotation id="userMarker" coordinate={userLocation}>
                            <View style={styles.userMarker} />
                        </MapboxGL.PointAnnotation>
                    </>
                )}
            </MapboxGL.MapView>
        )
    },
)

const HomeView = () => {
    const { data: authData } = useSelector((store: any) => store.auth)
    const { data: appointmentData } = useSelector((store: any) => store.appointment)

    const [userLocation, setUserLocation] = useState<Coordinate | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isOnline, setIsOnline] = useState(false)

    const cameraRef = useRef<MapboxGL.Camera>(null)
    const navigation = useNavigation()
    const dispatch = useDispatch()

    // ✅ Sử dụng ref để track location mà không trigger re-render
    const userLocationRef = useRef<Coordinate | null>(null)
    const isFirstLocationRef = useRef(true)
    const lastUpdateRef = useRef<number>(0) // Track last update time

    useEffect(() => {
        const runSocket = async () => {
            if (isOnline) {
                SocketUtil.connect(authData?.user?._id, 'partner')
            } else {
                SocketUtil.disconnect()
            }
        }

        runSocket()
    }, [isOnline, authData?.user?._id])

    // ✅ Kiểm tra xem location có thay đổi đáng kể không (sử dụng utils helper)
    const hasSignificantChange = useCallback(
        (oldLoc: Coordinate | null, newLoc: Coordinate): boolean => {
            if (!oldLoc) return true

            // ✅ Sử dụng getDistance từ utils (chính xác hơn)
            const distance = getDistance(oldLoc, newLoc)

            // Chỉ update nếu di chuyển > 15 meters
            return distance > 15
        },
        [],
    )

    useEffect(() => {
        let watchId: number | null = null
        const requestPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                )
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Location permission denied')
                    return
                }
            }

            watchId = Geolocation.watchPosition(
                (pos) => {
                    const coords: Coordinate = [pos.coords.longitude, pos.coords.latitude]

                    // ✅ Lưu vào ref trước, chỉ update state nếu cần
                    userLocationRef.current = coords

                    // ✅ Throttle updates: chỉ update tối đa mỗi 3s
                    const now = Date.now()
                    const timeSinceLastUpdate = now - lastUpdateRef.current

                    if (timeSinceLastUpdate < 3000 && !isFirstLocationRef.current) {
                        return // Skip update nếu chưa đủ 3s
                    }

                    // ✅ Chỉ update state khi có thay đổi đáng kể
                    if (hasSignificantChange(userLocation, coords)) {
                        setUserLocation(coords)
                        lastUpdateRef.current = now
                    }

                    // ✅ Chỉ di chuyển camera lần đầu tiên
                    if (isFirstLocationRef.current) {
                        cameraRef.current?.setCamera({
                            centerCoordinate: coords,
                            zoomLevel: CAMERA_CONFIG.zoomLevel,
                            animationDuration: CAMERA_CONFIG.animationDuration,
                        })
                        isFirstLocationRef.current = false
                    }
                    // ⚠️ QUAN TRỌNG: Không gọi moveTo() hoặc flyTo() trong watchPosition
                    // Đây là nguyên nhân chính gây ra hàng triệu tile requests!
                },
                (err) => console.error(err),
                {
                    enableHighAccuracy: true,
                    // ✅ Tăng distance filter để giảm update frequency
                    distanceFilter: 15, // Chỉ update khi di chuyển > 15m
                    interval: 5000, // Check mỗi 5s
                    fastestInterval: 3000, // Tối thiểu 3s giữa các updates
                },
            )
        }

        requestPermission()

        return () => {
            if (watchId != null) Geolocation.clearWatch(watchId)
        }
    }, [userLocation, hasSignificantChange])

    // ✅ Chỉ di chuyển camera khi user ấn nút, không tự động
    const moveToUserLocation = useCallback(() => {
        // Sử dụng location từ ref (luôn mới nhất) thay vì state
        const currentLocation = userLocationRef.current || userLocation

        if (cameraRef.current && currentLocation) {
            cameraRef.current.setCamera({
                centerCoordinate: currentLocation,
                zoomLevel: 16, // Zoom gần hơn khi user request
                animationDuration: CAMERA_CONFIG.animationDuration,
            })
        }
    }, [userLocation])

    // ✅ Memoize handlers để tránh re-create functions
    const handleNavigateToProfile = useCallback(() => {
        navigation.navigate('PersonalInformationView' as never)
    }, [navigation])

    const handleNavigateToBalance = useCallback(() => {
        navigation.navigate('CheckBalanceView' as never)
    }, [navigation])

    const handleShowWaitingList = useCallback(() => {
        if (authData?.user?.partner?.profile?.isOnline === true) {
            dispatch(
                getOrderAction(
                    { typeService: authData?.user?.partner?.kyc?.choseField },
                    (data: any) => {
                        if (data) {
                            setIsModalVisible(true)
                        }
                    },
                ),
            )
        } else {
            GlobalModalController.showModal({
                title: 'Thất bại',
                description: 'Vui lòng bật trạng thái hoạt động',
                icon: 'fail',
            })
        }
    }, [authData?.user?.partner, dispatch])

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleNavigateToProfile} style={styles.avatarWrapper}>
                <FastImage
                    source={
                        authData?.user?.avatarUrl
                            ? { uri: authData.user.avatarUrl }
                            : img_default_avatar
                    }
                    style={styles.avatar}
                />
                <View style={styles.avatarBorder} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.balanceBox}
                onPress={handleNavigateToBalance}
                activeOpacity={0.8}
            >
                <Text style={[DefaultStyles.textMedium14Black, { color: Colors.whiteFF }]}>
                    Xem số dư
                </Text>
            </TouchableOpacity>

            <View style={styles.switchWrapper}>
                <SwitchButton
                    isActive={isOnline}
                    onChange={(newActive: boolean) => setIsOnline(newActive)}
                />
            </View>
        </View>
    )

    const renderFooter = () => (
        <View style={styles.footer}>
            <TouchableOpacity
                style={styles.waitingBox}
                onPress={handleShowWaitingList}
                activeOpacity={0.8}
            >
                <View style={styles.waitingContent}>
                    <Text style={styles.waitingIcon}>📋</Text>
                    <Text style={[DefaultStyles.textMedium16Black, { color: Colors.whiteFF }]}>
                        Danh sách chờ nhận
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={moveToUserLocation}
                style={styles.meButton}
                activeOpacity={0.8}
            >
                <View style={styles.meButtonInner}>
                    <Text style={styles.meIcon}>📍</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView style={[DefaultStyles.container]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* ✅ Sử dụng MemoizedMapView với config tối ưu */}
            <MemoizedMapView userLocation={userLocation} cameraRef={cameraRef} />

            {renderHeader()}
            {renderFooter()}

            <CustomModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                configHeight={0.85}
            >
                <ListOrderView />
            </CustomModal>
        </SafeAreaView>
    )
}

export default HomeView

const styles = StyleSheet.create({
    map: { flex: 1 },
    userMarker: {
        height: 18,
        width: 18,
        backgroundColor: Colors.primary300,
        borderRadius: 9,
        borderColor: '#fff',
        borderWidth: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        position: 'absolute',
        top: scaleModerate(40),
        left: scaleModerate(16),
        right: scaleModerate(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        height: scaleModerate(48),
        width: scaleModerate(48),
        borderRadius: scaleModerate(24),
        borderWidth: 3,
        borderColor: Colors.whiteFF,
    },
    avatarBorder: {
        position: 'absolute',
        height: scaleModerate(48),
        width: scaleModerate(48),
        borderRadius: scaleModerate(24),
        borderWidth: 2,
        borderColor: Colors.primary300,
        top: 0,
        left: 0,
    },
    balanceBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scaleModerate(24),
        backgroundColor: Colors.primary,
        marginHorizontal: scaleModerate(10),
        paddingVertical: scaleModerate(12),
        paddingHorizontal: scaleModerate(14),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    balanceIcon: {
        fontSize: 18,
        marginRight: scaleModerate(8),
    },
    switchWrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 5,
        borderRadius: scaleModerate(20),
    },
    footer: {
        position: 'absolute',
        bottom: scaleModerate(16),
        left: scaleModerate(16),
        right: scaleModerate(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    waitingBox: {
        flex: 1,
        height: scaleModerate(44),
        borderRadius: scaleModerate(28),
        backgroundColor: Colors.primary,
        marginRight: scaleModerate(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 10,
    },
    waitingContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scaleModerate(20),
    },
    waitingIcon: {
        fontSize: 20,
        marginRight: scaleModerate(10),
    },
    meButton: {
        height: scaleModerate(48),
        width: scaleModerate(48),
        borderRadius: scaleModerate(28),
        backgroundColor: Colors.whiteAE,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    meButtonInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    meIcon: {
        fontSize: 20,
    },
})
