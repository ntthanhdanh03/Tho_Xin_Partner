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
import AppointmentInProgressView from '../views/appointment/AppointmentInProgressView'

const WorkingStack = createNativeStackNavigator()

const WorkingInProgressStack = () => {
    return (
        <WorkingStack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={'AppointmentInProgressView'}
        >
            <WorkingStack.Screen
                name="AppointmentInProgressView"
                component={AppointmentInProgressView}
            />
            <WorkingStack.Screen name="ChatViewVer2" component={ChatViewVer2} />
        </WorkingStack.Navigator>
    )
}

export default WorkingInProgressStack

const styles = StyleSheet.create({})
