import { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSelector } from 'react-redux'

import BottomTab from './BottomTab'
import RegisterStaffView from '../views/registerService/RegisterStaffView'
import JudicialRecordView from '../views/registerService/JudicialRecordView'
import IdentityChipView from '../views/registerService/IdentityChipView'
import OwnerVerificationView from '../views/registerService/OwnerVerificationView'
import CCCDCameraView from '../views/registerService/CCCDCameraView'
import UploadAvatarView from '../views/registerService/UploadAvatarView'
import ChoseFieldView from '../views/registerService/ChoseFieldView'
import PersonalInformationView from '../views/profile/PersonalInformationView'
import ListOrderView from '../views/home/ListOrderView'
import YourOrderView from '../views/home/tab/YourOrderView'
import OrderWaitingPartnerView from '../views/home/tab/OrderWaitingPartnerView'
import DetailOrderView from '../views/home/DetailOrderView'
import OrderApplicantView from '../views/home/tab/OrderApplicantView'
import ChatViewVer2 from '../views/chat/ChatViewVer2'
import AppointmentInProgressView from '../views/appointment/AppointmentInProgress1View'

const InStack = createNativeStackNavigator()

const InsideStack = () => {
    const { data: authData } = useSelector((store: any) => store.auth)
    const { data: appointmentData } = useSelector((store: any) => store.appointment)
    const [initialRoute, setInitialRoute] = useState<string | null>(null)

    useEffect(() => {
        const status = authData?.user?.partner?.kyc?.approved
        if (status === 'APPROVED' || status === 'WAITING') {
            setInitialRoute('BottomTab')
        } else if (status === 'PENDING') {
            setInitialRoute('RegisterStaffView')
        }
    }, [authData])

    useEffect(() => {
        if (
            Array.isArray(appointmentData?.appointmentInProgress) &&
            appointmentData.appointmentInProgress.length > 0
        ) {
            setInitialRoute('AppointmentInProgressView')
        }
    }, [appointmentData])

    if (!initialRoute) return null

    return (
        <InStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <InStack.Screen name="BottomTab" component={BottomTab} />
            <InStack.Screen name="RegisterStaffView" component={RegisterStaffView} />
            <InStack.Screen name="JudicialRecordView" component={JudicialRecordView} />
            <InStack.Screen name="IdentityChipView" component={IdentityChipView} />
            <InStack.Screen name="OwnerVerificationView" component={OwnerVerificationView} />
            <InStack.Screen name="CCCDCameraScreen" component={CCCDCameraView} />
            <InStack.Screen name="UploadAvatarView" component={UploadAvatarView} />
            <InStack.Screen name="ChoseFieldView" component={ChoseFieldView} />
            <InStack.Screen name="PersonalInformationView" component={PersonalInformationView} />

            <InStack.Screen name="ListOrderView" component={ListOrderView} />
            <InStack.Screen name="YourOrderView" component={YourOrderView} />
            <InStack.Screen name="OrderWaitingPartnerView" component={OrderWaitingPartnerView} />
            <InStack.Screen name="OrderApplicantView" component={OrderApplicantView} />
            <InStack.Screen name="DetailOrderView" component={DetailOrderView} />
            <InStack.Screen name="ChatViewVer2" component={ChatViewVer2} />
        </InStack.Navigator>
    )
}

export default InsideStack
