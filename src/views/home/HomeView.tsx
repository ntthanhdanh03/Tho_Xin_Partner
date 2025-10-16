import React, { useDebugValue, useEffect, useRef, useState } from 'react'
import {
    DeviceEventEmitter,
    Dimensions,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
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

MapboxGL.setAccessToken(
    'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A',
)

const HomeView = () => {
    const { data: authData } = useSelector((store: any) => store.auth)
    const { data: appointmentData } = useSelector((store: any) => store.appointment)
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isOnline, setIsOnline] = useState(false)
    const cameraRef = useRef<MapboxGL.Camera>(null)
    const navigation = useNavigation()
    const dispatch = useDispatch()

    useEffect(() => {
        const runSocket = async () => {
            if (isOnline) {
                SocketUtil.connect(authData?.user?._id, 'partner')
            } else {
                SocketUtil.disconnect()
            }
        }

        runSocket()
    }, [isOnline])

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
                    const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude]
                    setUserLocation(coords)
                    cameraRef.current?.moveTo(coords, 500)
                },
                (err) => console.error(err),
                {
                    enableHighAccuracy: true,
                    distanceFilter: 0.5,
                    interval: 1000,
                    fastestInterval: 2000,
                },
            )
        }

        requestPermission()

        return () => {
            if (watchId != null) Geolocation.clearWatch(watchId)
        }
    }, [])

    const moveToUserLocation = () => {
        if (cameraRef.current && userLocation) {
            cameraRef.current.flyTo(userLocation, 1000)
        }
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => navigation.navigate('PersonalInformationView' as never)}
                style={styles.avatarWrapper}
            >
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
                onPress={() => {
                    navigation.navigate('CheckBalanceView' as never)
                }}
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
                onPress={() => {
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
                }}
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
            <MapboxGL.MapView style={styles.map}>
                {userLocation && (
                    <>
                        <MapboxGL.Camera
                            ref={cameraRef}
                            zoomLevel={14}
                            centerCoordinate={userLocation}
                            animationMode="flyTo"
                            animationDuration={2000}
                        />
                        <MapboxGL.PointAnnotation id="userMarker" coordinate={userLocation}>
                            <View style={styles.userMarker} />
                        </MapboxGL.PointAnnotation>
                    </>
                )}
            </MapboxGL.MapView>

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
        bottom: scaleModerate(30),
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
        backgroundColor: Colors.primary300,
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
        fontSize: 24,
    },
})
