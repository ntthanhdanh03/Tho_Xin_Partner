import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import React, { useState } from 'react'
import { scaleModerate } from '../../styles/scaleDimensions'
import { useTranslation } from 'react-i18next'
import Picker from './Picker'
import { ic_en, ic_vi } from '../../assets'
import FastImage from 'react-native-fast-image'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { Colors } from '../../styles/Colors'

const LanguageView = () => {
    const { i18n, t } = useTranslation()
    const [lang, setLang] = useState(i18n.language)
    const [showPicker, setShowPicker] = useState(false)

    return (
        <View>
            <TouchableOpacity
                style={styles.wrap}
                onPress={() => {
                    setShowPicker(true)
                }}
            >
                {lang === 'en' ? (
                    <View style={[styles.languageButton]}>
                        <Text
                            style={{
                                ...DefaultStyles.textBold12Black,
                                color: Colors.primary,
                                fontSize: 11,
                                fontWeight: 'bold',
                            }}
                        >
                            EN
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.languageButton]}>
                        <Text
                            style={{
                                ...DefaultStyles.textBold12Black,
                                color: Colors.primary,
                                fontSize: 11,
                                fontWeight: 'bold',
                            }}
                        >
                            VN
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
            <Picker
                isVisible={showPicker}
                title={t('chooseLanguage')}
                data={[
                    { key: 'vi', name: 'Tiếng Việt' },
                    { key: 'en', name: 'English' },
                ]}
                onSelect={(item: any) => {
                    setLang(item?.key)
                    i18n.changeLanguage(item?.key)
                }}
                onClose={() => {
                    setShowPicker(false)
                }}
            />
        </View>
    )
}

export default LanguageView

const styles = StyleSheet.create({
    wrap: {},
    languageButton: {
        height: scaleModerate(30),
        aspectRatio: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        paddingHorizontal: scaleModerate(6),
        paddingVertical: 6,
        borderWidth: scaleModerate(1),
        borderColor: Colors.gray44,
    },
})
