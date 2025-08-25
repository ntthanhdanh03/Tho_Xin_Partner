import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../../styles/Colors'
import Header from '../components/Header'
import Spacer from '../components/Spacer'
import { scaleModerate } from '../../styles/scaleDimensions'
import Button from '../components/Button'
import FastImage from 'react-native-fast-image'
import { ic_balence, ic_calendar } from '../../assets'
import Input from '../components/Input'
import DateSelection from '../components/DateSelection'
import Selection from '../components/Selection'
import { GENDER } from '../../constants/Constants'

const IdentityChipView = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header isBack title="CCCD gắn chip" />
            <Spacer height={2} />
            <ScrollView>
                <View style={DefaultStyles.wrapBody}>
                    <Text style={DefaultStyles.textBold12Black}>THÔNG TIN CƠ BẢN</Text>
                    <Spacer height={10} />
                    <Input title="CCCD GẮN CHIP / CCCD / CMND" />
                    <Spacer height={16} />
                    <DateSelection title="Ngày hết hạn" maximumDate="yes" />
                    <Spacer height={16} />
                    <DateSelection dob="yes" title="Ngày sinh" />
                    <Spacer height={16} />
                    <Selection title="Giới tính" data={GENDER} />
                </View>
                <Spacer height={10} />
                <View style={{ backgroundColor: Colors.yellow00 }}>
                    <View
                        style={{
                            marginHorizontal: scaleModerate(16),
                            paddingVertical: scaleModerate(10),
                        }}
                    >
                        <Text style={DefaultStyles.textMedium13Black}>
                            Giấy tờ phải chụp 4 góc và rõ nét
                        </Text>
                        <Spacer height={6} />
                        <Text style={DefaultStyles.textMedium13Black}>
                            Hình ảnh bắt buộc phải xoay ngang
                        </Text>
                    </View>
                </View>
                <Spacer height={8} />
                <View style={DefaultStyles.wrapBody}>
                    <View>
                        {[
                            { image: ic_calendar, label: 'Chụp mặt trước' },
                            { image: ic_balence, label: 'Chụp mặt sau' },
                        ].map((item, index) => (
                            <React.Fragment key={index}>
                                <View style={styles.imageBox}>
                                    <FastImage
                                        source={item.image}
                                        style={styles.image}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                    <Text
                                        style={[
                                            DefaultStyles.textBold14Black,
                                            { color: Colors.purple8D },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </View>
                                {index === 0 && <Spacer height={8} />}
                            </React.Fragment>
                        ))}
                    </View>
                    <Spacer height={10} />
                    <Button title="Lưu" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default IdentityChipView

const styles = StyleSheet.create({
    imageBox: {
        width: '100%',
        height: scaleModerate(170),
        backgroundColor: Colors.grayF5,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.border01,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: scaleModerate(70),
        height: scaleModerate(70),
        borderRadius: 10,
    },
})
