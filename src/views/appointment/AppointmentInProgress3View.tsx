import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import FastImage from 'react-native-fast-image'

import { DefaultStyles } from '../../styles/DefaultStyles'
import { Colors } from '../../styles/Colors'
import { ic_balence } from '../../assets'

import Spacer from '../components/Spacer'
import Input from '../components/Input'
import PhotoOptionsPicker from '../components/PhotoOptionsPicker'
import Header from '../components/Header'
import Button from '../components/Button'

import { updateAppointmentAction } from '../../store/actions/appointmentAction'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import { uploadKycPhoto } from '../../services/uploadKycPhoto '
import LoadingWaitingApproveView from '../components/LoadingWaitingApproveView'

const AppointmentInProgress3View = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { data: appointmentData } = useSelector((store: any) => store.appointment)

    const [laborCost, setLaborCost] = useState<number>(0)
    const [additionalIssues, setAdditionalIssues] = useState<
        { note: string; images: string[]; cost: number }[]
    >([])

    const [currentIssueIndex, setCurrentIssueIndex] = useState<number | null>(null)
    const [showCameraOption, setShowCameraOption] = useState(false)

    const totalPartsCost = additionalIssues.reduce((sum, issue) => sum + (issue.cost || 0), 0)
    const grandTotal = laborCost + totalPartsCost
    const agreedPrice = appointmentData?.appointmentInProgress[0]?.agreedPrice || 0
    const difference = grandTotal - agreedPrice
    const [loading, setLoading] = useState(false)

    const handleUploadPhoto = async (image: any, issueIndex?: number) => {
        const uploadedUrl = await uploadKycPhoto(image, 'imageService')
        if (uploadedUrl && issueIndex !== undefined) {
            setAdditionalIssues((prev) => {
                const newIssues = [...prev]
                newIssues[issueIndex].images = [
                    ...(newIssues[issueIndex].images || []),
                    uploadedUrl.url,
                ]
                return newIssues
            })
        }
    }

    const handleAddIssue = () => {
        setAdditionalIssues((prev) => [...prev, { note: '', images: [], cost: 0 }])
    }

    const handleConfirm = () => {
        console.log(appointmentData?.appointmentInProgress)
        if (difference !== 0) {
            GlobalModalController.showModal({
                title: 'Không thể bàn giao',
                description: `Tổng tiền (${grandTotal.toLocaleString(
                    'vi-VN',
                )} VND) không khớp với giá thỏa thuận (${agreedPrice.toLocaleString('vi-VN')} VND)`,
                icon: 'fail',
            })
            return
        }

        const postData = { additionalIssues, laborCost: laborCost }
        const typeUpdate = 'APPOINTMENT_UPDATE_IN_PROGRESS'
        const dataUpdate = {
            id: appointmentData.appointmentInProgress[0]._id,
            typeUpdate,
            postData,
        }

        dispatch(
            updateAppointmentAction(dataUpdate, (data: any) => {
                if (data) {
                    setLoading(true)
                }
            }),
        )
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Tiến hành sửa chữa" />

            <ScrollView style={{ ...DefaultStyles.wrapBody, flex: 1 }}>
                <Spacer height={10} />

                <Input
                    title="Tiền công"
                    containerStyle={{ width: '100%' }}
                    keyboardType="numeric"
                    value={laborCost ? laborCost.toLocaleString('vi-VN') : ''}
                    onChangeText={(txt) => {
                        const numeric = txt.replace(/\D/g, '')
                        setLaborCost(numeric ? parseInt(numeric, 10) : 0)
                    }}
                />

                <Spacer height={10} />

                <View style={styles.sectionHeader}>
                    <Text style={DefaultStyles.textBold14Black}>Phát sinh / Phụ tùng</Text>
                    <TouchableOpacity onPress={handleAddIssue}>
                        <Text style={styles.addIssueText}>+ Thêm phụ tùng</Text>
                    </TouchableOpacity>
                </View>

                {additionalIssues.map((issue, index) => (
                    <View key={index} style={styles.issueBox}>
                        <TouchableOpacity
                            style={styles.removeBtn}
                            onPress={() =>
                                setAdditionalIssues((prev) => prev.filter((_, i) => i !== index))
                            }
                        >
                            <Text style={styles.removeText}>×</Text>
                        </TouchableOpacity>

                        <Input
                            title={`Ghi chú phụ tùng ${index + 1}`}
                            area
                            value={issue.note}
                            onChangeText={(txt) => {
                                setAdditionalIssues((prev) => {
                                    const newIssues = [...prev]
                                    newIssues[index].note = txt
                                    return newIssues
                                })
                            }}
                        />

                        <Spacer height={10} />

                        <Input
                            title={`Chi phí phụ tùng ${index + 1}`}
                            keyboardType="numeric"
                            value={issue.cost ? issue.cost.toLocaleString('vi-VN') : ''}
                            onChangeText={(txt) => {
                                const raw = txt.replace(/\D/g, '')
                                setAdditionalIssues((prev) => {
                                    const newIssues = [...prev]
                                    newIssues[index].cost = raw ? Number(raw) : 0
                                    return newIssues
                                })
                            }}
                        />

                        <Spacer height={10} />

                        <Text style={{ ...DefaultStyles.textBold14Black, marginBottom: 8 }}>
                            Ảnh phụ tùng {index + 1}
                        </Text>
                        <View style={styles.imagesWrapper}>
                            {issue.images.map((img, imgIndex) => (
                                <View key={imgIndex} style={styles.imageBox}>
                                    <FastImage
                                        source={{ uri: img }}
                                        style={styles.capturedImage}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                    <TouchableOpacity
                                        style={styles.deleteBtn}
                                        onPress={() =>
                                            setAdditionalIssues((prev) => {
                                                const newIssues = [...prev]
                                                newIssues[index].images = newIssues[
                                                    index
                                                ].images.filter((_, i) => i !== imgIndex)
                                                return newIssues
                                            })
                                        }
                                    >
                                        <Text style={styles.deleteText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {issue.images.length < 2 && (
                                <TouchableOpacity
                                    style={[styles.imageBox, styles.addBox]}
                                    onPress={() => {
                                        setCurrentIssueIndex(index)
                                        setShowCameraOption(true)
                                    }}
                                >
                                    <FastImage
                                        source={ic_balence}
                                        style={styles.image}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                    <Text style={DefaultStyles.textMedium12Black}>Thêm ảnh</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}

                <Spacer height={20} />
            </ScrollView>

            <View style={styles.footer}>
                <View>
                    <Text style={DefaultStyles.textRegular14Black}>
                        Tiền công: {laborCost.toLocaleString('vi-VN')} VND
                    </Text>
                    <Text style={DefaultStyles.textRegular14Black}>
                        Phụ tùng: {totalPartsCost.toLocaleString('vi-VN')} VND
                    </Text>
                    <Text style={DefaultStyles.textRegular14Black}>
                        Tổng tiền: {grandTotal.toLocaleString('vi-VN')} VND
                    </Text>
                    <Text style={DefaultStyles.textRegular14Black}>
                        Tiền thỏa thuận: {agreedPrice.toLocaleString('vi-VN')} VND
                    </Text>
                    <Text
                        style={{
                            ...DefaultStyles.textRegular14Black,
                            color: difference === 0 ? Colors.green34 : Colors.red30,
                        }}
                    >
                        Chênh lệch: {difference.toLocaleString('vi-VN')} VND
                    </Text>
                </View>

                <Spacer height={10} />

                <View style={{ flexDirection: 'row' }}>
                    <Spacer width={10} />

                    {/* <SwipeButton
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
                    title="Hoàn thành kiểm tra "
                    titleStyles={{ ...DefaultStyles.textBold16Black }}
                    titleColor={Colors.black01}
                    onSwipeSuccess={() => {
                      
                    }}
                /> */}
                    <Button
                        title="Bàn giao"
                        containerStyle={{ width: '100%' }}
                        onPress={handleConfirm}
                    />
                </View>
            </View>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <LoadingWaitingApproveView
                        loading={loading}
                        text="Chờ khách hàng xác nhận trạng thái"
                        onCancel={() => {
                            console.log('Người dùng nhấn Hủy')
                            setLoading(false)
                        }}
                        onConfirm={() => {
                            console.log('Người dùng nhấn Xác nhận')
                            handleConfirm()
                        }}
                    />
                </View>
            )}

            <PhotoOptionsPicker
                isVisible={showCameraOption}
                onSelectPhoto={(image) => {
                    if (currentIssueIndex !== null) {
                        handleUploadPhoto(image, currentIssueIndex)
                    }
                    setShowCameraOption(false)
                    setCurrentIssueIndex(null)
                }}
                onClose={() => setShowCameraOption(false)}
            />
        </SafeAreaView>
    )
}

export default AppointmentInProgress3View

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    issueBox: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.border01,
        borderRadius: 8,
        position: 'relative',
    },
    imagesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageBox: {
        width: 100,
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border01,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    capturedImage: {
        width: '100%',
        height: '100%',
    },
    addBox: {
        backgroundColor: Colors.whiteAE,
    },
    image: {
        width: 36,
        height: 36,
        marginBottom: 4,
    },
    deleteBtn: {
        position: 'absolute',
        top: 5,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    removeBtn: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addIssueText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    footer: {
        borderColor: Colors.border01,
        marginHorizontal: 20,
    },
})
