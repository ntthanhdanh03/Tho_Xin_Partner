import * as types from '../types'

export const loginAction = (data: any, callback?: any) => ({
    type: types.LOG_IN,
    payload: data,
    callback,
})

export const loginSuccessAction = (data: any) => ({
    type: types.LOG_IN + types.SUCCESS,
    payload: data,
})

export const loginFailureAction = () => ({
    type: types.LOG_IN + types.FAILURE,
    payload: null,
})

export const partnerRegisterAction = (data: any, callback?: any) => ({
    type: types.PARTNER_REGISTER,
    payload: data,
    callback,
})

export const checkPhoneExistAction = (data: any, callback?: any) => ({
    type: types.CHECK_PHONE_EXIST,
    payload: data,
    callback,
})
