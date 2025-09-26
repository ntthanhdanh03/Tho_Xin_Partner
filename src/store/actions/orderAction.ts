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
