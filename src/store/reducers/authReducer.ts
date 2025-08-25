import * as types from '../types'

interface IState {
    loading: boolean
    data: any
}

interface IAction {
    type: string
    payload: any
    callback: string
}

const initialState: IState = {
    loading: false,
    data: null,
}

const authReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.LOG_IN: {
            return { ...state, loading: true }
        }
        case types.LOG_IN + types.SUCCESS: {
            console.log('action.payloaddddddddd', action.payload)
            return { ...state, data: action.payload, loading: false, type: 'new' }
        }
        case types.LOG_IN + types.FAILURE: {
            return { ...state, data: null, loading: false }
        }
        case types.LOG_OUT: {
            return { ...state, data: null, loading: false }
        }
        default: {
            return state
        }
    }
}

export default authReducer
