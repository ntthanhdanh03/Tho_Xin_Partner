import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'
import FastImage from 'react-native-fast-image'
import { ic_minus, ic_plus } from '../../assets'
import { DefaultStyles } from '../../styles/DefaultStyles'
interface INumberButton {
    value?: number
    onChange?: any
}
const NumberButton = (props?: INumberButton) => {
    const [num, setNum] = useState(props?.value || 1)
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.touch}
                onPress={() => {
                    if (Number(num) > 1) {
                        setNum(Number(num) - 1)
                        props?.onChange && props?.onChange(Number(num) - 1)
                    }
                }}
            >
                <FastImage source={ic_minus} style={styles.icon} />
            </TouchableOpacity>
            <TextInput value={num.toString()} style={styles.input} keyboardType="numeric" />
            <TouchableOpacity
                style={styles.touch}
                onPress={() => {
                    setNum(Number(num) + 1)
                    props?.onChange && props?.onChange(Number(num) + 1)
                }}
            >
                <FastImage source={ic_plus} style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
}

export default NumberButton

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: scaleModerate(30),
        borderWidth: scaleModerate(1),
        borderRadius: scaleModerate(30),
        borderColor: Colors.border01,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    touch: {
        height: scaleModerate(30),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: scaleModerate(25),
        height: scaleModerate(30),
        textAlign: 'center',
        ...DefaultStyles.textRegular14Black,
        color: Colors.primary300,
    },
    icon: {
        height: scaleModerate(20),
        aspectRatio: 1,
    },
})
