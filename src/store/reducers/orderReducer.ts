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

const orderReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.GET_ORDER: {
            return { ...state, loading: true }
        }
        case types.GET_ORDER + types.SUCCESS: {
            return { ...state, data: action.payload, loading: false }
        }
        case types.APPLICANT_ORDER: {
            return { ...state, loading: true }
        }
        case types.APPLICANT_ORDER + types.SUCCESS: {
            return {
                ...state,
                data: state.data.map((order: any) =>
                    order._id === action.payload._id ? action.payload : order,
                ),
                loading: false,
            }
        }
        case types.CANCEL_APPLICANT: {
            return { ...state, loading: true }
        }
        case types.CANCEL_APPLICANT + types.SUCCESS: {
            return {
                ...state,
                data: state.data.map((order: any) =>
                    order._id === action.payload._id ? action.payload : order,
                ),
                loading: false,
            }
        }

        default: {
            return state
        }
    }
}

export default orderReducer
