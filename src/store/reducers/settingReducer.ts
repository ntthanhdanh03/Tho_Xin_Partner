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

const settingReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.UPDATE_APPOINTMENT + types.SUCCESS: {
            return {
                ...state,
                loading: false,
                data: state.data,
            }
        }
        default: {
            return state
        }
    }
}

export default settingReducer
