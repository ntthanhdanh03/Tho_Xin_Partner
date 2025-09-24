// CCCDCameraScreen.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Alert,
    StatusBar,
    Platform,
} from 'react-native'
import {
    Camera,
    useCameraDevices,
    useCameraPermission,
    PhotoFile,
    TakePhotoOptions,
    useCameraDevice,
} from 'react-native-vision-camera'

import { useNavigation, RouteProp, useIsFocused } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import { DefaultStyles } from '../../styles/DefaultStyles'
import FastImage from 'react-native-fast-image'
import { ic_chevron_left } from '../../assets'
import HeaderV2 from '../components/HeaderV2'
import { SafeAreaView } from 'react-native-safe-area-context'
import { uploadKycPhoto } from '../../services/uploadKycPhoto '
import LoadingView from '../components/LoadingView'

const { width, height } = Dimensions.get('window')

interface RouteParams {
    type?: 'front' | 'back'
    title?: string
    onCapture?: (photo: PhotoFile) => void
}

interface Props {
    route?: RouteProp<{ params: RouteParams }, 'params'>
}

const CCCDCameraScreen: React.FC<Props> = ({ route }) => {
    const navigation = useNavigation()
    const camera = useRef<Camera>(null)
    const { hasPermission, requestPermission } = useCameraPermission()
    const isFocused = useIsFocused()

    const [isActive, setIsActive] = useState(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { title = 'Chụp mặt trước', onCapture } = route?.params || {}

    const device = useCameraDevice('back')

    useEffect(() => {
        if (!hasPermission) {
            requestPermission()
        }
    }, [hasPermission, requestPermission])

    useEffect(() => {
        setIsActive(isFocused)
    }, [isFocused])

    const takePicture = useCallback(async () => {
        setIsLoading(true)
        if (camera.current && device) {
            try {
                const options: TakePhotoOptions = {}
                const photo = await camera.current.takePhoto(options)

                const field =
                    route?.params?.type === 'front' ? 'idCardFrontImageUrl' : 'idCardBackImageUrl'

                // upload ảnh lên backend
                const uploaded = await uploadKycPhoto(photo, field)
                console.log('Uploaded photo:', uploaded)

                if (uploaded?.url && onCapture) {
                    onCapture({
                        uri: uploaded.url,
                        width: photo.width,
                        height: photo.height,
                    } as any)
                }
                setIsLoading(false)
                navigation.goBack()
            } catch (error) {
                console.log('Error taking picture:', error)
                setIsLoading(false)
                Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.')
            }
        }
    }, [onCapture, navigation, device, route?.params?.title])

    if (!hasPermission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Cần quyền truy cập camera</Text>
                <TouchableOpacity style={styles.retryButton} onPress={requestPermission}>
                    <Text style={styles.retryButtonText}>Cấp quyền</Text>
                </TouchableOpacity>
            </View>
        )
    }
    if (!device) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Không tìm thấy camera</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={DefaultStyles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="black" />
            <LoadingView loading={isLoading} />
            <Camera
                ref={camera}
                style={styles.camera}
                device={device}
                isActive={isActive}
                photo={true}
                video={false}
                audio={false}
            />

            <View style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FastImage source={ic_chevron_left} style={{ width: 24, height: 24 }} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity></TouchableOpacity>
                </View>

                <View style={styles.frameContainer}>
                    <View style={styles.frameOverlay}>
                        <View style={styles.overlayTop} />

                        <View style={styles.overlayMiddle}>
                            <View style={styles.overlaySide} />
                            <View style={styles.cccdFrame}></View>
                            <View style={styles.overlaySide} />
                        </View>

                        <View style={styles.overlayBottom} />
                    </View>
                </View>

                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>Đặt CCCD vào trong khung và chụp ảnh</Text>
                    <Text style={styles.subInstructionText}>
                        Đảm bảo thẻ nằm gọn trong khung và hình ảnh rõ nét
                    </Text>
                </View>

                <View style={styles.bottomControls}>
                    <View style={styles.captureButtonContainer}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                            activeOpacity={0.8}
                        >
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    title: {
        ...DefaultStyles.textBold16White,
        paddingRight: 24,
    },

    frameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    frameOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlayTop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    overlayMiddle: {
        flexDirection: 'row',
        height: 200,
    },
    overlaySide: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    cccdFrame: {
        width: width * 0.95,
        height: 200,
        borderWidth: 2,
        borderColor: Colors.whiteAE,
        borderRadius: 12,
        position: 'relative',
    },

    overlayBottom: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    instructionContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    instructionText: {
        textAlign: 'center',
        marginBottom: 8,
        ...DefaultStyles.textBold14White,
    },
    subInstructionText: {
        ...DefaultStyles.textRegular12Gray,
        color: Colors.whiteAE,
    },
    bottomControls: {
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    },
    captureButtonContainer: {
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingHorizontal: 20,
    },
    permissionText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
})

export default CCCDCameraScreen
