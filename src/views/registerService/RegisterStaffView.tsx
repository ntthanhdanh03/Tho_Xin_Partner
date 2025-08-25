import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import { scaleModerate } from '../../styles/scaleDimensions'
import Header from '../components/Header'

import ItemDocumentRequirement from './components/itemDocumentRequirement'
import { REQUIRED_DOCUMENTS } from '../../constants/Constants'
import Button from '../components/Button'

const RegisterStaffView = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title="Đăng ký trở thành đối tác" />
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: Colors.blueB9 }}>
                    <Text
                        style={[
                            DefaultStyles.textMedium14White,
                            {
                                color: Colors.black01,
                                marginHorizontal: scaleModerate(16),
                                paddingVertical: scaleModerate(10),
                            },
                        ]}
                    >
                        Để tiết kiệm thời gian duyệt hồ sơ. Quý đối tác hãy chuẩn bị trước những
                        loại giấy tờ sau
                    </Text>
                </View>
                <View>
                    {REQUIRED_DOCUMENTS.map((doc, index) => (
                        <ItemDocumentRequirement
                            key={doc.id}
                            label={doc.label}
                            navigationTo={doc.navigationTo}
                            index={index}
                        />
                    ))}
                </View>
            </View>
            <View style={{ padding: scaleModerate(16) }}>
                <Button title="Gửi hồ sơ" />
            </View>
        </SafeAreaView>
    )
}

export default RegisterStaffView

const styles = StyleSheet.create({})
