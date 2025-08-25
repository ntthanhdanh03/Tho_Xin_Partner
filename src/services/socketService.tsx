import { io, Socket } from 'socket.io-client'

interface ServerToClientEvents {
    messageHistory: (history: any[]) => void
    receiveMessage: (message: any) => void
    error: (err: any) => void
    connect: () => void
    connect_error: (err: any) => void
}

interface ClientToServerEvents {
    joinRoom: (data: { chatRoomId: string; userJoin: string }) => void
    sendMessage: (data: {
        chatRoomId: string
        senderId: string
        receiverId: string
        message: string
    }) => void
}

class SocketUtils {
    private static socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

    private static messageListeners: Array<(message: any) => void> = []
    private static historyMessageListeners: Array<(history: any[]) => void> = []

    // ---------------------- INIT SOCKET ----------------------
    static initializeSocket(onConnected?: () => void) {
        if (this.socket && this.socket.connected) {
            console.log('Socket already initialized and connected')
            onConnected?.()
            return
        }

        const socketUrl = 'http://171.244.139.41:5000/'
        console.log('Initializing Socket.IO at:', socketUrl)

        this.socket = io(socketUrl, {
            path: '/socketChat/socket.io',
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 20,
            reconnectionDelay: 2000,
            timeout: 10000,
            autoConnect: true,
            query: { client: 'react-native', EIO: '4' },
            extraHeaders: {
                'x-client': 'react-native',
            },
        })

        this.socket.on('connect', () => {
            console.log('Socket connected successfully, ID:', this.socket?.id)
            onConnected?.()
        })

        this.socket.on('connect_error', (err) => {
            console.error('Socket connect_error:', err.message, JSON.stringify(err, null, 2))
        })

        this.socket.on('error', (err) => {
            console.error('Socket error:', err.message || err)
        })

        // Event bindings
        this.socket.on('receiveMessage', (message) => {
            this.messageListeners.forEach((listener) => listener(message))
        })

        this.socket.on('messageHistory', (history) => {
            this.historyMessageListeners.forEach((listener) => listener(history))
        })
    }

    // ---------------------- EMIT EVENTS ----------------------
    static joinRoom(chatRoomId: string, userJoin: string) {
        if (!this.socket) return
        if (this.socket.connected) {
            this.socket.emit('joinRoom', { chatRoomId, userJoin })
        } else {
            this.socket.once('connect', () => {
                this.socket?.emit('joinRoom', { chatRoomId, userJoin })
            })
        }
    }

    static sendMessage(chatRoomId: string, senderId: string, receiverId: string, message: string) {
        this.socket?.emit('sendMessage', { chatRoomId, senderId, receiverId, message })
    }

    // ---------------------- ON / OFF CALLBACKS ----------------------
    static onReceiveMessage(callback: (message: any) => void) {
        this.messageListeners.push(callback)
    }

    static onMessageHistory(callback: (history: any[]) => void) {
        this.historyMessageListeners.push(callback)
    }

    // ---------------------- CLEANUP ----------------------
    static disconnectSocket() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.messageListeners = []
            this.historyMessageListeners = []
        }
    }
}

export default SocketUtils
