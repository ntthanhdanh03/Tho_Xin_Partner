import * as types from '../types'

export const getAppointmentAction = (data: any, callback?: any) => ({
    type: types.GET_APPOINTMENT,
    payload: data,
    callback,
})

export const getAppointmentSuccessAction = (data: any) => ({
    type: types.GET_APPOINTMENT + types.SUCCESS,
    payload: data,
})

export const updateAppointmentAction = (data: any, callback?: any) => ({
    type: types.UPDATE_APPOINTMENT,
    payload: data,
    callback,
})

export const updateAppointmentSuccessAction = (data: any) => ({
    type: types.UPDATE_APPOINTMENT + types.SUCCESS,
    payload: data,
})

export const updateCompleteAppointmentAction = (data: any, callback?: any) => ({
    type: types.UPDATE_COMPLETE_APPOINTMENT,
    payload: data,
    callback,
})

export const updateCompleteAppointmentSuccessAction = (data: any) => ({
    type: types.UPDATE_COMPLETE_APPOINTMENT + types.SUCCESS,
    payload: data,
})
