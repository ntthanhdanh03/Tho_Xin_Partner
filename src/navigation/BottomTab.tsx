import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs'
import FastImage from 'react-native-fast-image'

import { scaleModerate } from '../styles/scaleDimensions'
import { Colors } from '../styles/Colors'
import { DefaultStyles } from '../styles/DefaultStyles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import LoginView from '../views/auth/LoginView'
import { ic_home } from '../assets'
import HomeView from '../views/home/HomeView'
import ProfileView from '../views/profile/ProfileView'
import HistoryOderView from '../views/history/HistoryOderView'
import InComeView from '../views/income/InComeView'

interface TabBar {
    state: TabNavigationState<ParamListBase>
    descriptors: Record<string, any>
    navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> | any
}

const getIconAndLabel = (routeName: string, t: any) => {
    let label = ''
    let iconDefault = 0
    let iconActive = 0

    switch (routeName) {
        case 'HomeTab':
            label = t('Trang chủ')
            iconDefault = ic_home
            iconActive = ic_home
            break
        case 'HistoryTab':
            label = t('Lịch sử')
            iconDefault = ic_home
            iconActive = ic_home
            break
        case 'InComeTab':
            label = t('Thu Nhập')
            iconDefault = ic_home
            iconActive = ic_home
            break
        case 'ProfileTab':
            label = t('Tôi')
            iconDefault = ic_home
            iconActive = ic_home
            break
    }
    return { label, iconDefault, iconActive }
}

const MyTabBar: FC<TabBar> = ({ state, descriptors, navigation }) => {
    const { t } = useTranslation()

    return (
        <View style={styles.tabBarWrap}>
            <View style={[styles.tabBar, styles.tabBarBottom]}>
                {state.routes.map((route, index) => {
                    return (
                        <View
                            key={index}
                            style={[styles.btn, { height: scaleModerate(20) }]}
                        ></View>
                    )
                })}
            </View>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key]
                    const { label, iconDefault, iconActive } = getIconAndLabel(route.name, t)

                    const isFocused = state.index === index

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        })

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({ name: route.name, merge: true })
                        }
                    }

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        })
                    }

                    return (
                        <Pressable
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.btn}
                        >
                            <View style={styles.iconContainer}>
                                {isFocused && (
                                    <>
                                        <FastImage
                                            source={iconActive}
                                            style={styles.iconTab}
                                            resizeMode={'contain'}
                                        />
                                        <Text style={[styles.title, { color: Colors.primary }]}>
                                            {label}
                                        </Text>
                                    </>
                                )}
                                {!isFocused && (
                                    <>
                                        <FastImage
                                            source={iconDefault}
                                            style={styles.iconTab}
                                            resizeMode={'contain'}
                                        />
                                        <Text style={styles.title}>{label}</Text>
                                    </>
                                )}
                            </View>
                        </Pressable>
                    )
                })}
            </View>
        </View>
    )
}

const HomeStack = createNativeStackNavigator()
const HomeStackScreen = ({ route }: any) => {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HomeStack.Screen name="HomeView" component={HomeView} initialParams={route?.params} />
        </HomeStack.Navigator>
    )
}

const ProfileStack = createNativeStackNavigator()
const ProfileStackScreen = ({ route }: any) => {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <ProfileStack.Screen
                name="ProfileView"
                component={ProfileView}
                initialParams={route?.params}
            />
        </ProfileStack.Navigator>
    )
}

const HistoryOderStack = createNativeStackNavigator()
const HistoryOderStackScreen = ({ route }: any) => {
    return (
        <HistoryOderStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HistoryOderStack.Screen
                name="HistoryOderView"
                component={HistoryOderView}
                initialParams={route?.params}
            />
        </HistoryOderStack.Navigator>
    )
}

const InComeStack = createNativeStackNavigator()
const InComeStackScreen = ({ route }: any) => {
    return (
        <InComeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <InComeStack.Screen
                name="InComeView"
                component={InComeView}
                initialParams={route?.params}
            />
        </InComeStack.Navigator>
    )
}

const Tab = createBottomTabNavigator()
const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <MyTabBar {...props} />}
        >
            <Tab.Screen name="HomeTab" component={HomeStackScreen} />
            <Tab.Screen name="HistoryTab" component={HistoryOderStackScreen} />
            <Tab.Screen name="InComeTab" component={InComeStackScreen} />
            <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
        </Tab.Navigator>
    )
}

export default BottomTab

const styles = StyleSheet.create({
    tabBarWrap: {
        paddingTop: scaleModerate(5),
        backgroundColor: Colors.whiteFF,
    },
    tabBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingTop: scaleModerate(10),
        paddingBottom: scaleModerate(20),
        paddingHorizontal: scaleModerate(10),
        backgroundColor: Colors.whiteFC,
        ...DefaultStyles.shadow,
    },
    tabBarBottom: {
        position: 'absolute',
        bottom: scaleModerate(-4),
        backgroundColor: Colors.whiteFF,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
    },
    iconTab: {
        width: scaleModerate(20),
        height: scaleModerate(20),
        marginBottom: scaleModerate(3),
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeContainer: {
        backgroundColor: Colors.blueB9,
        height: scaleModerate(40),
        width: scaleModerate(66),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: scaleModerate(1),
        borderRadius: scaleModerate(10),
    },
    title: {
        ...DefaultStyles.textRegular12Red,
        color: Colors.gray72,
    },
    badgeContainer: {
        height: 8,
        width: 8,
        borderRadius: 16,
        backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        right: scaleModerate(25),
    },
})
