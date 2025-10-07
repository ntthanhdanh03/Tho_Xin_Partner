import * as types from '../types'

export const updateLocationPartnerAction = (data: any, callback?: any) => ({
    type: types.UPDATE_LOCATION_PARTNER,
    payload: data,
    callback,
})

export const updateLocationPartnerSuccessAction = (data: any) => ({
    type: types.UPDATE_LOCATION_PARTNER + types.SUCCESS,
    payload: data,
})
