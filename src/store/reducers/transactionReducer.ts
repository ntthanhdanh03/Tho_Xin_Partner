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

const transactionReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.GET_HISTORY_TRANSACTION: {
            return { ...state, loading: true }
        }
        case types.GET_HISTORY_TRANSACTION + types.SUCCESS: {
            return { ...state, data: action.payload, loading: false }
        }
        default: {
            return state
        }
    }
}

export default transactionReducer
