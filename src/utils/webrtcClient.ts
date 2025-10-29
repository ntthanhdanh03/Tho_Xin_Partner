import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    mediaDevices,
} from 'react-native-webrtc'
import SocketUtil from './socketUtil'

// STUN + TURN server
const ICE_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // { urls: 'turn:your-turn-server:3478', username: 'user', credential: 'pass' } // add TURN server if needed
    ],
}

class WebRTCPartner {
    pc: RTCPeerConnection | null = null
    localStream: any = null
    remoteStream: any = null
    remoteUserId: string | null = null
    isCaller = false

    private remoteCandidateQueue: any[] = []
    private remoteDescriptionSet = false

    // 🆕 Static map để queue candidates TRƯỚC KHI tạo PeerConnection
    private static preConnectionCandidateMap: Map<string, any[]> = new Map()

    // 🆕 Static method để queue candidate từ bên ngoài
    static queueCandidateBeforeConnection(fromUserId: string, candidate: any) {
        if (!this.preConnectionCandidateMap.has(fromUserId)) {
            this.preConnectionCandidateMap.set(fromUserId, [])
        }
        this.preConnectionCandidateMap.get(fromUserId)!.push(candidate)
        console.log(
            '📌 Pre-connection candidate queued for',
            fromUserId,
            '(total:',
            this.preConnectionCandidateMap.get(fromUserId)!.length,
            ')',
        )
    }

    // 🆕 Get pending candidates count
    static getPendingCandidatesCount(fromUserId: string): number {
        return this.preConnectionCandidateMap.get(fromUserId)?.length || 0
    }

    // Lấy local audio stream
    async initLocalStream() {
        if (this.localStream) return this.localStream

        const stream = await mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
            } as any,
        })

        this.localStream = stream
        return stream
    }

    // Tạo PeerConnection
    async createPeerConnection(remoteUserId: string, isCaller: boolean) {
        // Tránh tạo duplicate connection
        if (this.pc) {
            console.log('✅ PeerConnection already exists for', remoteUserId)
            return this.pc
        }

        this.remoteUserId = remoteUserId
        this.isCaller = isCaller
        this.pc = new RTCPeerConnection(ICE_CONFIG)

        // Add local tracks
        const localStream = await this.initLocalStream()
        localStream.getTracks().forEach((track: any) => {
            this.pc?.addTrack(track, localStream)
        })

        // ICE candidate - FIX: Tách ra riêng, không gộp với forEach
        ;(this.pc as any).onicecandidate = (event: any) => {
            if (event.candidate && this.remoteUserId) {
                console.log('💧 Emit ICE candidate to', this.remoteUserId)
                SocketUtil.emit('webrtc.ice-candidate', {
                    to_userId: this.remoteUserId,
                    candidate: event.candidate,
                    to_role: 'client',
                })
            }
        }

        // Remote stream
        ;(this.pc as any).ontrack = (event: any) => {
            console.log('🔊 Remote stream received')
            this.remoteStream = event.streams[0]
        }

        // ICE connection state
        ;(this.pc as any).oniceconnectionstatechange = () => {
            console.log('🧊 ICE connection state:', this.pc?.iceConnectionState)
            if (this.pc?.iceConnectionState === 'failed') {
                console.error('❌ ICE connection failed!')
            }
        }

        console.log('🔗 PeerConnection created for', remoteUserId)
        return this.pc
    }

    // Caller tạo offer
    async startCall(remoteUserId: string, from_userId: string) {
        await this.createPeerConnection(remoteUserId, true)
        const offer = await this.pc!.createOffer()
        await this.pc!.setLocalDescription(offer)

        SocketUtil.emit('webrtc.offer', {
            from_userId,
            to_userId: remoteUserId,
            to_role: 'client',
            sdp: offer,
        })
    }

    async handleOffer(from_userId: string, sdp: any, to_userId: string) {
        const preCandidates = WebRTCPartner.preConnectionCandidateMap.get(from_userId) || []
        if (preCandidates.length > 0) {
            console.log('🔄 Loading', preCandidates.length, 'pre-queued candidates')
            this.remoteCandidateQueue.push(...preCandidates)
            WebRTCPartner.preConnectionCandidateMap.delete(from_userId)
        }

        await this.createPeerConnection(from_userId, false)

        console.log('⚙️ Setting remote description...')
        await this.pc!.setRemoteDescription(new RTCSessionDescription(sdp))
        this.remoteDescriptionSet = true
        console.log('✅ Remote description set successfully')

        await this.flushCandidateQueue()

        const answer = await this.pc!.createAnswer()
        await this.pc!.setLocalDescription(answer)

        SocketUtil.emit('webrtc.answer', {
            from_userId: to_userId,
            to_userId: from_userId,
            to_role: 'client',
            sdp: answer,
        })

        console.log('📡 Gửi answer về cho', from_userId)
    }

    // Caller handle answer
    async handleAnswer(sdp: any) {
        if (!this.pc) {
            console.warn('⚠️ handleAnswer: PC not exist')
            return
        }

        console.log('📥 Nhận answer, setting remote description...')
        await this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
        this.remoteDescriptionSet = true
        console.log('✅ Remote description set successfully')

        // Flush candidate queue
        await this.flushCandidateQueue()
    }

    // Cả hai xử lý ICE candidate
    async handleCandidate(payload: any) {
        if (!this.pc) {
            console.warn('⚠️ handleCandidate: PC not exist')
            return
        }

        if (!payload.candidate) {
            console.warn('⚠️ handleCandidate: candidate undefined')
            return
        }

        const candidate = new RTCIceCandidate(payload.candidate)

        // Kiểm tra remoteDescription đã set chưa
        if (
            this.remoteDescriptionSet &&
            this.pc.remoteDescription &&
            this.pc.remoteDescription.type
        ) {
            try {
                await this.pc.addIceCandidate(candidate)
                console.log('✅ addIceCandidate thành công')
            } catch (e) {
                console.error('❌ addIceCandidate error:', e)
            }
        } else {
            // Queue candidate nếu remoteDescription chưa set
            this.remoteCandidateQueue.push(candidate)
            console.log(
                '📌 Candidate pushed to queue (total:',
                this.remoteCandidateQueue.length,
                ')',
            )
        }
    }

    // Flush tất cả candidates trong queue
    async flushCandidateQueue() {
        if (!this.pc || this.remoteCandidateQueue.length === 0) return

        console.log('🚀 Flushing', this.remoteCandidateQueue.length, 'candidates from queue...')

        while (this.remoteCandidateQueue.length > 0) {
            const candidate = this.remoteCandidateQueue.shift()
            try {
                await this.pc.addIceCandidate(candidate)
                console.log('✅ Flushed candidate successfully')
            } catch (e) {
                console.error('❌ flushCandidateQueue error:', e)
            }
        }

        console.log('✅ Candidate queue flushed')
    }

    // Kết thúc cuộc gọi
    async endCall() {
        console.log('📴 Ending call...')

        try {
            this.localStream?.getTracks().forEach((t: any) => t.stop())
            this.pc?.close()
        } catch (e) {
            console.error('Error ending call:', e)
        }

        this.pc = null
        this.localStream = null
        this.remoteStream = null
        this.remoteUserId = null
        this.isCaller = false
        this.remoteCandidateQueue = []
        this.remoteDescriptionSet = false

        console.log('✅ Call ended, resources cleaned')
    }
}

// Export both instance and class
const instance = new WebRTCPartner()
export { WebRTCPartner as WebRTCPartnerClass }
export default instance
