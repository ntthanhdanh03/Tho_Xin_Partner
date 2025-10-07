import * as types from '../types'

export const getChatRoomByApplicantAction = (data: any, callback?: any) => ({
    type: types.GET_CHAT_BY_APPLICANT,
    payload: data,
    callback,
})

export const getChatRoomByApplicantSuccessAction = (data: any) => ({
    type: types.GET_CHAT_BY_APPLICANT + types.SUCCESS,
    payload: data,
})

export const sendMessageAction = (data: any, callback?: any) => ({
    type: types.SEND_MESSAGE,
    payload: data,
    callback,
})

export const sendMessageSuccessAction = (data: any) => ({
    type: types.SEND_MESSAGE + types.SUCCESS,
    payload: data,
})
