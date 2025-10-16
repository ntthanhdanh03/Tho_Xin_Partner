import { getHistoryTransactionAction } from './../actions/transactionAction'
import * as actions from '../actions/transactionAction'
import { put, takeLatest, call, all } from 'redux-saga/effects'
import * as types from '../types'
import { IResponse } from '../../interfaces'
import { api } from '../../services/api'

function* createQrTopUpSaga({ payload, callback }: ReturnType<typeof actions.createQrTopUpAction>) {
    try {
        const response: IResponse = yield call(() => api.post('/payment/topup', payload))

        console.log('*** createQrTopUpSaga response:', response)

        if (response?.status === 201 && response?.data?.qrUrl) {
            callback && callback(response.data.qrUrl, null)
        } else {
            callback && callback(null, 'Không tạo được mã QR')
        }
    } catch (e: any) {
        console.log('createQrTopUpSaga error:', e)
        callback && callback(null, e?.response?.data?.message || 'failure')
    }
}

function* createQrPaidSaga({ payload, callback }: ReturnType<typeof actions.createQrPaidAction>) {
    try {
        const response: IResponse = yield call(() => api.post('/payment/paid', payload))

        console.log('*** createQrPaidSaga response:', response)

        if (response?.status === 201 && response?.data?.qrUrl) {
            callback && callback(response.data.qrUrl, null)
        } else {
            callback && callback(null, 'Không tạo được mã QR')
        }
    } catch (e: any) {
        console.log('createQrPaidSaga error:', e)
        callback && callback(null, e?.response?.data?.message || 'failure')
    }
}

function* createRequestWithDraw({
    payload,
    callback,
}: ReturnType<typeof actions.createRequestWithDrawAction>) {
    try {
        const response: IResponse = yield call(() => api.post('/payment/with-draw', payload))

        console.log('*** createRequestWithDraw response:', response)

        if (response?.status === 201 && response?.data?.qrUrl) {
            callback && callback(response.data.qrUrl, null)
        } else {
            callback && callback(null, 'Không tạo được mã QR')
        }
    } catch (e: any) {
        console.log('createRequestWithDraw error:', e)
        callback && callback(null, e?.response?.data?.message || 'failure')
    }
}

function* getHistoryTransactionSaga({
    payload,
    callback,
}: ReturnType<typeof actions.getHistoryTransactionAction>) {
    try {
        const response: IResponse = yield call(() => api.get(`/payment/user/${payload.partnerId}`))
        console.log('***getHistoryTransaction', response)
        if (response && response?.status === 200 && response?.data) {
            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('getHistoryTransaction', e, e?.response)
        callback && callback(null, 'failure')
    }
}

export default function* transactionSaga() {
    yield all([
        takeLatest(types.CREATE_QR_TOP_UP, createQrTopUpSaga),
        takeLatest(types.CREATE_QR_PAID, createQrPaidSaga),
        takeLatest(types.CREATE_REQUEST_WITH_DRAW, createRequestWithDraw),
        takeLatest(types.GET_HISTORY_TRANSACTION, getHistoryTransactionSaga),
    ])
}
