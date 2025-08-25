import axios from 'axios'
import i18next from 'i18next'
import { useSelector } from 'react-redux'
import { store } from '../store'
import qs from 'qs'

export const api = axios.create({
    baseURL: 'http://192.168.0.164:3000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: (params) => {
        if (params?.where) params.where = JSON.stringify(params?.where)
        return qs.stringify(params)
    },
})

api.interceptors.request.use(
    async (config) => {
        const storeData: any = store.getState()
        const token = storeData?.auth?.data?.id ?? ''
        // if (token) config.headers['Authorization'] = token
        return config
    },
    (error) => {
        console.log(error)
    },
)
