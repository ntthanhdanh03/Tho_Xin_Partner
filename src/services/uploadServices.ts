import { api } from './api'

export const UploadPhoto = async (image: any, callback?: (data: any, error: any) => void) => {
    try {
        console.log('UploadPhoto - Image:', image)
        if (!image?.path || !image?.mime) {
            console.error('Invalid image data')
            callback && callback(null, 'Invalid image data')
            return null
        }

        const headers = {
            'Content-Type': 'multipart/form-data',
        }

        const formData = new FormData()
        formData.append('file', {
            uri: image.path,
            type: image.mime,
            name: image.filename || 'image.jpg',
            mediaType: 'test',
        })

        const response = await api.post('/upload', formData, { headers })

        console.log('UploadPhoto - Response:', response.data)

        if (
            response?.status === 200 &&
            response?.data?.result?.files?.file &&
            response?.data?.result?.files?.file?.length > 0
        ) {
            const file = response.data.result.files.file[0]
            const uploadedFile = {
                ...file,
                url: `http://192.168.1.2:3000/upload/${file.name}`,
            }
            console.log('UploadPhoto - Success:', uploadedFile)
            callback && callback(uploadedFile, null)
            return uploadedFile
        } else {
            console.error('UploadPhoto - Invalid response:', response.data)
            callback && callback(null, 'Invalid response from server')
            return null
        }
    } catch (e: any) {
        console.error('UploadPhoto - Error:', e.message, e.response?.data)
        callback && callback(null, e.message || 'Error uploading photo')
        return null
    }
}
