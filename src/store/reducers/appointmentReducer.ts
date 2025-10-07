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

const appointmentReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.GET_APPOINTMENT: {
            return { ...state, loading: true }
        }
        case types.GET_APPOINTMENT + types.SUCCESS: {
            return { ...state, data: action.payload, loading: false }
        }
        case types.UPDATE_APPOINTMENT + types.SUCCESS: {
            const { data, typeUpdate } = action.payload
            console.log('typeUpdateeeeeeeeeee', action.payload)
            console.log('dataaaaaaaaaaaaaaaaaaaaa', data)
            if (typeUpdate === 'APPOINTMENT_UPDATE_IN_PROGRESS') {
                return {
                    ...state,
                    loading: false,
                    data: {
                        ...state.data,
                        appointmentInProgress: [data],
                    },
                }
            }

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

export default appointmentReducer
