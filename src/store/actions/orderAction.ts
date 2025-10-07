import * as types from '../types'

export const getOrderAction = (data: any, callback?: any) => ({
    type: types.GET_ORDER,
    payload: data,
    callback,
})

export const getOrderSuccessAction = (data: any) => ({
    type: types.GET_ORDER + types.SUCCESS,
    payload: data,
})

export const applicantOrderAction = (data: any, callback?: any) => ({
    type: types.APPLICANT_ORDER,
    payload: data,
    callback,
})

export const applicantOrderSuccessAction = (data: any) => ({
    type: types.APPLICANT_ORDER + types.SUCCESS,
    payload: data,
})

export const cancelApplicantOrderAction = (data: any, callback?: any) => ({
    type: types.CANCEL_APPLICANT,
    payload: data,
    callback,
})

export const cancelApplicantOrderSuccessAction = (data: any) => ({
    type: types.CANCEL_APPLICANT + types.SUCCESS,
    payload: data,
})
