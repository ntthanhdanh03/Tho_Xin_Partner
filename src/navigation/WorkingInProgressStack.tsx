import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginView from '../views/auth/LoginView'
import LoginViewPW from '../views/auth/LoginViewPW'
import ForgotPasswordView from '../views/auth/ForgotPasswordView'
import ResetPasswordView from '../views/auth/ResetPasswordView'
import RegisterStaffView from '../views/registerService/RegisterStaffView'
import JudicialRecordView from '../views/registerService/JudicialRecordView'
import IdentityChipView from '../views/registerService/IdentityChipView'
import OwnerVerificationView from '../views/registerService/OwnerVerificationView'
import RegisterOTPView from '../views/auth/RegisterOTPView'
import NewPasswordView from '../views/auth/NewPasswordView'
import AppointmentInProgress1View from '../views/appointment/AppointmentInProgress1View'
import ChatViewVer2 from '../views/chat/ChatViewVer2'
import AppointmentInProgress2View from '../views/appointment/AppointmentInProgress2View'
import AppointmentInProgress3View from '../views/appointment/AppointmentInProgress3View'
import AppointmentInProgress4View from '../views/appointment/AppointmentInProgress4View'
import AppointmentInProgress5View from '../views/appointment/AppointmentInProgress5View'

const WorkingStack = createNativeStackNavigator()

const WorkingInProgressStack = ({ route }: any) => {
    const { status } = route.params || {}

    const screenByStatus: Record<number, string> = {
        1: 'AppointmentInProgress1View',
        2: 'AppointmentInProgress2View',
        3: 'AppointmentInProgress3View',
        4: 'AppointmentInProgress4View',
        5: 'AppointmentInProgress5View',
    }

    const initialScreen = screenByStatus[status] || 'AppointmentInProgress1View'

    return (
        <WorkingStack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={initialScreen}
        >
            <WorkingStack.Screen
                name="AppointmentInProgress1View"
                component={AppointmentInProgress1View}
            />
            <WorkingStack.Screen
                name="AppointmentInProgress2View"
                component={AppointmentInProgress2View}
            />
            <WorkingStack.Screen
                name="AppointmentInProgress3View"
                component={AppointmentInProgress3View}
            />
            <WorkingStack.Screen
                name="AppointmentInProgress4View"
                component={AppointmentInProgress4View}
            />
            <WorkingStack.Screen
                name="AppointmentInProgress5View"
                component={AppointmentInProgress5View}
            />
            <WorkingStack.Screen name="ChatViewVer2" component={ChatViewVer2} />
        </WorkingStack.Navigator>
    )
}

export default WorkingInProgressStack

const styles = StyleSheet.create({})
