import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal'
import { scaleModerate } from '../../styles/scaleDimensions'
import { Colors } from '../../styles/Colors'

interface GenericModalProps {
    visible: boolean
    onClose: () => void
    children: React.ReactNode
    height?: number
}

const GenericModal: React.FC<GenericModalProps> = ({
    visible,
    onClose,
    children,
    height = 0.7,
}) => {
    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            style={styles.modal}
            backdropOpacity={0.5}
            presentationStyle="overFullScreen"
            statusBarTranslucent
        >
            <View style={[styles.bottomSheet, { height: `${height * 100}%` }]}>
                <View style={styles.body}>{children}</View>
            </View>
        </Modal>
    )
}

export default GenericModal

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        width: '100%',
        backgroundColor: Colors.whiteFF,
        borderTopLeftRadius: scaleModerate(20),
        borderTopRightRadius: scaleModerate(20),
        overflow: 'hidden',
    },
    body: {
        flex: 1,
    },
})
