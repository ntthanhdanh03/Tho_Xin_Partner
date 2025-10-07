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
import Modal from 'react-native-modal' // 👈 thêm

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
        if (isOnline) {
            SocketUtil.connect(authData?.user?._id, 'partner')
        } else {
            SocketUtil.disconnect()
        }
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
            >
                <FastImage
                    source={
                        authData?.user?.avatarUrl
                            ? { uri: authData.user.avatarUrl }
                            : img_default_avatar
                    }
                    style={styles.avatar}
                />
            </TouchableOpacity>

            <View style={styles.balanceBox}>
                <Text style={[DefaultStyles.textMedium16Black, { color: Colors.whiteAE }]}>
                    Xem số dư
                </Text>
            </View>

            <SwitchButton
                isActive={isOnline}
                onChange={(newActive: boolean) => setIsOnline(newActive)}
            />
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
            >
                <Text style={[DefaultStyles.textMedium16Black, { color: Colors.whiteAE }]}>
                    Danh sách chờ nhận
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={moveToUserLocation} style={styles.meButton}>
                <Text style={{ color: 'white' }}>Me</Text>
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
        backgroundColor: 'blue',
        borderRadius: 9,
        borderColor: '#fff',
        borderWidth: 2,
    },
    header: {
        position: 'absolute',
        margin: 10,
        top: scaleModerate(30),
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignItems: 'center',
    },
    avatar: {
        height: scaleModerate(40),
        width: scaleModerate(40),
        borderRadius: 40,
    },
    balanceBox: {
        height: scaleModerate(40),
        width: '70%',
        borderRadius: 10,
        backgroundColor: Colors.gray44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        position: 'absolute',
        margin: 10,
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
    },
    waitingBox: {
        height: scaleModerate(40),
        width: '70%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.gray44,
    },
    meButton: {
        height: scaleModerate(40),
        width: '15%',
        backgroundColor: Colors.primary,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
