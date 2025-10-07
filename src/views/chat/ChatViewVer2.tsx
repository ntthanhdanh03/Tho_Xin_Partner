import React, { useEffect, useRef, useState } from 'react'
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FastImage from 'react-native-fast-image'
import { useNavigation, useRoute } from '@react-navigation/native'
import Spacer from '../components/Spacer'
import { Colors } from '../../styles/Colors'
import { DefaultStyles } from '../../styles/DefaultStyles'
import { scaleModerate } from '../../styles/scaleDimensions'
import { ic_chevron_left } from '../../assets'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessageAction } from '../../store/actions/chatAction'

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
    const [inputHeight, setInputHeight] = useState(30)
    const [roomId, setRoomId] = useState()

    useEffect(() => {
        const foundRoom = roomData?.find(
            (room: any) =>
                room.orderId === dataRoomChat.orderId && room.clientId === dataRoomChat.clientId,
        )
        console.log(foundRoom)
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
                <Text style={{ color: isMe ? 'white' : 'black' }}>{item.content}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={DefaultStyles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={100}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => navigation.goBack()}
                    >
                        <FastImage style={{ height: 28, width: 28 }} source={ic_chevron_left} />
                    </TouchableOpacity>
                    <Spacer width={10} />
                    <View>
                        <Text style={DefaultStyles.textMedium16Black}>Khách hàng</Text>
                    </View>
                </View>

                {/* Danh sách tin nhắn */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item._id}
                        renderItem={renderMessage}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 10 }}
                        onContentSizeChange={() => {
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }}
                        onLayout={() => {
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.inputBox}>
                        <Spacer width={10} />
                        <TextInput
                            value={text}
                            placeholder="Aa"
                            style={{
                                height: scaleModerate(inputHeight),
                                width: '90%',
                                color: 'black',
                            }}
                            multiline
                            numberOfLines={2}
                            onContentSizeChange={(e) => {
                                const newHeight = e.nativeEvent.contentSize.height
                                const maxHeight = scaleModerate(55)
                                setInputHeight(Math.min(newHeight, maxHeight))
                            }}
                            onChangeText={(val) => setText(val)}
                        />
                    </View>
                    <Spacer width={10} />
                    {text.trim() ? (
                        <TouchableOpacity onPress={handleSendMessages}>
                            <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Gửi</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatViewVer2

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleModerate(10),
        borderBottomWidth: 1,
        borderColor: Colors.border01,
        paddingHorizontal: scaleModerate(10),
    },
    avatar: {
        height: scaleModerate(35),
        width: scaleModerate(35),
        borderRadius: scaleModerate(35),
        borderWidth: 1,
    },
    messageContainer: {
        marginVertical: 5,
        padding: scaleModerate(10),
        borderRadius: 8,
        maxWidth: '80%',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.primary,
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
    },
    inputContainer: {
        borderTopWidth: 1,
        flexDirection: 'row',
        width: '100%',
        borderColor: Colors.border01,
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: scaleModerate(15),
    },
    inputBox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: Colors.border01,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
})
