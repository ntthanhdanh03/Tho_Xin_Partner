import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Spacer from '../components/Spacer'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { ic_balence, img_default_avatar } from '../../assets'
import FastImage from 'react-native-fast-image'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import LanguageView from '../components/LanguageView'
import { useNavigation } from '@react-navigation/native'
import PhotoOptionsPicker from '../components/PhotoOptionsPicker'
import GlobalModalController from '../components/GlobalModal/GlobalModalController'
import VersionCheck from 'react-native-version-check'
import { SafeAreaView } from 'react-native-safe-area-context'
import { REQUIRED_DOCUMENTS } from '../../constants/Constants'
import ItemDocumentRequirement from '../registerService/components/itemDocumentRequirement'

const PersonalInformationView = () => {
    const navigation = useNavigation<any>()
    const { data: authData } = useSelector((store: any) => store.auth)

    const handleNavigateToDocument = (doc: any) => {
        let params = {}

        switch (doc.id) {
            case 'identity_chip':
                params = {
                    auth: true,
                }
                break
            case 'judicial_record':
                params = {
                    auth: true,
                }
                break
            case 'owner_verification':
                params = {
                    auth: true,
                }
                break
            case 'avt_view':
                params = {
                    auth: true,
                }
                break
            case 'chose_field_view':
                params = {
                    auth: true,
                }
                break
        }
        navigation.navigate(doc.navigationTo, params)
    }
    return (
        <SafeAreaView style={DefaultStyles.container} edges={['top']}>
            <Header
                title={'Hồ sơ của tôi'}
                isBack
                renderRight={() => (
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.border01,
                            borderRadius: 25,
                        }}
                    ></View>
                )}
            />
            <View>
                {REQUIRED_DOCUMENTS.map((doc, index) => (
                    <ItemDocumentRequirement
                        key={doc.id}
                        label={doc.label}
                        navigationTo={doc.navigationTo}
                        index={index}
                        approved={authData?.user?.partner?.kyc?.approved}
                        onPress={() => handleNavigateToDocument(doc)}
                    />
                ))}
            </View>
            <ScrollView style={[DefaultStyles.wrapBody, { flex: 1 }]}></ScrollView>
        </SafeAreaView>
    )
}

export default PersonalInformationView

const styles = StyleSheet.create({})
