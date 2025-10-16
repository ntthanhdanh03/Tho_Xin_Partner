import * as types from '../types'

export const createQrTopUpAction = (data: any, callback?: any) => ({
    type: types.CREATE_QR_TOP_UP,
    payload: data,
    callback,
})

export const createQrTopUpSuccessAction = (data: any) => ({
    type: types.CREATE_QR_TOP_UP + types.SUCCESS,
    payload: data,
})

export const createRequestWithDrawAction = (data: any, callback?: any) => ({
    type: types.CREATE_REQUEST_WITH_DRAW,
    payload: data,
    callback,
})

export const createRequestWithDrawSuccessAction = (data: any) => ({
    type: types.CREATE_REQUEST_WITH_DRAW + types.SUCCESS,
    payload: data,
})

export const createQrPaidAction = (data: any, callback?: any) => ({
    type: types.CREATE_QR_PAID,
    payload: data,
    callback,
})

export const createQrPaidSuccessAction = (data: any) => ({
    type: types.CREATE_QR_PAID + types.SUCCESS,
    payload: data,
})

export const TopUpSuccessAction = (data: any) => ({
    type: types.TOP_UP + types.SUCCESS,
    payload: data,
})

export const getHistoryTransactionAction = (data: any, callback?: any) => ({
    type: types.GET_HISTORY_TRANSACTION,
    payload: data,
    callback,
})

export const getHistoryTransactionSuccessAction = (data: any) => ({
    type: types.GET_HISTORY_TRANSACTION + types.SUCCESS,
    payload: data,
})
