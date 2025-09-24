import {
    ScrollView,
    StyleSheet,
    Text,
    Touchable,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import FastImage from 'react-native-fast-image'
import { ic_check_select, ic_close } from '../../assets'
import Spacer from './Spacer'
import { DefaultStyles } from '../../styles/DefaultStyles'
import Input from './Input'
import { removeAccent } from '../../utils/dataUtils'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import { use } from 'i18next'

interface IMultiPicker {
    isVisible?: boolean
    title?: string
    data?: Array<{ key: string; name: string; value?: string; origin?: any }>
    onSelect?: any
    onClose?: any
    hasSearch?: boolean
    containerStyle?: ViewStyle
    keyValues?: Array<string> | null | undefined
}

const MultiPicker = (props: IMultiPicker) => {
    const { t } = useTranslation()
    const [filterData, setFilterData] = useState(props?.data)
    const [selectedItems, setSelectedItems] = useState<any>([])

    useEffect(() => {
        setFilterData(props?.data)
    }, [props?.data])

    useEffect(() => {
        if (props?.isVisible && props?.data && props?.data?.length > 0) {
            if (props?.keyValues) {
                if (selectedItems?.length !== props?.keyValues?.length) {
                    const foundItems =
                        props?.data?.filter((item) => props?.keyValues?.includes(item.key)) || []
                    setSelectedItems(foundItems)
                }
            } else {
                setSelectedItems([])
            }
        }
    }, [props?.isVisible])

    const searchText = (text: any) => {
        if (text) {
            const result =
                props?.data?.filter((item) =>
                    removeAccent(item.name).trim().includes(removeAccent(text).trim()),
                ) || []
            setFilterData(result)
        } else {
            setFilterData(props?.data)
        }
    }

    return (
        <Modal
            isVisible={props?.isVisible}
            style={styles.modal}
            onBackdropPress={() => props?.onClose()}
        >
            <View style={[styles.container, props?.containerStyle]}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text style={DefaultStyles.textBold18Black}>{props.title}</Text>
                    <TouchableOpacity onPress={() => props?.onClose()}>
                        <FastImage
                            source={ic_close}
                            style={{ height: scaleModerate(24), width: scaleModerate(24) }}
                        />
                    </TouchableOpacity>
                </View>

                <Spacer height={16} />
                <View style={{ borderTopWidth: 1, borderColor: Colors.border01 }}></View>
                <Spacer height={8} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {filterData?.map((item, index) => (
                        <View key={`_${index}`}>
                            <TouchableOpacity
                                style={styles.itemWrap}
                                onPress={() => {
                                    if (selectedItems.find((i: any) => i.key === item.key)) {
                                        setSelectedItems(
                                            selectedItems.filter((i: any) => i.key !== item.key),
                                        )
                                        return
                                    }
                                    setSelectedItems([...selectedItems, item])
                                }}
                            >
                                <Text style={DefaultStyles.textRegular13Black} numberOfLines={1}>
                                    {item?.name}
                                </Text>
                                <Text style={DefaultStyles.textMedium13Black} numberOfLines={1}>
                                    {item?.value}
                                </Text>
                                {selectedItems.find((i: any) => i.key === item.key) && (
                                    <FastImage
                                        source={ic_check_select}
                                        style={{ height: scaleModerate(18), aspectRatio: 1 }}
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <Spacer height={15} />
                <Button
                    title={t('Xác nhận')}
                    onPress={() => {
                        props?.onSelect(selectedItems)
                        props?.onClose()
                    }}
                />
            </View>
        </Modal>
    )
}

export default MultiPicker

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: Colors.whiteFF,
        paddingTop: scaleModerate(24),
        paddingHorizontal: scaleModerate(24),
        paddingBottom: scaleModerate(40),
        borderTopRightRadius: scaleModerate(24),
        borderTopLeftRadius: scaleModerate(24),
        maxHeight: '95%',
    },
    itemWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.border01,
        borderBottomWidth: 1,

        padding: scaleModerate(12),
    },
})
