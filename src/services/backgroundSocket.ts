import BackgroundService from 'react-native-background-actions'
import { io } from 'socket.io-client'
import { BASE_URL } from '../services/constants'
import { DeviceEventEmitter } from 'react-native'

let socket: any = null

const socketTask = async (taskData: any) => {
    const { userId, type } = taskData
    console.log('🚀 Background socket starting for:', userId, type)

    try {
        socket = io(BASE_URL, {
            transports: ['websocket'],
            query: { userId, type },
        })

        socket.on('connect', () => console.log('✅ Socket connected (background)'))
        socket.on('disconnect', () => console.log('⚠️ Socket disconnected'))
        socket.on('transaction.top_up.success', (payload: any) => {
            console.log('💰 Top-up event (background):', payload)
            DeviceEventEmitter.emit('TOP_UP_SUCCESS', payload)
        })

        // giữ service sống
        for (;;) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }
    } catch (err) {
        console.error('❌ Socket task error:', err)
    }
}

const options = (userId: string, type: string) => ({
    taskName: 'Realtime',
    taskTitle: 'Thợ Xin Part Chạy Nền',
    taskDesc: 'Ứng dụng đang đồng bộ realtime...',
    taskIcon: { name: 'ic_launcher', type: 'mipmap' },
    color: '#00aa00',
    parameters: { userId, type },
})

export const startSocketBackground = async (userId: string, type: string) => {
    try {
        const running = await BackgroundService.isRunning()
        if (!running) {
            await BackgroundService.start(socketTask, options(userId, type))
            console.log('📡 Background socket started')
        }
    } catch (err) {
        console.error('❌ Failed to start background socket:', err)
    }
}

export const stopSocketBackground = async () => {
    try {
        const running = await BackgroundService.isRunning()
        if (running) {
            await BackgroundService.stop()
            console.log('🛑 Background socket stopped')
        }
    } catch (err) {
        console.error('❌ Failed to stop background socket:', err)
    }
}
