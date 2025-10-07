// utils/upload.ts
import { api } from './api'
import { BASE_URL } from './constants'

export const uploadKycPhoto = async (
    image: any,
    field:
        | 'idCardFrontImageUrl'
        | 'idCardBackImageUrl'
        | 'criminalRecordImageUrl'
        | 'registeredSimImageUrl'
        | 'avatarImageUrl'
        | 'imageService',
    callback?: (data: any, error: any) => void,
) => {
    try {
        if (!image?.path && !image?.uri) {
            callback && callback(null, 'Invalid image data')
            return null
        }

        const formData = new FormData()
        formData.append('file', {
            uri: image.path?.startsWith('file://') ? image.path : 'file://' + image.path,
            type: image.mime || 'image/jpeg',
            name: image.filename || `photo_${Date.now()}.jpg`,
        } as any)

        const response = await fetch(`${BASE_URL}/users/upload-kyc/${field}`, {
            method: 'POST',
            body: formData,
        })
        const data = await response.json()
        if (response.ok) {
            const uploadedFile = {
                url: data.url,
                message: data.message,
            }
            console.log('uploadKycPhoto - Success:', uploadedFile)
            callback && callback(uploadedFile, null)
            return uploadedFile
        } else {
            console.error('uploadKycPhoto - Invalid response:', data)
            callback && callback(null, 'Invalid response from server')
            return null
        }
    } catch (e: any) {
        console.error('uploadKycPhoto - Error:', e)
        callback && callback(null, e.message || 'Error uploading photo')
        return null
    }
}
