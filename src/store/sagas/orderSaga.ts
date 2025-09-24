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

        const response: IResponse = yield call(() => api.get('/api/Posts', { params }))
        console.log('***getPostQuestionSaga', response)
        if (response && response?.status === 200 && response?.data) {
            console.log('payload', payload)
            yield put(actions.getOrderSuccessAction(response?.data))

            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('getPostSaga', e, e?.response)
        callback && callback(null, 'failure')
    }
}

export default function* orderSaga() {
    yield all([takeLatest(types.GET_ORDER, getOrderSaga)])
}
