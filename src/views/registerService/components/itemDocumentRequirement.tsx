import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { scaleModerate } from '../../../styles/scaleDimensions'
import { DefaultStyles } from '../../../styles/DefaultStyles'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import { ic_balence } from '../../../assets'
import { Colors } from '../../../styles/Colors'

type ItemDocumentProps = {
    label: string
    navigationTo?: any
    index: number
    onPress?: () => void
    approved?: 'PENDING' | 'WAITING' | 'APPROVED'
}

const ItemDocumentRequirement: React.FC<ItemDocumentProps> = ({
    label,
    navigationTo,
    index,
    onPress,
    approved,
}) => {
    const navigation = useNavigation()

    const handleNavigation = () => {
        if (onPress) {
            onPress()
        } else if (navigationTo) {
            navigation.navigate(navigationTo as never)
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={handleNavigation}>
            <View style={styles.content}>
                <Text style={[DefaultStyles.textMedium14Black, { width: '50%' }]}>
                    {' '}
                    {index + 1}. {label}
                </Text>
                {approved === 'WAITING' ? (
                    <Text style={{ color: Colors.yellow00 }}>Đang chờ duyệt</Text>
                ) : approved === 'APPROVED' ? (
                    <Text style={{ color: Colors.green34 }}>Đã duyệt</Text>
                ) : null}
                <FastImage source={ic_balence} style={{ height: 24, width: 24 }} />
            </View>
        </TouchableOpacity>
    )
}

export default ItemDocumentRequirement

const styles = StyleSheet.create({
    container: {
        paddingVertical: scaleModerate(12),
        paddingHorizontal: scaleModerate(16),
        borderBottomWidth: 1,
        borderBottomColor: Colors.border01,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
