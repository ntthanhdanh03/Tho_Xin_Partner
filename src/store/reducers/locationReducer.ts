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

const locationReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.UPDATE_LOCATION_PARTNER: {
            return { ...state, loading: true }
        }
        case types.UPDATE_LOCATION_PARTNER + types.SUCCESS: {
            return { ...state, data: action.payload, loading: false }
        }
        default: {
            return state
        }
    }
}

export default locationReducer
