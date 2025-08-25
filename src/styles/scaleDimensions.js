import { Dimensions } from 'react-native'

const iPhoneXDimensions = {
    width: 375,
    height: 812,
}

export const HEIGHT_SCREEN = Dimensions.get('window').height
export const WIDTH_SCREEN = Dimensions.get('window').width

const [shortDimension, longDimension] =
    WIDTH_SCREEN < HEIGHT_SCREEN ? [WIDTH_SCREEN, HEIGHT_SCREEN] : [HEIGHT_SCREEN, WIDTH_SCREEN]

export const scaleVertical = (value) => {
    return value * (HEIGHT_SCREEN / iPhoneXDimensions.height)
}

export const scaleHorizontal = (value) => {
    return value * (WIDTH_SCREEN / iPhoneXDimensions.width)
}

export const verticalScale = (size) => (longDimension / iPhoneXDimensions.height) * size

export const scaleModerate = (size, factor = 0.4) =>
    Math.round(size + (verticalScale(size) - size) * factor)

const φ = (1 + Math.sqrt(5)) / 2
export const MAX_HEADER_HEIGHT = HEIGHT_SCREEN * (1 - 1 / φ)
