// import ImagePicker from 'react-native-image-crop-picker'
// import { scaleModerate } from '../styles/scaleDimensions'
// import { showFailToast } from './alertUtils'
// import RNFS from 'react-native-fs'

// interface IMedia {
//     cropping?: boolean
//     useFrontCamera?: boolean
//     width?: number
//     height?: number
//     mediaType?: 'photo' | 'video' | 'any'
//     multiple?: boolean
// }
// export const pickMedia = async ({
//     cropping = false,
//     width = scaleModerate(650),
//     height = scaleModerate(408),
//     mediaType = 'photo',
//     multiple = false,
// }: IMedia) => {
//     try {
//         console.log('pickMedia1')
//         const image = await ImagePicker.openPicker({
//             width: width,
//             height: height,
//             cropping: cropping,
//             // includeBase64: true,
//             mediaType: mediaType,
//             multiple: multiple,
//             maxFiles: multiple ? 10 : 1,
//         })
//         console.log('pickMedia2', image)
//         if (image) return image
//         return null
//     } catch (error) {
//         console.log(error)
//     }
// }

// export const takeMedia = async ({
//     cropping = false,
//     useFrontCamera = false,
//     width = scaleModerate(650),
//     height = scaleModerate(408),
//     mediaType = 'photo',
// }: IMedia) => {
//     try {
//         const image = await ImagePicker.openCamera({
//             width: width,
//             height: height,
//             cropping: cropping,
//             useFrontCamera: useFrontCamera,
//             // includeBase64: true,
//             mediaType: mediaType,
//         })
//         if (image && image.path) return image
//         return null
//     } catch (error: any) {
//         console.log(error)
//         if (error.toString().includes('Cannot run camera on simulator')) {
//             showFailToast('Cannot run camera on simulator')
//             const image = await pickMedia({ cropping, width, height })
//             if (image && image.path) return image
//             return null
//         }
//     }
// }

// export const base64ToImage = async (base64Image: any) => {
//     try {
//         // Remove the prefix from the Base64 string
//         const base64Data = base64Image.split(',')[1]
//         // Define the path for the temporary file
//         const path = `${RNFS.TemporaryDirectoryPath}/tempImage.png`
//         // Write the file
//         await RNFS.writeFile(path, base64Data, 'base64')
//         console.log('Temporary file saved to:', path)
//         return path
//     } catch (error) {
//         console.error('base64ToImage:', error)
//     }
// }
