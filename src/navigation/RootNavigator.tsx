import { AppState, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import OutsideStack from './OutsideStack'
import { navigationRef } from './NavigationService'
import InsideStack from './InsideStack'
import { useSelector } from 'react-redux'

const Stack = createNativeStackNavigator()
const RootNavigator = () => {
    const { data: authData } = useSelector((store: any) => store.auth)
    useEffect(() => {
        if (authData) {
        }
    }, [])
    return (
        <>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: 'none',
                    }}
                >
                    <>
                        {authData ? (
                            <Stack.Screen name="InsideStack" component={InsideStack} />
                        ) : (
                            <Stack.Screen name="OutsideStack" component={OutsideStack} />
                        )}
                    </>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})
