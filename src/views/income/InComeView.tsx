import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Header from '../components/Header'

const InComeView = () => {
    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Thu Nhập Cá Nhân" />
        </SafeAreaView>
    )
}

export default InComeView

const styles = StyleSheet.create({})
