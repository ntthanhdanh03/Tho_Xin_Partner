import * as types from '../types'

interface IState {
    loading: boolean
    data: any
}

interface IAction {
    type: string
    payload: any
    callback?: () => void
}

const initialState: IState = {
    loading: false,
    data: null,
}

const chatReducer = (state = initialState, action: IAction): IState => {
    switch (action.type) {
        case types.GET_CHAT_BY_APPLICANT: {
            return { ...state, loading: true }
        }
        case types.GET_CHAT_BY_APPLICANT + types.SUCCESS: {
            return {
                ...state,
                loading: false,
                data: action.payload,
            }
        }

        default:
            return state
    }
}

export default chatReducer
