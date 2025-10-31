import { DeviceEventEmitter } from 'react-native'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '../services/constants'

export default class SocketUtil {
    private static socket: Socket | null = null

    // ==================== CONNECTION ====================

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

        this.setupLifecycleListeners()
        this.setupOrderListeners()
        this.setupChatListeners()
        this.setupCallListeners()
        this.setupWebRTCListeners()
        this.setupTransactionListeners()
        this.setupAppointmentListeners()
    }

    static disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    // ==================== LIFECYCLE LISTENERS ====================

    private static setupLifecycleListeners() {
        this.socket?.on('connect', () => {
            DeviceEventEmitter.emit('connect')
        })

        this.socket?.on('disconnect', () => {
            DeviceEventEmitter.emit('disconnect')
        })
    }

    // ==================== ORDER LISTENERS ====================

    private static setupOrderListeners() {
        this.socket?.on('new_order', () => {
            DeviceEventEmitter.emit('new_order')
        })

        this.socket?.on('select_applicant', (appointment: string) => {
            DeviceEventEmitter.emit('order.selectApplicant', appointment)
        })
    }

    // ==================== CHAT LISTENERS ====================

    private static setupChatListeners() {
        this.socket?.on('chat.newMessage', (payload: { orderId: string; roomId: string }) => {
            DeviceEventEmitter.emit('chat.newMessage')
        })
    }

    // ==================== APPOINTMENT LISTENERS ====================

    private static setupAppointmentListeners() {
        this.socket?.on('appointment_updated', (data) => {
            DeviceEventEmitter.emit('appointment_updated', data)
        })
    }

    // ==================== CALL LISTENERS ====================

    private static setupCallListeners() {
        this.socket?.on('call.incoming', (payload) => {
            console.log('📞 Incoming call:', payload)
            DeviceEventEmitter.emit('call.incoming', payload)
        })

        this.socket?.on('call.request_cancel', (payload) => {
            console.log('📞 Call request cancelled:', payload)
            DeviceEventEmitter.emit('call.request_cancel', payload)
        })

        this.socket?.on('call.accepted', (payload) => {
            console.log('✅ Call accepted:', payload)
            DeviceEventEmitter.emit('call.accepted', payload)
        })

        this.socket?.on('call.declined', (payload) => {
            console.log('❌ Call declined:', payload)
            DeviceEventEmitter.emit('call.declined', payload)
        })

        this.socket?.on('call.ended', (payload) => {
            console.log('📴 Call ended:', payload)
            DeviceEventEmitter.emit('call.ended', payload)
        })
    }

    // ==================== WEBRTC LISTENERS ====================

    private static setupWebRTCListeners() {
        this.socket?.on('webrtc.offer', (payload) => {
            console.log('📥 WebRTC offer received:', payload)
            DeviceEventEmitter.emit('webrtc.offer', payload)
        })

        this.socket?.on('webrtc.answer', (payload) => {
            console.log('📥 WebRTC answer received:', payload)
            DeviceEventEmitter.emit('webrtc.answer', payload)
        })

        this.socket?.on('webrtc.ice-candidate', (payload) => {
            console.log('❄️ WebRTC ICE candidate received:', payload)
            DeviceEventEmitter.emit('webrtc.ice-candidate', payload)
        })
    }

    // ==================== TRANSACTION LISTENERS ====================

    private static setupTransactionListeners() {
        this.socket?.on('transaction.top_up.success', (payload: string) => {
            DeviceEventEmitter.emit('transaction.top_up.success', payload)
        })
    }

    // ==================== UTILITY METHODS ====================

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

    static getConnectionStatus() {
        return {
            exists: !!this.socket,
            connected: this.socket?.connected || false,
            id: this.socket?.id,
            transport: this.socket?.io.engine?.transport?.name,
        }
    }
}
