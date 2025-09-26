import { StyleSheet, FlatList, View, Text } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTranslation } from 'react-i18next'
import HeaderV2 from '../../components/HeaderV2'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import { scaleModerate } from '../../../styles/scaleDimensions'
import EmptyView from '../../components/EmptyView'

const YourOrderView = ({ route }: any) => {
    const { t } = useTranslation()

    return (
        <View style={DefaultStyles.container}>
            <EmptyView />
        </View>
    )
}

export default YourOrderView

const styles = StyleSheet.create({
    content: {
        width: '100%',
        padding: scaleModerate(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
