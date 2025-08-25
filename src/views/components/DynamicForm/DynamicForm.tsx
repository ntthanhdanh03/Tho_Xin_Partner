import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import Input from '../Input'
import { IForm } from '../../../interfaces'
import { defaultField } from '../../../utils/formUtils'
import Button from '../Button'
import Spacer from '../Spacer'
import Selection from '../Selection'
import DateSelection from '../DateSelection'
import _ from 'lodash'
import { scaleModerate } from '../../../styles/scaleDimensions'
import CheckBox from '../CheckBox'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import FastImage from 'react-native-fast-image'

interface IDynamicForm {
    schema: Array<any>
    onSubmit?: any
}
const DynamicForm = React.forwardRef((props: IDynamicForm, ref: any) => {
    const [form, setForm] = useState<IForm>({})
    const [schemaFrom, setSchemaFrom] = useState<any>(props?.schema)

    useEffect(() => {
        if (props?.schema) {
            let initForm: any = {}
            props?.schema?.forEach((item) => {
                if (item?.fieldName) {
                    initForm[item?.fieldName] = {
                        value: item?.value || '',
                        error: false,
                        message: '',
                    }
                }
            })
            setForm(initForm)
        }
    }, [props?.schema])

    useImperativeHandle(ref, () => ({
        getData() {
            if (isValidData()) {
                return form
            }
            return null
        },
        getFormData() {
            const returnForm = [...schemaFrom]
            returnForm.forEach((item) => {
                item.value = form[item?.fieldName]?.value
            })
            return returnForm
        },
        clearForm() {
            setSchemaFrom(props?.schema)
        },
    }))

    const isValidData = () => {
        let isValid = true
        let invalidFields: any = {}
        schemaFrom?.forEach((item: any) => {
            if (item?.isRequired && !form[item?.fieldName]?.value) {
                isValid = false
                invalidFields[item?.fieldName] = { ...form[item?.fieldName], error: true }
            }
        })

        if (invalidFields) {
            setForm({
                ...form,
                ...invalidFields,
            })
        }
        return isValid
    }

    const renderInput = (item: any, index: number) => {
        return (
            <Input
                key={item?.fieldName}
                title={item?.title + (item?.isRequired ? '*' : '')}
                value={form[item?.fieldName]?.value}
                placeholder={item?.placeholder}
                onChangeText={(text) => {
                    setForm({
                        ...form,
                        [item?.fieldName]: { value: text, error: false, message: '' },
                    })
                }}
                error={form[item?.fieldName]?.error}
                message={form[item?.fieldName]?.message}
                keyboardType={item?.type === 'number' ? 'number-pad' : 'default'}
                editable={!item.isDisabled}
                containerStyle={styles.fieldWrap}
            />
        )
    }

    const renderSelection = (item: any, index: number) => {
        return (
            <Selection
                key={item?.fieldName}
                title={item?.title + (item?.isRequired ? '*' : '')}
                data={[
                    { key: 'Nam', name: 'Nam' },
                    { key: 'Nữ', name: 'Nữ' },
                ]}
                onSelect={(selectedItem: any) => {
                    setForm({
                        ...form,
                        [item?.fieldName]: { value: selectedItem?.name, error: false, message: '' },
                    })
                }}
                hasSearch
                keyValue={form[item?.fieldName]?.value}
                error={form[item?.fieldName]?.error}
                containerStyle={styles.fieldWrap}
            />
        )
    }

    const renderTextArea = (item: any, index: number) => {
        return (
            <Input
                key={item?.fieldName}
                title={item?.title + (item?.isRequired ? '*' : '')}
                area
                onChangeText={(text) => {
                    if (form[item?.fieldName]?.value?.length > 1 && !text) {
                        return //Temporary fix for issue with text area
                    }
                    setForm({
                        ...form,
                        [item?.fieldName]: { value: text, error: false, message: '' },
                    })
                }}
                value={form[item?.fieldName]?.value}
                containerStyle={styles.fieldWrap}
            />
        )
    }

    const renderDate = (item: any, index: number) => {
        return (
            <DateSelection
                key={item?.fieldName}
                title={item?.title + (item?.isRequired ? '*' : '')}
                onDateChange={(date: any) => {
                    setForm({
                        ...form,
                        [item?.fieldName]: { value: date, error: false, message: '' },
                    })
                }}
                date={form[item?.fieldName]?.value}
                containerStyle={styles.fieldWrap}
            />
        )
    }

    const renderCheckBox = (item: any, index: number) => {
        return (
            <View key={item?.fieldName} style={[styles.checkBox, parseStyle(item?.style)]}>
                <CheckBox
                    type={item?.checkType === 'v' ? 'v' : 'x'}
                    title={item?.title + (item?.isRequired ? '*' : '')}
                    value={form[item?.fieldName]?.value}
                    onChange={(isCheck) => {
                        setForm({
                            ...form,
                            [item?.fieldName]: { value: isCheck, error: false, message: '' },
                        })
                    }}
                />
                {renderIcon(item?.iconUrl)}
            </View>
        )
    }

    const renderIcon = (iconUrl: any) => {
        if (iconUrl) {
            return (
                <FastImage
                    source={{ uri: iconUrl }}
                    style={{
                        height: scaleModerate(24),
                        width: scaleModerate(24),
                        marginLeft: scaleModerate(5),
                    }}
                />
            )
        } else {
            return <View></View>
        }
    }

    const renderText = (item: any, index: number) => {
        return (
            <Text
                key={`text${index}`}
                style={[
                    DefaultStyles.textRegular14Black,
                    styles.fieldWrap,
                    parseStyle(item?.style),
                ]}
            >
                {item?.title}
            </Text>
        )
    }

    const parseStyle = (style: any) => {
        try {
            if (!style) return {}
            return style
        } catch (e) {
            console.log('parseStyle error', style, e)
            return {}
        }
    }

    return (
        <View style={{}}>
            {_.toArray(_.groupBy(schemaFrom, 'row'))?.map((rowItem, rowIndex) => {
                return (
                    <View
                        key={`row${rowIndex}`}
                        style={{ flexDirection: 'row', gap: scaleModerate(10) }}
                    >
                        {rowItem?.map((item, index) => {
                            switch (item.type) {
                                case 'textInput':
                                    return renderInput(item, index)
                                case 'selection':
                                    return renderSelection(item, index)
                                case 'dateSelection':
                                    return renderDate(item, index)
                                case 'textArea':
                                    return renderTextArea(item, index)
                                case 'checkBox':
                                    return renderCheckBox(item, index)
                                case 'text':
                                    return renderText(item, index)
                                default:
                                    return <View key={item?.fieldName}></View>
                            }
                        })}
                    </View>
                )
            })}
        </View>
    )
})

export default DynamicForm

const styles = StyleSheet.create({
    fieldWrap: {
        flex: 1,
        marginBottom: scaleModerate(5),
    },
    checkBox: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: scaleModerate(10),
        alignItems: 'center',
    },
})
