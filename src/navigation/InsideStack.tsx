import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { scaleModerate } from '../styles/scaleDimensions'
import BottomTab from './BottomTab'
import RegisterStaffView from '../views/registerService/RegisterStaffView'
import JudicialRecordView from '../views/registerService/JudicialRecordView'
import IdentityChipView from '../views/registerService/IdentityChipView'
import OwnerVerificationView from '../views/registerService/OwnerVerificationView'
import { useSelector } from 'react-redux'

const InStack = createNativeStackNavigator()

const InsideStack = () => {
    const { data: authData } = useSelector((store: any) => store.auth)
    return (
        <>
            <InStack.Navigator
                initialRouteName={'BottomTab'}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <>
                    {authData ? (
                        <InStack.Screen name="BottomTab" component={BottomTab} />
                    ) : (
                        <>
                            <InStack.Screen
                                name="RegisterStaffView"
                                component={RegisterStaffView}
                            />
                            <InStack.Screen
                                name="JudicialRecordView"
                                component={JudicialRecordView}
                            />
                            <InStack.Screen name="IdentityChipView" component={IdentityChipView} />
                            <InStack.Screen
                                name="OwnerVerificationView"
                                component={OwnerVerificationView}
                            />
                        </>
                    )}
                </>
            </InStack.Navigator>
        </>
    )
}

export default InsideStack
