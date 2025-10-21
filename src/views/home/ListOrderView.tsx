import { StyleSheet, FlatList, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useTranslation } from 'react-i18next'
import HeaderV2 from '../components/HeaderV2'
import Tab from '../components/Tab'

import Spacer from '../components/Spacer'

import { scaleModerate } from '../../styles/scaleDimensions'
import OrderWaitingPartnerView from './tab/OrderWaitingPartnerView'
import YourOrderView from './tab/YourOrderView'
import OrderApplicantView from './tab/OrderApplicantView'

const ListOrderView = ({ route }: any) => {
    const { t } = useTranslation()
    const [selectedTab, setSelectedTab] = useState<string>('tab1')
    const listRef = useRef<FlatList>(null)
    const tabData = [
        { key: 'tab1', value: t('Đơn Chờ') },
        { key: 'tab2', value: t('Đơn đã báo giá') },
        // { key: 'tab3', value: t('Đơn của bạn') },
    ]

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'tab1':
                return <OrderWaitingPartnerView />
            case 'tab2':
                return <OrderApplicantView />
            // case 'tab3':
            //     return <YourOrderView />
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

export default ListOrderView

const styles = StyleSheet.create({
    content: {
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
