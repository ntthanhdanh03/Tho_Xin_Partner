// socketUtil.ts
import { DeviceEventEmitter } from 'react-native'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '../services/constants'

export default class SocketUtil {
    private static socket: Socket | null = null

    static connect(userId: string, type: 'partner' | 'client') {
        if (this.socket) {
            this.socket.disconnect()
        }
        this.socket = io(BASE_URL, {
            transports: ['websocket', 'polling'],
            forceNew: true,
            timeout: 20000,
            autoConnect: true,
            query: { userId, type },
        })
        this.socket.on('connect', () => DeviceEventEmitter.emit('connect'))
        this.socket.on('disconnect', () => DeviceEventEmitter.emit('disconnect'))
        this.socket.on('new_order', () => {
            DeviceEventEmitter.emit('new_order')
        })
        this.socket.on('appointment_updated', (data) => {
            console.log('📨 Nhận appointment-updated với data:', data)
            DeviceEventEmitter.emit('appointment_updated', data)
        })
        this.socket.on('chat.newMessage', (payload: { orderId: string; roomId: string }) => {
            console.log('📨 Nhận chat.newMessage với orderId , roomId:')
            DeviceEventEmitter.emit('chat.newMessage')
        })

        this.socket.on('select_applicant', (appointment: string) => {
            console.log('📨 Nhận select_applicant:', appointment)
            DeviceEventEmitter.emit('order.selectApplicant', appointment)
        })
        this.socket.on('transaction.top_up.success', (payload: string) => {
            console.log('📨transaction.top_up.success:', payload)
        })
    }

    static on(event: string, callback: (data: any) => void) {
        this.socket?.on(event, callback)
    }

    static off(event: string, callback?: (data: any) => void) {
        if (!this.socket) return
        callback ? this.socket.off(event, callback) : this.socket.off(event)
    }

    static emit(event: string, data?: any) {
        this.socket?.emit(event, data)
    }

    static disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    static getConnectionStatus() {
        return {
            exists: !!this.socket,
            connected: this.socket?.connected || false,
            id: this.socket?.id,
            transport: this.socket?.io.engine?.transport?.name,
        }
    }
}
