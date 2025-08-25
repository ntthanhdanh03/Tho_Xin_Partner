import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Spacer from '../components/Spacer'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import { TextInput } from 'react-native-paper'
import { ic_balence, ic_calendar } from '../../assets'
import { useDispatch, useSelector } from 'react-redux'
import { checkPhoneExistAction } from '../../store/actions/authAction'
import LoadingView from '../components/LoadingView'

const HomeView = () => {
    return (
        <SafeAreaView style={DefaultStyles.container}>
            <View style={[DefaultStyles.wrapBody, { flex: 1 }]}>
                <Text>HomeView</Text>
            </View>
        </SafeAreaView>
    )
}

export default HomeView

const styles = StyleSheet.create({})
