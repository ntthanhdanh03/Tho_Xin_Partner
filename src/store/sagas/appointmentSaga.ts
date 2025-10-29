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

function* getAppointmentByIdSaga({
    payload,
    callback,
}: ReturnType<typeof actions.getAppointmentByIdAction>) {
    try {
        const response: IResponse = yield call(() =>
            api.get(`/appointments/${payload.appointmentId}`),
        )
        console.log('***getAppointmentByIdSaga', response)
        if (response && response?.status === 200 && response?.data) {
            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('getAppointmentByIdSaga', e, e?.response)
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

function* updateCancelAppointmentSaga({
    payload,
    callback,
}: ReturnType<typeof actions.updateCancelAppointmentAction>) {
    try {
        const response: IResponse = yield call(() =>
            api.post(`/appointments/${payload?.id}/cancel`, { reason: payload.reason }),
        )
        if (response?.status === 201 && response?.data) {
            console.log('***updateCancelAppointmentSaga', response.data)
            callback?.(response.data, null)
        } else {
            callback?.(null, 'failure')
        }
    } catch (e: any) {
        console.log('updateCancelAppointmentSaga', e, e?.response)
        callback?.(null, 'failure')
    }
}

export default function* appointmentSaga() {
    yield all([
        takeLatest(types.GET_APPOINTMENT, getAppointmentSaga),
        takeLatest(types.GET_APPOINTMENT_BY_ID, getAppointmentByIdSaga),
        takeLatest(types.UPDATE_APPOINTMENT, updateAppointmentSaga),
        takeLatest(types.UPDATE_COMPLETE_APPOINTMENT, updateCompleteAppointmentSaga),
        takeLatest(types.UPDATE_CANCEL_APPOINTMENT, updateCancelAppointmentSaga),
    ])
}
