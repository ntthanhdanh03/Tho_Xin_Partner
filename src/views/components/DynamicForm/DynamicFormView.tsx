import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import Header from '../Header'
import DynamicForm from './DynamicForm'
import Button from '../Button'
import Spacer from '../Spacer'
import CheckBox from '../CheckBox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FastImage from 'react-native-fast-image'
import ImageView from 'react-native-image-viewing'

const TEST_DATA = [
    {
        title: 'Name',
        fieldName: 'name',
        type: 'textInput',
        isRequired: true,
        isDisabled: false,
        row: 1,
        column: 1,
        style: '',
        defaultValue: '1',
    },
    {
        title: 'Gender',
        fieldName: 'gender',
        type: 'selection',
        isRequired: true,
        isDisabled: false,
        row: 2,
        column: 1,
        style: '',
    },
    {
        title: 'Day Of Birth',
        fieldName: 'dob',
        type: 'dateSelection',
        isRequired: false,
        isDisabled: false,
        row: 2,
        column: 2,
        style: '',
    },
    {
        title: 'Note',
        fieldName: 'note',
        type: 'textArea',
        isRequired: false,
        isDisabled: false,
        row: 3,
        column: 1,
        style: '',
    },
    {
        title: 'Check A',
        fieldName: 'checkA',
        type: 'checkBox',
        isRequired: false,
        isDisabled: false,
        row: 4,
        column: 1,
        style: '',
    },
    {
        title: 'Check B',
        fieldName: 'checkB',
        type: 'checkBox',
        isRequired: false,
        isDisabled: false,
        row: 4,
        column: 2,
        style: '',
    },
    {
        title: 'Check C',
        fieldName: 'checkC',
        type: 'checkBox',
        isRequired: false,
        isDisabled: false,
        row: 4,
        column: 3,
        style: '',
    },
    {
        title: 'Title here',
        type: 'text',
        row: 5,
        column: 1,
        style: '',
    },
    {
        title: 'Title here 2 abc 1243. Title here 2 abc 1243',
        type: 'text',
        row: 5,
        column: 2,
        style: '',
    },
]

const DynamicFormView = () => {
    const { t } = useTranslation()
    const navigation = useNavigation()
    const formRef = useRef<any>()
    const images = [
        {
            uri: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4',
        },
        {
            uri: 'https://images.unsplash.com/photo-1573273787173-0eb81a833b34',
        },
        {
            uri: 'https://images.unsplash.com/photo-1569569970363-df7b6160d111',
        },
    ]

    const [visible, setIsVisible] = useState(false)

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <Header title={t('dynamicForm')} />
            <KeyboardAwareScrollView style={[DefaultStyles.wrapBody]}>
                {/* <Spacer height={250} /> */}
                <DynamicForm schema={TEST_DATA} ref={formRef} />
                <Button
                    title="Save"
                    onPress={() => {
                        console.log('data', formRef?.current?.getData())
                    }}
                />
                <Spacer height={20} />
                <TouchableOpacity
                    style={{ flexDirection: 'row', gap: 10 }}
                    onPress={() => setIsVisible(true)}
                >
                    <FastImage source={images[0]} style={{ height: 100, aspectRatio: 1 }} />
                    <FastImage source={images[1]} style={{ height: 100, aspectRatio: 1 }} />
                    <FastImage source={images[2]} style={{ height: 100, aspectRatio: 1 }} />
                </TouchableOpacity>
            </KeyboardAwareScrollView>
            <ImageView
                images={images}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
        </SafeAreaView>
    )
}

export default DynamicFormView

const styles = StyleSheet.create({})
