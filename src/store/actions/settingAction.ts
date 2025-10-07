import * as types from '../types'

export const updateSettingAction = (data: any, callback?: any) => ({
    type: types.UPDATE_SETTING,
    payload: data,
    callback,
})

export const updateAupdateSettingSuccessAction = (data: any) => ({
    type: types.UPDATE_SETTING + types.SUCCESS,
    payload: data,
})
