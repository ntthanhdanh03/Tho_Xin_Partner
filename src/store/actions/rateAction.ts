import * as types from '../types'

export const getRateAction = (data: any, callback?: any) => ({
    type: types.GET_RATE,
    payload: data,
    callback,
})

export const getAppointmentSuccessAction = (data: any) => ({
    type: types.GET_RATE + types.SUCCESS,
    payload: data,
})
