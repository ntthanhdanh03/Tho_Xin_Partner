import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'

interface ISwitchButton {
    isActive?: boolean
    containerStyle?: ViewStyle
    onChange?: any
}
const SwitchButton = (props: ISwitchButton) => {
    const [isActive, setIsActive] = useState(props?.isActive || false)

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: isActive ? Colors.purple8D : Colors.gray72,
                    alignItems: isActive ? 'flex-end' : 'flex-start',
                },
                props?.containerStyle,
            ]}
            onPress={() => {
                setIsActive(!isActive)
                props?.onChange && props?.onChange(!isActive)
            }}
        >
            <View style={styles.button}></View>
        </TouchableOpacity>
    )
}

export default SwitchButton

const styles = StyleSheet.create({
    container: {
        height: scaleModerate(24),
        width: scaleModerate(42),
        borderRadius: scaleModerate(20),
        padding: 2,
    },
    button: {
        height: scaleModerate(20),
        aspectRatio: 1,
        borderRadius: scaleModerate(20),
        backgroundColor: Colors.whiteFF,
    },
})
