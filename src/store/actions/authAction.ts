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

export const logoutAction = () => ({
    type: types.LOG_OUT,
    payload: null,
})

export const partnerRegisterAction = (data: any, callback?: any) => ({
    type: types.PARTNER_REGISTER,
    payload: data,
    callback,
})

export const refreshTokenAction = (data: any, callback?: any) => ({
    type: types.REFRESH_TOKEN,
    payload: data,
    callback,
})

export const refreshTokenSuccessAction = (data: any) => ({
    type: types.REFRESH_TOKEN + types.SUCCESS,
    payload: data,
})

export const checkPhoneExistAction = (data: any, callback?: any) => ({
    type: types.CHECK_PHONE_EXIST,
    payload: data,
    callback,
})
export const createInstallationAction = (data: any, callback?: any) => ({
    type: types.CREATE_INSTALLATION,
    payload: data,
    callback,
})

export const createInstallationSuccessAction = (data: any) => ({
    type: types.CREATE_INSTALLATION + types.SUCCESS,
    payload: data,
})

export const deleteInstallationAction = (data: any, callback?: any) => ({
    type: types.DELETE_INSTALLATION,
    payload: data,
    callback,
})

export const updateUserAction = (data: any, callback?: any) => ({
    type: types.UPDATE_USER,
    payload: data,
    callback,
})

export const updateUserSuccessAction = (data: any) => ({
    type: types.UPDATE_USER + types.SUCCESS,
    payload: data,
})

export const updateUserKYCAction = (data: any, callback?: any) => ({
    type: types.UPDATE_USER_KYC,
    payload: data,
    callback,
})

export const updateUserKYCSuccessAction = (data: any) => ({
    type: types.UPDATE_USER_KYC + types.SUCCESS,
    payload: data,
})
