import { updateAppointmentAction } from './../actions/appointmentAction'
import * as actions from '../actions/appointmentAction'
import { put, takeLatest, delay, all, call } from 'redux-saga/effects'
import * as types from '../types'
import { IResponse } from '../../interfaces'
import { api } from '../../services/api'

function* getAppointmentSaga({
    payload,
    callback,
}: ReturnType<typeof actions.getAppointmentAction>) {
    try {
        const response: IResponse = yield call(() =>
            api.get(`/appointments/partner/${payload.partnerId}`),
        )
        console.log('***getAppointmentSaga', response)
        if (response && response?.status === 200 && response?.data) {
            yield put(actions.getAppointmentSuccessAction(response?.data))
            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('getAppointmentSaga', e, e?.response)
        callback && callback(null, 'failure')
    }
}

function* updateAppointmentSaga({
    payload,
    callback,
}: ReturnType<typeof actions.updateAppointmentAction>) {
    try {
        const response: IResponse = yield call(() =>
            api.patch(`/appointments/${payload?.id}/partner`, payload.postData),
        )
        if (response && response?.status === 200 && response?.data) {
            const dataUpdate = {
                data: response?.data,
                typeUpdate: payload.typeUpdate,
            }
            yield put(actions.updateAppointmentSuccessAction(dataUpdate))

            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('updateAppointmentSaga', e, e?.response)
        callback && callback(null, 'failure')
    }
}

function* updateCompleteAppointmentSaga({
    payload,
    callback,
}: ReturnType<typeof actions.updateCompleteAppointmentAction>) {
    try {
        const response: IResponse = yield call(() =>
            api.patch(`/appointments/${payload?.appointmentId}/complete`, payload.postData),
        )
        if (response && response?.status === 200 && response?.data) {
            console.log('***updateCompleteAppointmentSaga', response?.data)
            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('updateCompleteAppointmentSaga', e, e?.response)
        callback && callback(null, 'failure')
    }
}

export default function* appointmentSaga() {
    yield all([
        takeLatest(types.GET_APPOINTMENT, getAppointmentSaga),
        takeLatest(types.UPDATE_APPOINTMENT, updateAppointmentSaga),
        takeLatest(types.UPDATE_COMPLETE_APPOINTMENT, updateCompleteAppointmentSaga),
    ])
}
