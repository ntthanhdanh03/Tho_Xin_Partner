// socketUtil.ts
import { DeviceEventEmitter } from 'react-native'
import { io, Socket } from 'socket.io-client'

export default class SocketUtil {
    private static socket: Socket | null = null

    static connect(partnerId: string) {
        if (this.socket) {
            this.socket.disconnect()
        }

        const socketUrl = 'http://192.168.1.2:3000'
        this.socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            forceNew: true,
            timeout: 20000,
            autoConnect: true,
            query: { partnerId },
        })

        // Đăng ký listener ngay sau khi tạo socket
        this.socket.on('connect', () => console.log('✅ Socket connected:', this.socket?.id))
        this.socket.on('disconnect', (reason) => console.log('❌ Socket disconnected:', reason))
        this.socket.on('partner_online', (data) => console.log('👤 Partner online:', data))
        this.socket.on('partner_offline', (data) => console.log('👤 Partner offline:', data))
        this.socket.on('new_order', (order) => {
            DeviceEventEmitter.emit('new_order', order)
            console.log('📦 New order received:', order)
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
