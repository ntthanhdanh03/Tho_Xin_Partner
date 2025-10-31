import { Pressable, StyleSheet, Text, View, Animated } from 'react-native'
import React, { FC, useEffect, useRef } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs'
import FastImage from 'react-native-fast-image'

import { scaleModerate } from '../styles/scaleDimensions'
import { Colors } from '../styles/Colors'
import { DefaultStyles } from '../styles/DefaultStyles'
import { useTranslation } from 'react-i18next'
import {
    ic_calendar,
    ic_calendar_check,
    ic_home,
    ic_home_check,
    ic_user,
    ic_user_check,
} from '../assets'
import HomeView from '../views/home/HomeView'
import ProfileView from '../views/profile/ProfileView'
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
            iconActive = ic_home_check
            break
        case 'ActivityTab':
            label = t('Hoạt động')
            iconDefault = ic_calendar
            iconActive = ic_calendar_check
            break
        case 'ProfileTab':
            label = t('Tôi')
            iconDefault = ic_user
            iconActive = ic_user_check
            break
    }
    return { label, iconDefault, iconActive }
}

const TabButton: FC<{
    route: any
    index: number
    isFocused: boolean
    options: any
    onPress: () => void
    onLongPress: () => void
    label: string
    iconDefault: number
    iconActive: number
}> = ({
    route,
    index,
    isFocused,
    options,
    onPress,
    onLongPress,
    label,
    iconDefault,
    iconActive,
}) => {
    const scaleAnim = useRef(new Animated.Value(isFocused ? 1 : 0.9)).current
    const translateYAnim = useRef(new Animated.Value(isFocused ? -4 : 0)).current
    const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0.6)).current

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: isFocused ? 1.1 : 0.9,
                useNativeDriver: true,
                friction: 6,
                tension: 100,
            }),
            Animated.spring(translateYAnim, {
                toValue: isFocused ? -6 : 0,
                useNativeDriver: true,
                friction: 6,
                tension: 100,
            }),
            Animated.timing(opacityAnim, {
                toValue: isFocused ? 1 : 0.6,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start()
    }, [isFocused])

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
            <Animated.View
                style={[
                    styles.iconContainer,
                    {
                        transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                {isFocused && (
                    <View style={styles.activeBackground}>
                        <View style={styles.activeIndicator} />
                    </View>
                )}
                <FastImage
                    source={isFocused ? iconActive : iconDefault}
                    style={styles.iconTab}
                    resizeMode={'contain'}
                />
                <Text
                    style={[styles.title, isFocused && { color: Colors.primary }]}
                    numberOfLines={1}
                >
                    {label}
                </Text>
            </Animated.View>
        </Pressable>
    )
}

const MyTabBar: FC<TabBar> = ({ state, descriptors, navigation }) => {
    const { t } = useTranslation()

    return (
        <View style={styles.tabBarWrap}>
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
                        <TabButton
                            key={index}
                            route={route}
                            index={index}
                            isFocused={isFocused}
                            options={options}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            label={label}
                            iconDefault={iconDefault}
                            iconActive={iconActive}
                        />
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
            <Tab.Screen name="InComeTab" component={InComeStackScreen} />
            <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
        </Tab.Navigator>
    )
}

export default BottomTab

const styles = StyleSheet.create({
    tabBarWrap: {
        backgroundColor: Colors.whiteFF,
        overflow: 'hidden',
        ...DefaultStyles.shadow,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    tabBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: scaleModerate(12),
        paddingBottom: scaleModerate(10),
        paddingHorizontal: scaleModerate(16),
        backgroundColor: Colors.whiteFC,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scaleModerate(4),
    },
    iconTab: {
        width: scaleModerate(24),
        height: scaleModerate(24),
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(8),
        borderRadius: scaleModerate(12),
    },
    activeBackground: {
        position: 'absolute',
        width: '80%',
        height: '100%',
        backgroundColor: Colors.primary + '10',
        borderRadius: scaleModerate(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIndicator: {
        position: 'absolute',
        top: scaleModerate(-13),
        width: scaleModerate(32),
        height: scaleModerate(2),
        backgroundColor: Colors.primary,
        borderRadius: scaleModerate(3),
    },
    title: {
        ...DefaultStyles.textBold18Black,
        color: Colors.gray72,
        fontSize: scaleModerate(11),
        marginTop: scaleModerate(2),
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
