import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'

const JudicialRecordView = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header isBack title="Lý lịch tư pháp" />
            <View style={{ backgroundColor: Colors.blueB9 }}></View>
        </SafeAreaView>
    )
}

export default JudicialRecordView

const styles = StyleSheet.create({})
