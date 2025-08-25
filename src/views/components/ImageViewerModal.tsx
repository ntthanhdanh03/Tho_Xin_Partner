import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ImageView from 'react-native-image-viewing'
import { scaleModerate } from '../../styles/scaleDimensions'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { Colors } from '../../styles/Colors'

const ImageViewerModal = (props?: any) => {
    const renderHeader = ({ imageIndex }: any) => {
        return (
            <View style={styles.footer}>
                <Text style={[DefaultStyles.textBold16White]}>
                    {imageIndex + 1} / {props?.images?.length}
                </Text>
            </View>
        )
    }

    return <ImageView {...props} FooterComponent={renderHeader} />
}

export default ImageViewerModal

const styles = StyleSheet.create({
    footer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: scaleModerate(30),
        backgroundColor: 'black',
        paddingHorizontal: scaleModerate(10),
        paddingVertical: scaleModerate(3),
        borderRadius: scaleModerate(5),
        opacity: 0.6,
    },
})
