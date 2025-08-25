import AsyncStorage from '@react-native-async-storage/async-storage'
import { checkPhoneExistAction } from './../actions/authAction'
import { put, takeLatest, delay, all, call } from 'redux-saga/effects'
import * as actions from '../actions/authAction'
import * as types from '../types'
import { IResponse } from '../../interfaces'
import { api } from '../../services/api'

function* checkPhoneExistSaga({
    payload,
    callback,
}: ReturnType<typeof actions.checkPhoneExistAction>) {
    try {
        const postData = {
            phoneNumber: payload?.phoneNumber,
            role: payload?.role,
        }
        const checkUserResponse: IResponse = yield call(() =>
            api.post('/auth/checkPhoneExist', postData),
        )
        if (checkUserResponse?.data?.exists === true) {
            callback && callback(true, null)
        } else {
            callback && callback(false, null)
        }
    } catch (e: any) {
        console.error('Error in checkPhoneExistSaga:', e)
        callback?.(false, e)
    }
}

function* partnerRegisterSaga({
    payload,
    callback,
}: ReturnType<typeof actions.partnerRegisterAction>) {
    try {
        const postData = {
            phoneNumber: payload?.phoneNumber,
            password: payload?.password,
            role: payload?.role,
        }
        const checkUserResponse: IResponse = yield call(() => api.post('/auth/register', postData))
        console.log('checkUserResponse?.data', checkUserResponse?.data)
        if (checkUserResponse?.data?.success === true) {
            callback?.(checkUserResponse.data, null)
        } else {
            callback?.(null, checkUserResponse?.data?.message || 'Đăng ký thất bại')
        }
    } catch (e: any) {
        console.error('Error in partnerRegisterSaga:', e)
        callback?.(false, e)
    }
}

function* loginSaga({ payload, callback }: ReturnType<typeof actions.loginAction>) {
    try {
        const response: IResponse = yield call(() =>
            api.post('/auth/login', {
                phoneNumber: payload.phoneNumber,
                password: payload.password,
            }),
        )

        if (response?.data?.token) {
            console.log('responseeeeeeeeeeeeeeeeeeeeeee', response?.data)
            callback?.(response.data, null)
            yield call(AsyncStorage.setItem, 'authToken', response.data.token)
            yield put(actions.loginSuccessAction(response?.data))
        } else {
            callback?.(null, response?.data?.message || 'Đăng nhập thất bại')
        }
    } catch (e: any) {
        console.error('Error in loginSaga:', e)
        const errMsg = e?.response?.data?.message || e?.message || 'Đăng nhập thất bại'
        callback?.(null, errMsg)
    }
}

export default function* authSaga() {
    yield all([takeLatest(types.CHECK_PHONE_EXIST, checkPhoneExistSaga)])
    yield all([takeLatest(types.PARTNER_REGISTER, partnerRegisterSaga)])
    yield all([takeLatest(types.LOG_IN, loginSaga)])
}
