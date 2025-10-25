import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Header from '../components/Header'
import TabTransaction from './TabTransaction'

const InComeView = () => {
    return (
        <SafeAreaView style={DefaultStyles.container} edges={['top']}>
            <Header title="Thu Nhập Cá Nhân" />
            <TabTransaction />
            {/* <View style={{ flex: 1, borderWidth: 1 }}></View> */}
        </SafeAreaView>
    )
}

export default InComeView

const styles = StyleSheet.create({})
