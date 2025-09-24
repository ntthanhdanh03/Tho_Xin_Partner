import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'
import { scaleModerate } from '../../styles/scaleDimensions'
import PhotoOptionsPicker from '../components/PhotoOptionsPicker'
import Spacer from '../components/Spacer'
import { uploadKycPhoto } from '../../services/uploadKycPhoto '
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Selection from '../components/Selection'
import { FIELD, GENDER } from '../../constants/Constants'

const HistoryOderView = () => {
    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Lịch Sử Đơn Hàng" />
        </SafeAreaView>
    )
}

export default HistoryOderView

const styles = StyleSheet.create({})
