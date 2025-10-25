import React, { useEffect, useRef, useState } from 'react'
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FastImage from 'react-native-fast-image'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessageAction } from '../../store/actions/chatAction'
import { Colors } from '../../styles/Colors'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { ic_chevron_left } from '../../assets'
import CallModal from '../../navigation/CallModal'

const ChatViewVer2 = () => {
    const route = useRoute()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const flatListRef = useRef<FlatList<any>>(null)

    const roomData = useSelector((store: any) => store.chat?.data?.rooms)
    const messageData = useSelector((store: any) => store.chat?.data?.messages)
    const { data: authData } = useSelector((store: any) => store.auth)
    const { dataRoomChat }: any = route.params || {}

    const [messages, setMessages] = useState<any[]>([])
    const [text, setText] = useState('')
    const [inputHeight, setInputHeight] = useState(35)
    const [roomId, setRoomId] = useState()

    useEffect(() => {
        const foundRoom = roomData?.find(
            (room: any) =>
                room.orderId === dataRoomChat.orderId && room.clientId === dataRoomChat.clientId,
        )
        setRoomId(foundRoom?._id)
        if (messageData && foundRoom?._id) {
            const filteredMessages = messageData.filter(
                (msg: any) => msg.roomId === foundRoom._id.toString(),
            )
            setMessages(filteredMessages)
        }
    }, [messageData, roomData, dataRoomChat])

    const handleSendMessages = async () => {
        if (!text.trim()) return

        const newMessage = {
            _id: Date.now().toString(),
            roomId: dataRoomChat?.roomId,
            senderType: 'partner',
            content: text.trim(),
        }
        setMessages((prev) => [...prev, newMessage])
        setText('')
        const postData = {
            roomId: roomId,
            senderId: authData?.user?._id,
            senderType: 'partner',
            receiverId: dataRoomChat?.clientId,
            content: text.trim(),
            orderId: dataRoomChat?.orderId,
        }
        dispatch(sendMessageAction({ postData }))
    }

    const renderMessage = ({ item }: any) => {
        const isMe = item.senderType === 'partner'
        return (
            <View
                style={[
                    styles.messageContainer,
                    isMe ? styles.sentMessage : styles.receivedMessage,
                ]}
            >
                <Text style={isMe ? styles.sentText : styles.receivedText}>{item.content}</Text>
                <Text style={isMe ? styles.sentTime : styles.receivedTime}>
                    {new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={[DefaultStyles.container, { backgroundColor: 'white' }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ padding: 5, marginRight: 5 }}
                    >
                        <FastImage source={ic_chevron_left} style={{ width: 26, height: 26 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Khách hàng</Text>

                    <TouchableOpacity
                        onPress={() => {
                            CallModal.show()
                        }}
                    >
                        <Text style={{ textAlign: 'right' }}> GỌi</Text>
                    </TouchableOpacity>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={renderMessage}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {/* Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={text}
                            placeholder="Nhập tin nhắn..."
                            placeholderTextColor={Colors.gray72}
                            style={[styles.textInput, { height: Math.max(40, inputHeight) }]}
                            multiline
                            maxLength={500}
                            onContentSizeChange={(e) => {
                                const newHeight = e.nativeEvent.contentSize.height
                                const maxHeight = 100
                                setInputHeight(Math.min(newHeight, maxHeight))
                            }}
                            onChangeText={(val) => setText(val)}
                        />

                        {text.trim() && (
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={handleSendMessages}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.sendIcon}>➤</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatViewVer2

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: scaleModerate(4),
        paddingHorizontal: scaleModerate(14),
        paddingVertical: scaleModerate(10),
        borderRadius: scaleModerate(18),
        maxWidth: '75%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.primary,
        borderBottomRightRadius: scaleModerate(4),
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.whiteFF,
        borderBottomLeftRadius: scaleModerate(4),
        borderWidth: 1,
        borderColor: Colors.border01,
    },
    sentText: {
        color: Colors.whiteFF,
        fontSize: 15,
        lineHeight: 20,
    },
    receivedText: {
        color: Colors.black1B,
        fontSize: 15,
        lineHeight: 20,
    },
    sentTime: {
        color: Colors.whiteFF,
        fontSize: 11,
        marginTop: scaleModerate(4),
        opacity: 0.7,
        alignSelf: 'flex-end',
    },
    receivedTime: {
        color: Colors.gray72,
        fontSize: 11,
        marginTop: scaleModerate(4),
        alignSelf: 'flex-end',
    },
    inputContainer: {
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(10),
        borderTopWidth: 1,
        borderColor: Colors.border01,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: Colors.grayF5,
        borderRadius: scaleModerate(24),
        paddingHorizontal: scaleModerate(6),
        paddingVertical: scaleModerate(6),
    },
    textInput: {
        flex: 1,
        color: Colors.black1B,
        fontSize: 15,
        paddingHorizontal: scaleModerate(8),
        paddingTop: scaleModerate(10),
        paddingBottom: scaleModerate(10),
        maxHeight: 100,
    },
    sendButton: {
        width: scaleModerate(36),
        height: scaleModerate(36),
        borderRadius: scaleModerate(18),
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scaleModerate(4),
    },
    sendIcon: {
        color: Colors.whiteFF,
        fontSize: 18,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaleModerate(12),
        paddingVertical: scaleModerate(10),
        borderBottomWidth: 1,
        borderBottomColor: Colors.border01,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
    },
})
