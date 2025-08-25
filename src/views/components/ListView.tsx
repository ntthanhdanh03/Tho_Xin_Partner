import { Pressable, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { ic_add_circle, ic_chevron_down, ic_close_circle, ic_minus_circle } from '../../assets'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import BorderBottomView from './BorderBottomView'
import Spacer from './Spacer'
import { useTranslation } from 'react-i18next'

interface IListView {
    title?: string
    onPressAdd?: any
    onPressRemove?: any
    data?: Array<{ key: string; name: string; value: string }>
    containerStyle?: ViewStyle
    error?: boolean
}
const ListView = React.forwardRef((props: IListView, ref: any) => {
    const { t } = useTranslation()
    const [list, setList] = useState<any>([])

    useEffect(() => {
        setList(props?.data || [])
    }, [props?.data])
    useImperativeHandle(ref, () => ({
        setList(listData: any) {
            setList(listData)
        },
    }))

    return (
        <View style={props?.containerStyle}>
            <BorderBottomView
                containerStyle={{
                    ...styles.container,
                    borderColor: props?.error ? Colors.redFD : Colors.black1B,
                }}
                gapColor={Colors.blueB9}
            >
                <View>
                    <View style={styles.header}>
                        <Text style={styles.title}>{props?.title}</Text>
                        {props?.onPressAdd && (
                            <TouchableOpacity
                                onPress={() => {
                                    props?.onPressAdd()
                                }}
                            >
                                <FastImage source={ic_add_circle} style={styles.icon} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.body}>
                        {list?.map((item: any, index: number) => (
                            <View key={`${index}`} style={styles.rowItem}>
                                <Text
                                    numberOfLines={1}
                                    style={[{ flex: 1 }, DefaultStyles.textRegular13Black]}
                                >
                                    {item?.name}
                                </Text>
                                <Text numberOfLines={1} style={DefaultStyles.textMedium13Black}>
                                    {item?.value}
                                </Text>
                                {props?.onPressRemove && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            props?.onPressRemove(item)
                                        }}
                                        style={{ paddingLeft: scaleModerate(10) }}
                                    >
                                        <FastImage source={ic_minus_circle} style={styles.icon} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                        {list?.length === 0 && (
                            <Text style={DefaultStyles.textRegular13Gray}>{t('noService')}</Text>
                        )}
                    </View>
                </View>
            </BorderBottomView>
        </View>
    )
})

export default ListView

const styles = StyleSheet.create({
    container: {
        borderWidth: 1.5,
        borderRadius: scaleModerate(10),
        borderColor: Colors.black1B,
        backgroundColor: Colors.whiteFF,
        minHeight: scaleModerate(50),
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(13),
        justifyContent: 'space-between',
        borderBottomWidth: 1.5,
        borderBottomColor: Colors.black1B,
    },
    icon: {
        width: scaleModerate(22),
        height: scaleModerate(22),
    },
    title: {
        ...DefaultStyles.textMedium16Black,
    },
    body: {
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(13),
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scaleModerate(5),
    },
})
