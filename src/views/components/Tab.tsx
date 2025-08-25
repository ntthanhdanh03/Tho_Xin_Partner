import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { scaleModerate, WIDTH_SCREEN } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import { DefaultStyles } from '../../styles/DefaultStyles'

interface ITab {
    data: Array<{ key: string; value: string }>
    onTabChange?: (key: string) => void
    selectedTab?: string
    type: 'full' | 'notFull'
}

const Tab = (props: ITab) => {
    const [selectedTab, setSelectedTab] = useState<string>(props?.selectedTab || props?.data[0].key)
    const listRef = useRef<FlatList>(null)

    useEffect(() => {
        if (props?.selectedTab) setSelectedTab(props?.selectedTab)
    }, [props?.selectedTab])

    return (
        <View style={{ marginBottom: scaleModerate(16) }}>
            <FlatList
                ref={listRef}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={props?.data}
                keyExtractor={(item) => `${item.key}`}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                if (index < 2) {
                                    listRef.current?.scrollToIndex({ index: 0, animated: true })
                                } else {
                                    listRef.current?.scrollToIndex({ index: index, animated: true })
                                }

                                setSelectedTab(item.key)
                                props?.onTabChange && props?.onTabChange(item.key)
                            }}
                            style={[
                                styles.itemWrap,
                                {
                                    width:
                                        props.type === 'full'
                                            ? WIDTH_SCREEN / props?.data?.length
                                            : 160,
                                },
                                selectedTab === item.key
                                    ? { borderBottomWidth: 3, borderColor: Colors.primary }
                                    : {},
                            ]}
                        >
                            <Text
                                style={[
                                    selectedTab === item.key
                                        ? {
                                              ...DefaultStyles.textRegular16Black,
                                              color: Colors.primary,
                                          }
                                        : DefaultStyles.textRegular16Gray,
                                ]}
                            >
                                {item.value}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

export default Tab

const styles = StyleSheet.create({
    itemWrap: {
        borderBottomWidth: 1,
        paddingHorizontal: scaleModerate(10),
        marginEnd: 5,
        borderColor: Colors.gray72,
        alignItems: 'center',
        paddingVertical: scaleModerate(5),
    },
})
