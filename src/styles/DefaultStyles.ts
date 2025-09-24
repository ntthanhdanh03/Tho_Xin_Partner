import { StyleSheet } from 'react-native'
import { Fonts } from './Fonts'
import { Colors } from './Colors'
import { scaleModerate } from './scaleDimensions'

export const DefaultStyles = StyleSheet.create({
    //VIEW
    container: {
        flex: 1,
        backgroundColor: Colors.whiteFF,
    },
    wrapBody: {
        paddingHorizontal: scaleModerate(16),
        paddingTop: scaleModerate(6),
    },
    //TEXT
    textBold24Black: {
        ...Fonts.Bold,
        color: Colors.black1B,
        fontSize: 24,
    },
    textBold22Black: {
        ...Fonts.Bold,
        color: Colors.black1B,
        fontSize: 22,
    },
    textMedium20Black: {
        ...Fonts.Medium,
        color: Colors.black1B,
        fontSize: 20,
    },
    textBold20Black: {
        ...Fonts.Bold,
        color: Colors.black1B,
        fontSize: 20,
    },
    textRegular20Black: {
        ...Fonts.Regular,
        color: Colors.black1B,
        fontSize: 20,
    },
    textMedium18Black: {
        ...Fonts.Medium,
        color: Colors.black1B,
        fontSize: 18,
    },
    textBold18Black: {
        ...Fonts.Bold,
        color: Colors.black1B,
        fontSize: 18,
    },
    textBold18White: {
        //Button
        ...Fonts.Bold,
        color: Colors.whiteFF,
        fontSize: 18,
    },
    textBold16Black: {
        //Header title
        ...Fonts.Bold,
        color: Colors.black1B,
        fontSize: 16,
    },
    textBold16White: {
        //Header title
        ...Fonts.Bold,
        color: Colors.whiteFF,
        fontSize: 16,
    },
    textMedium16Black: {
        ...Fonts.Medium,
        color: Colors.black1B,
        fontSize: 16,
    },
    textRegular16Black: {
        ...Fonts.Regular,
        color: Colors.black1B,
        fontSize: 16,
    },
    textRegular16Gray: {
        ...Fonts.Regular,
        color: Colors.gray72,
        fontSize: 16,
    },
    textBold14Black: {
        ...Fonts.Bold,
        color: Colors.black1B,
        fontSize: 14,
    },
    textBold14White: {
        ...Fonts.Bold,
        color: Colors.whiteFF,
        fontSize: 14,
    },
    textMedium14White: {
        ...Fonts.Medium,
        color: Colors.whiteFF,
        fontSize: 14,
    },
    textMedium14Black: {
        ...Fonts.Medium,
        color: Colors.black01,
        fontSize: 14,
    },
    textRegular14Black: {
        ...Fonts.Regular,
        color: Colors.black1B,
        fontSize: 14,
    },
    textRegular14White: {
        ...Fonts.Regular,
        color: Colors.whiteFF,
        fontSize: 14,
    },
    textRegular14Gray: {
        ...Fonts.Regular,
        color: Colors.gray72,
        fontSize: 14,
    },
    textMedium13Black: {
        ...Fonts.Medium,
        color: Colors.black1B,
        fontSize: 13,
    },
    textRegular13Black: {
        //Input
        ...Fonts.Regular,
        color: Colors.black1B,
        fontSize: 13,
    },
    textRegular13Gray: {
        ...Fonts.Regular,
        color: Colors.gray72,
        fontSize: 13,
    },
    textMedium12Black: {
        ...Fonts.Medium,
        color: Colors.black1B,
        fontSize: 12,
    },
    textBold12Black: {
        ...Fonts.Bold,
        color: Colors.black1B,
        fontSize: 12,
    },
    textMedium12White: {
        ...Fonts.Medium,
        color: Colors.whiteFF,
        fontSize: 12,
    },
    textRegular12Red: {
        ...Fonts.Regular,
        color: Colors.redFD,
        fontSize: 12,
    },
    textRegular12Gray: {
        ...Fonts.Regular,
        color: Colors.gray72,
        fontSize: 12,
    },
    //
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})
