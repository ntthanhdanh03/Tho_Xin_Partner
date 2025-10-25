import { StyleSheet, FlatList, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useTranslation } from 'react-i18next'
import HeaderV2 from '../components/HeaderV2'
import Tab from '../components/Tab'
import TransactionWeekView from './TransactionWeekView'
import TransactionMonthView from './TransactionMonthView'

const TabTransaction = ({ route }: any) => {
    const { t } = useTranslation()
    const [selectedTab, setSelectedTab] = useState<string>('tab1')
    const tabData = [
        { key: 'tab1', value: t('Thu nhập tuần') },
        { key: 'tab2', value: t('Thu nhập tháng') },
    ]

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'tab1':
                return <TransactionWeekView />
            case 'tab2':
                return <TransactionMonthView />
            default:
                return null
        }
    }
    return (
        <View style={DefaultStyles.container}>
            <Tab
                type="full"
                data={tabData}
                selectedTab={selectedTab}
                onTabChange={(key) => {
                    setSelectedTab(key)
                }}
            />

            {renderTabContent()}
        </View>
    )
}

export default TabTransaction

const styles = StyleSheet.create({})
