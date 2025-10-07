import { getChatRoomByApplicantAction } from './../actions/chatAction'
import * as actions from '../actions/chatAction'
import { put, takeLatest, delay, all, call } from 'redux-saga/effects'
import * as types from '../types'
import { IResponse } from '../../interfaces'
import { api } from '../../services/api'

function* getChatRoomByApplicantSaga({
    payload,
    callback,
}: ReturnType<typeof actions.getChatRoomByApplicantAction>) {
    try {
        const response: IResponse = yield call(() =>
            api.get(`/chat/messages/applicant/${payload._applicantId}`),
        )
        if (response && response.status === 200 && response.data) {
            yield put(actions.getChatRoomByApplicantSuccessAction(response.data))
            callback && callback(response.data, null)
        } else {
            callback && callback(null, 'Không thể lấy phòng chat')
        }
    } catch (e: any) {
        console.log('getChatRoomByApplicantSaga error', e, e?.response)
        const errorMessage = e?.response?.data?.message || 'Đã xảy ra lỗi khi lấy phòng chat'
        callback && callback(null, errorMessage)
    }
}

function* sendMessageSaga({ payload, callback }: ReturnType<typeof actions.sendMessageAction>) {
    try {
        const API = `/chat/message`
        const response: IResponse = yield call(() => api.post(API, payload.postData))

        console.log('***sendMessageSaga', response)

        if (response && [200, 201].includes(response.status) && response.data) {
            yield put(actions.sendMessageSuccessAction(response?.data))
            callback && callback(response?.data, null)
        } else {
            const message = response?.data?.message || 'Tạo đơn hàng thất bại, vui lòng thử lại.'
            callback && callback(null, message)
        }
    } catch (e: any) {
        console.log('sendMessageSaga', e, e?.response)
        const errorMessage = e?.response?.data?.message || 'Đã có lỗi xảy ra khi tạo đơn hàng.'
        callback && callback(null, errorMessage)
    }
}

export default function* chatSaga() {
    yield all([
        takeLatest(types.GET_CHAT_BY_APPLICANT, getChatRoomByApplicantSaga),
        // takeLatest(types.GET_MESSAGE, getMessageSaga),
        takeLatest(types.SEND_MESSAGE, sendMessageSaga),
    ])
}
