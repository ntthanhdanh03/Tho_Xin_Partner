import * as actions from '../actions/orderAction'
import { put, takeLatest, delay, all, call } from 'redux-saga/effects'
import * as types from '../types'
import { IResponse } from '../../interfaces'
import { api } from '../../services/api'

function* getOrderSaga({ payload, callback }: ReturnType<typeof actions.getOrderAction>) {
    try {
        const params: any = {
            // filter: {
            //     where: {},
            //     include: ['createdBy', 'like'],
            //     order: 'createdAt DESC',
            // },
        }

        console.log('params', params)

        const response: IResponse = yield call(() => api.get('/orders', { params }))
        console.log('***getOrderSaga', response)
        if (response && response?.status === 200 && response?.data) {
            console.log('payload', payload)
            yield put(actions.getOrderSuccessAction(response?.data))

            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('getOrderSaga', e, e?.response)
        callback && callback(null, 'failure')
    }
}

function* applicantOrderSaga({
    payload,
    callback,
}: ReturnType<typeof actions.applicantOrderAction>) {
    try {
        console.log('payloadpayloadpayloadpayloadpayloadpayload', payload)
        const response: IResponse = yield call(() =>
            api.patch(`/orders/${payload?.id}/applicants`, payload.postData),
        )

        if (response && response?.status === 200 && response?.data) {
            yield put(actions.applicantOrderSuccessAction(response?.data))
            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('applicantOrderSaga', e, e?.response)
        callback && callback(null, 'failure')
    }
}

export default function* orderSaga() {
    yield all([takeLatest(types.GET_ORDER, getOrderSaga)])
    yield all([takeLatest(types.APPLICANT_ORDER, applicantOrderSaga)])
}
