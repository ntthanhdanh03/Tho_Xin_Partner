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

const InStack = createNativeStackNavigator()

const InsideStack = () => {
    const { data: authData } = useSelector((store: any) => store.auth)
    const [initialRoute, setInitialRoute] = useState<string | null>(null)

    useEffect(() => {
        const status = authData?.user?.partner?.kyc?.approved

        if (status === 'APPROVED') {
            setInitialRoute('BottomTab')
        } else if (status === 'WAITING') {
            setInitialRoute('BottomTab')
        } else if (status === 'PENDING') {
            setInitialRoute('RegisterStaffView')
        } else {
            setInitialRoute('RegisterStaffView')
        }
    }, [authData])

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
        </InStack.Navigator>
    )
}

export default InsideStack
