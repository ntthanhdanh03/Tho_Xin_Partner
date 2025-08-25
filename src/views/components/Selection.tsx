import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { ic_chevron_down } from '../../assets'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import { useTranslation } from 'react-i18next'
import Picker from './Picker'
import MultiPicker from './MultiPicker'
import Spacer from './Spacer'

interface ISelection {
    title: string
    onSelect?: any
    data?: Array<{ key: string; name: string; value?: string; origin?: any }>
    containerStyle?: ViewStyle
    hasSearch?: boolean
    pickerStyle?: ViewStyle
    keyValue?: string | null | undefined
    error?: boolean
    multiple?: boolean
    keyValues?: Array<string> | null | undefined
}
const Selection = (props: ISelection) => {
    const { t } = useTranslation()
    const [showPicker, setShowPicker] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [selectedItems, setSelectedItems] = useState<any>([])

    useEffect(() => {
        if (props?.keyValue && props?.data && props?.data?.length > 0) {
            if (selectedItem?.key !== props?.keyValue) {
                const foundItem = props?.data?.find((item) => item.key === props?.keyValue)
                setSelectedItem(foundItem)
            }
        } else {
            setSelectedItem(null)
        }
    }, [props?.keyValue, props?.data])

    useEffect(() => {
        if (props?.keyValues && props?.data && props?.data?.length > 0) {
            if (selectedItems?.length !== props?.keyValues?.length) {
                const foundItems = props?.data?.filter((item) =>
                    props?.keyValues?.includes(item.key),
                )
                setSelectedItems(foundItems)
            }
        } else {
            setSelectedItems([])
        }
    }, [props?.keyValues, props?.data])

    return (
        <View style={[props?.containerStyle]}>
            {props?.title && (
                <View style={styles.wrapTitle}>
                    <Text style={styles.title}>{props?.title}</Text>
                </View>
            )}

            <Pressable
                onPress={() => {
                    setShowPicker(true)
                }}
                style={[styles.wrap, props?.error ? { borderColor: Colors.redFD } : {}]}
            >
                {props?.multiple ? (
                    <Text numberOfLines={1} style={styles.text}>
                        {selectedItems?.map((item: any) => item?.name).join(', ') || ''}
                    </Text>
                ) : (
                    <Text style={styles.text}>{selectedItem?.name || ''}</Text>
                )}

                <FastImage source={ic_chevron_down} style={styles.icon} />
            </Pressable>
            {props?.multiple ? (
                <MultiPicker
                    isVisible={showPicker}
                    title={props?.title}
                    data={props?.data}
                    onSelect={(items: any) => {
                        setSelectedItems(items)
                        setShowPicker(false)
                        props?.onSelect && props?.onSelect(items)
                    }}
                    onClose={() => setShowPicker(false)}
                    hasSearch={props?.hasSearch}
                    containerStyle={props?.pickerStyle}
                    keyValues={props?.keyValues}
                />
            ) : (
                <Picker
                    isVisible={showPicker}
                    title={props?.title}
                    data={props?.data}
                    onSelect={(item: any) => {
                        setSelectedItem(item)
                        setShowPicker(false)
                        props?.onSelect && props?.onSelect(item)
                    }}
                    onClose={() => {
                        setShowPicker(false)
                    }}
                    hasSearch={props?.hasSearch}
                    containerStyle={props?.pickerStyle}
                />
            )}
        </View>
    )
}

export default Selection

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        borderWidth: scaleModerate(1),
        height: scaleModerate(52),
        borderRadius: scaleModerate(8),
        borderColor: Colors.border01,
        backgroundColor: Colors.whiteFF,
        alignItems: 'center',
        paddingTop: 14,
    },
    icon: {
        width: scaleModerate(20),
        height: scaleModerate(20),
        marginRight: scaleModerate(14),
    },
    wrapTitle: {
        position: 'absolute',
        top: scaleModerate(10),
        marginLeft: scaleModerate(10),
        zIndex: 2,
    },
    title: {
        ...DefaultStyles.textBold12Black,
        backgroundColor: Colors.whiteFF,
        paddingHorizontal: scaleModerate(5),
    },
    text: {
        flex: 1,
        marginLeft: scaleModerate(14),
        ...DefaultStyles.textMedium12Black,
    },
})
