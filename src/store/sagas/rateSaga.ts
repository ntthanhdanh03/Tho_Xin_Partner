import * as actions from './../actions/rateAction'
import { put, takeLatest, delay, all, call } from 'redux-saga/effects'
import * as types from '../types'
import { IResponse } from '../../interfaces'
import { api } from '../../services/api'

function* getRateSaga({ payload, callback }: ReturnType<typeof actions.getRateAction>) {
    try {
        const response: IResponse = yield call(() => api.get(`/rates/partner/${payload.partnerId}`))
        console.log('***getRateSaga', response)
        if (response && response?.status === 200 && response?.data) {
            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('getAppointmentSaga', e, e?.response)
        callback && callback(null, 'failure')
    }
}
export default function* rateSaga() {
    yield all([takeLatest(types.GET_RATE, getRateSaga)])
}
